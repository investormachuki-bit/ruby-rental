"use client";

import { useEffect, useRef, useState } from "react";

import {
  AlertCircle,
  Calculator,
  CheckCircle2,
  ChevronRight,
  Clock3,
  CreditCard,
  LockKeyhole,
  RefreshCw,
  ShieldCheck,
  X,
} from "lucide-react";

import AppShell from "@/components/layout/AppShell";
import Breadcrumb from "@/components/common/Breadcrumb";
import PageContainer from "@/components/ui/PageContainer";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";

import {
  calculateSubscriptionQuote,
  ensureCurrentWorkspaceSubscription,
  CustomerSubscription,
  SubscriptionQuote,
} from "@/services/subscription";

import {
  getSubscriptionPaymentRequest,
  submitSubscriptionPayment,
  SubscriptionPaymentRequest,
} from "@/services/subscriptionPayments";

import { supabase } from "@/lib/supabase";

const PAYBILL = "542 542";
const ACCOUNT = "460 500";
const REFRESH_INTERVAL = 8000;

export default function SubscriptionPage() {
  const [units, setUnits] = useState("");

  const [quote, setQuote] =
    useState<SubscriptionQuote | null>(null);

  const [subscription, setSubscription] =
    useState<CustomerSubscription | null>(null);

  const [paymentRequest, setPaymentRequest] =
    useState<SubscriptionPaymentRequest | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [pageLoading, setPageLoading] =
    useState(true);

  const [refreshingStatus, setRefreshingStatus] =
    useState(false);

  const [submittingPayment, setSubmittingPayment] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [paymentError, setPaymentError] =
    useState<string | null>(null);

  const [paymentModalOpen, setPaymentModalOpen] =
    useState(false);

  const [
    bankConfirmationMessage,
    setBankConfirmationMessage,
  ] = useState("");

  const calculationRequest =
    useRef(0);

  const refreshInProgress =
    useRef(false);

  /* =========================================================
     FORMATTING
  ========================================================= */

  function formatMoney(
    amount: number,
    currency = "KES",
  ) {
    return `${
      currency === "KES"
        ? "KSh"
        : currency
    } ${amount.toLocaleString(
      "en-KE",
      {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      },
    )}`;
  }

  function formatDate(
    date: string,
  ) {
    return new Date(
      date,
    ).toLocaleDateString(
      "en-KE",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      },
    );
  }

  /* =========================================================
     LOAD PAYMENT REQUEST
  ========================================================= */

  async function loadPaymentRequest(
    subscriptionId: string,
  ) {
    const result =
      await getSubscriptionPaymentRequest(
        subscriptionId,
      );

    if (!result.error) {
      setPaymentRequest(
        result.data,
      );
    }
  }

  /* =========================================================
     NORMALIZE SUBSCRIPTION
  ========================================================= */

  function normalizeSubscription(
    currentSubscription: Record<
      string,
      unknown
    >,
  ): CustomerSubscription {
    return {
      ...currentSubscription,

      subscribed_units:
        Number(
          currentSubscription.subscribed_units,
        ),

      rate_per_unit:
        Number(
          currentSubscription.rate_per_unit,
        ),

      monthly_amount:
        Number(
          currentSubscription.monthly_amount,
        ),
    } as CustomerSubscription;
  }

  /* =========================================================
     REFRESH AUTHORITATIVE SUBSCRIPTION STATUS
  ========================================================= */

  /*
   * IMPORTANT:
   *
   * Admin verification changes the
   * subscriptions table.
   *
   * Therefore we must refresh the actual
   * subscription record, not only the
   * payment request.
   */

  async function refreshSubscriptionStatus(
    subscriptionId?: string,
    showLoader = false,
  ) {
    if (refreshInProgress.current) {
      return;
    }

    refreshInProgress.current = true;

    if (showLoader) {
      setRefreshingStatus(true);
    }

    try {
      const {
        data: {
          user,
        },
      } =
        await supabase.auth.getUser();

      if (!user) {
        return;
      }

      const {
        data: profile,
        error: profileError,
      } =
        await supabase
          .from("profiles")
          .select(
            "workspace_id",
          )
          .eq(
            "id",
            user.id,
          )
          .single();

      if (
        profileError ||
        !profile?.workspace_id
      ) {
        return;
      }

      let query =
        supabase
          .from("subscriptions")
          .select(`
            id,
            workspace_id,
            plan_id,
            subscribed_units,
            rate_per_unit,
            monthly_amount,
            currency,
            status,
            start_date,
            next_billing_date,
            created_at,
            updated_at
          `)
          .eq(
            "workspace_id",
            profile.workspace_id,
          );

      if (subscriptionId) {
        query =
          query.eq(
            "id",
            subscriptionId,
          );
      }

      const {
        data: currentSubscription,
        error: subscriptionError,
      } =
        await query
          .order(
            "created_at",
            {
              ascending: false,
            },
          )
          .limit(1)
          .maybeSingle();

      if (subscriptionError) {
        console.error(
          "Failed to refresh subscription status:",
          subscriptionError,
        );

        return;
      }

      if (!currentSubscription) {
        return;
      }

      const normalized =
        normalizeSubscription(
          currentSubscription,
        );

      setSubscription(
        normalized,
      );

      setUnits(
        String(
          normalized.subscribed_units,
        ),
      );

      const quoteResult =
        await calculateSubscriptionQuote(
          normalized.subscribed_units,
        );

      if (!quoteResult.error) {
        setQuote(
          quoteResult.data,
        );
      }

      await loadPaymentRequest(
        normalized.id,
      );
    } finally {
      refreshInProgress.current =
        false;

      if (showLoader) {
        setRefreshingStatus(
          false,
        );
      }
    }
  }

  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  async function loadCurrentSubscription() {
    setPageLoading(true);
    setError(null);

    try {
      const {
        data: {
          user,
        },
      } =
        await supabase.auth.getUser();

      if (!user) {
        return;
      }

      const {
        data: profile,
        error: profileError,
      } =
        await supabase
          .from("profiles")
          .select(
            "workspace_id",
          )
          .eq(
            "id",
            user.id,
          )
          .single();

      if (
        profileError ||
        !profile?.workspace_id
      ) {
        setError(
          "Your workspace could not be found.",
        );

        return;
      }

      const {
        data: currentSubscription,
        error: subscriptionError,
      } =
        await supabase
          .from("subscriptions")
          .select(`
            id,
            workspace_id,
            plan_id,
            subscribed_units,
            rate_per_unit,
            monthly_amount,
            currency,
            status,
            start_date,
            next_billing_date,
            created_at,
            updated_at
          `)
          .eq(
            "workspace_id",
            profile.workspace_id,
          )
          .order(
            "created_at",
            {
              ascending: false,
            },
          )
          .limit(1)
          .maybeSingle();

      if (subscriptionError) {
        setError(
          subscriptionError.message,
        );

        return;
      }

      if (!currentSubscription) {
        setError(
          "No subscription was found for this workspace.",
        );

        return;
      }

      const normalized =
        normalizeSubscription(
          currentSubscription,
        );

      setSubscription(
        normalized,
      );

      setUnits(
        String(
          normalized.subscribed_units,
        ),
      );

      const quoteResult =
        await calculateSubscriptionQuote(
          normalized.subscribed_units,
        );

      if (!quoteResult.error) {
        setQuote(
          quoteResult.data,
        );
      }

      await loadPaymentRequest(
        normalized.id,
      );
    } catch (loadError) {
      console.error(
        "Failed to load subscription:",
        loadError,
      );

      setError(
        "Unable to load your subscription. Please refresh the page.",
      );
    } finally {
      setPageLoading(false);
    }
  }

  /* =========================================================
     PREPARE SUBSCRIPTION
  ========================================================= */

  async function prepareSubscription(
    numberOfUnits: number,
  ) {
    const requestId =
      ++calculationRequest.current;

    setLoading(true);
    setError(null);

    try {
      const quoteResult =
        await calculateSubscriptionQuote(
          numberOfUnits,
        );

      if (
        requestId !==
        calculationRequest.current
      ) {
        return;
      }

      if (quoteResult.error) {
        setQuote(null);

        setError(
          quoteResult.error,
        );

        return;
      }

      setQuote(
        quoteResult.data,
      );

      const subscriptionResult =
        await ensureCurrentWorkspaceSubscription(
          numberOfUnits,
        );

      if (
        requestId !==
        calculationRequest.current
      ) {
        return;
      }

      if (
        subscriptionResult.error
      ) {
        setError(
          subscriptionResult.error,
        );

        return;
      }

      if (
        !subscriptionResult.data
      ) {
        setError(
          "Ruby Rental could not prepare your subscription.",
        );

        return;
      }

      setSubscription(
        subscriptionResult.data,
      );

      await loadPaymentRequest(
        subscriptionResult.data.id,
      );
    } finally {
      if (
        requestId ===
        calculationRequest.current
      ) {
        setLoading(false);
      }
    }