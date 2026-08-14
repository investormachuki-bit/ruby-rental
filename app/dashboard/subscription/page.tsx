"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

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

const STATUS_REFRESH_INTERVAL = 8000;

export default function SubscriptionPage() {
  const [units, setUnits] =
    useState("");

  const [quote, setQuote] =
    useState<SubscriptionQuote | null>(
      null,
    );

  const [subscription, setSubscription] =
    useState<CustomerSubscription | null>(
      null,
    );

  const [paymentRequest, setPaymentRequest] =
    useState<SubscriptionPaymentRequest | null>(
      null,
    );

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
     NORMALIZE SUBSCRIPTION
  ========================================================= */

  function normalizeSubscription(
    row: Record<string, unknown>,
  ): CustomerSubscription {
    return {
      ...row,

      subscribed_units:
        Number(
          row.subscribed_units,
        ),

      rate_per_unit:
        Number(
          row.rate_per_unit,
        ),

      monthly_amount:
        Number(
          row.monthly_amount,
        ),
    } as CustomerSubscription;
  }

  /* =========================================================
     PAYMENT REQUEST
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
     GET CURRENT WORKSPACE
  ========================================================= */

  async function getCurrentWorkspaceId() {
    const {
      data: {
        user,
      },
    } =
      await supabase.auth.getUser();

    if (!user) {
      return null;
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
      return null;
    }

    return profile.workspace_id;
  }

  /* =========================================================
     LOAD CURRENT SUBSCRIPTION
  ========================================================= */

  async function loadCurrentSubscription() {
    setPageLoading(true);
    setError(null);

    try {
      const workspaceId =
        await getCurrentWorkspaceId();

      if (!workspaceId) {
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
            workspaceId,
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
     AUTHORITATIVE STATUS REFRESH
  ========================================================= */

  /*
   * This is the important part of the fix.
   *
   * Admin verification updates:
   *
   * subscriptions.status = "Active"
   *
   * We therefore read the subscriptions table
   * directly instead of relying only on the payment
   * request status.
   */

  async function refreshSubscriptionStatus(
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
      const workspaceId =
        await getCurrentWorkspaceId();

      if (!workspaceId) {
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
            workspaceId,
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
        console.error(
          "Subscription refresh failed:",
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
  }

  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {
    void loadCurrentSubscription();
  }, []);

  /* =========================================================
     AUTO CALCULATION
  ========================================================= */

  useEffect(() => {
    const numberOfUnits =
      Number(units);

    if (
      !units ||
      !Number.isInteger(
        numberOfUnits,
      ) ||
      numberOfUnits < 1
    ) {
      setQuote(null);
      return;
    }

    /*
     * Do not recreate/change the subscription
     * while a payment is being verified or
     * the subscription is already active.
     */

    if (
      paymentRequest?.status ===
        "Pending" ||
      paymentRequest?.status ===
        "Verified" ||
      subscription?.status ===
        "Active"
    ) {
      return;
    }

    const timer =
      window.setTimeout(() => {
        void prepareSubscription(
          numberOfUnits,
        );
      }, 400);

    return () => {
      window.clearTimeout(
        timer,
      );
    };
  }, [
    units,
    paymentRequest?.status,
    subscription?.status,
  ]);

  /* =========================================================
     POLL WHILE PAYMENT IS PENDING
  ========================================================= */

  useEffect(() => {
    if (
      !subscription ||
      paymentRequest?.status !==
        "Pending"
    ) {
      return;
    }

    /*
     * Check immediately.
     */
    void refreshSubscriptionStatus();

    /*
     * Continue checking every 8 seconds.
     */
    const interval =
      window.setInterval(() => {
        void refreshSubscriptionStatus();
      }, STATUS_REFRESH_INTERVAL);

    return () => {
      window.clearInterval(
        interval,
      );
    };
  }, [
    subscription?.id,
    paymentRequest?.status,
  ]);

  /* =========================================================
     REFRESH WHEN CUSTOMER RETURNS TO TAB
  ========================================================= */

  useEffect(() => {
    function handleFocus() {
      void refreshSubscriptionStatus();
    }

    function handleVisibilityChange() {
      if (
        document.visibilityState ===
        "visible"
      ) {
        void refreshSubscriptionStatus();
      }
    }

    window.addEventListener(
      "focus",
      handleFocus,
    );

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange,
    );

    return () => {
      window.removeEventListener(
        "focus",
        handleFocus,
      );

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange,
      );
    };
  }, []);

  /* =========================================================
     PAYMENT STATES
  ========================================================= */

  const subscriptionActive =
    subscription?.status ===
    "Active";

  const paymentPending =
    paymentRequest?.status ===
      "Pending" &&
    !subscriptionActive;

  const paymentVerified =
    paymentRequest?.status ===
      "Verified" ||
    subscriptionActive;

  const paymentRejected =
    paymentRequest?.status ===
      "Rejected" &&
    !subscriptionActive;

  const canSubmitPayment =
    Boolean(subscription) &&
    Boolean(quote) &&
    !paymentPending &&
    !paymentVerified &&
    !subscriptionActive;

  /* =========================================================
     MANUAL REFRESH
  ========================================================= */

  async function handleManualRefresh() {
    setError(null);

    await refreshSubscriptionStatus(
      true,
    );
  }

  /* =========================================================
     SUBMIT PAYMENT
  ========================================================= */

  async function handleSubmitPayment() {
    if (!subscription) {
      setPaymentError(
        "Your subscription could not be found. Please refresh the page.",
      );

      return;
    }

    const bankMessage =
      bankConfirmationMessage.trim();

    if (!bankMessage) {
      setPaymentError(
        "Please paste your I&M Bank payment confirmation message.",
      );

      return;
    }

    setSubmittingPayment(
      true,
    );

    setPaymentError(null);

    try {
      const result =
        await submitSubscriptionPayment(
          {
            subscriptionId:
              subscription.id,

            amount:
              subscription.monthly_amount,

            currency:
              subscription.currency,

            /*
             * Kept in the database/API for
             * future use, but the customer
             * does not need to enter it.
             */
            transactionReference:
              "",

            bankConfirmationMessage:
              bankMessage,
          },
        );

      if (result.error) {
        setPaymentError(
          result.error,
        );

        return;
      }

      setPaymentRequest(
        result.data,
      );

      setBankConfirmationMessage(
        "",
      );

      setPaymentModalOpen(
        false,
      );

      /*
       * Immediately refresh the subscription/payment
       * state after submission.
       */
      await refreshSubscriptionStatus();
    } catch (submissionError) {
      console.error(
        "Payment submission failed:",
        submissionError,
      );

      setPaymentError(
        "Something went wrong while submitting your payment. Please try again.",
      );
    } finally {
      setSubmittingPayment(
        false,
      );
    }
  }

  /* =========================================================
     PAGE LOADING
  ========================================================= */

  if (pageLoading) {
    return (
      <AppShell>
        <PageContainer>
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="text-center">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D4AF37]/10">
                <RefreshCw
                  size={21}
                  className="animate-spin text-[#B8941F]"
                />
              </div>

              <p className="mt-4 text-sm font-semibold text-gray-900">
                Loading subscription
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Preparing your billing information...
              </p>

            </div>
          </div>
        </PageContainer>
      </AppShell>
    );
  }

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <AppShell>
      <PageContainer>

        <Breadcrumb
          items={[
            {
              label: "Billing",
            },
            {
              label: "Subscription",
            },
          ]}
        />

        <PageHeader
          title="Subscription"
          description="Manage your Ruby Rental subscription and keep your rental portfolio active."
        />

        {/* ===================================================
            ERROR
        =================================================== */}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">

            <AlertCircle
              size={18}
              className="mt-0.5 shrink-0"
            />

            <span>
              {error}
            </span>

          </div>
        )}

        {/* ===================================================
            ACTIVE
        =================================================== */}

        {subscriptionActive && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 px-5 py-4">

            <CheckCircle2
              size={21}
              className="mt-0.5 shrink-0 text-green-600"
            />

            <div>

              <p className="font-bold text-green-800">
                Subscription active
              </p>

              <p className="mt-1 text-sm leading-6 text-green-700">
                Your payment has been verified and your Ruby Rental subscription is active.
              </p>

            </div>

          </div>
        )}

        {/* ===================================================
            PENDING
        =================================================== */}

        {paymentPending && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">

            <Clock3
              size={21}
              className="mt-0.5 shrink-0 text-amber-600"
            />

            <div>

              <p className="font-bold text-amber-800">
                Payment awaiting verification
              </p>

              <p className="mt-1 text-sm leading-6 text-amber-700">
                Your payment confirmation has been received and sent to Ruby Rental Admin. You do not need to submit it again.
              </p>

              {paymentRequest?.submitted_at && (
                <p className="mt-2 text-xs font-semibold text-amber-800">
                  Submitted{" "}
                  {formatDate(
                    paymentRequest.submitted_at,
                  )}
                </p>
              )}

            </div>

          </div>
        )}

        {/* ===================================================
            REJECTED
        =================================================== */}

        {paymentRejected && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4">

            <AlertCircle
              size={21}
              className="mt-0.5 shrink-0 text-red-600"
            />

            <div>

              <p className="font-bold text-red-800">
                Payment requires attention
              </p>

              <p className="mt-1 text-sm leading-6 text-red-700">
                {paymentRequest?.rejection_reason ||
                  "Your previous payment could not be verified. Please submit your payment confirmation again."}
              </p>

            </div>

          </div>
        )}

        {/* ===================================================
            PAYMENT INSTRUCTIONS
        =================================================== */}

        <Card className="mb-6 overflow-hidden border-[#D4AF37]/30 p-0">

          <div className="border-b border-[#D4AF37]/20 bg-[#D4AF37]/5 px-5 py-6 sm:px-6">

            <div className="flex items-start gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#D4AF37]/15">

                <CreditCard
                  size={22}
                  className="text-[#B8941F]"
                />

              </div>

              <div>

                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#B8941F]">
                  Payment instructions
                </p>

                <h2 className="mt-1 text-xl font-bold text-gray-900">
                  Pay your Ruby Rental subscription
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Make your payment using the details below. After payment, return here and click{" "}
                  <strong>
                    I Have Paid
                  </strong>{" "}
                  to submit your I&amp;M Bank confirmation.
                </p>

              </div>

            </div>

          </div>

          <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">

            <div className="rounded-2xl bg-gray-50 p-5">

              <p className="text-xs font-bold uppercase tracking-[0.14em] text-gray-400">
                Paybill
              </p>

              <p className="mt-2 text-2xl font-black text-gray-900">
                {PAYBILL}
              </p>

            </div>

            <div className="rounded-2xl bg-gray-50 p-5">

              <p className="text-xs font-bold uppercase tracking-[0.14em] text-gray-400">
                Account
              </p>

              <p className="mt-2 text-2xl font-black text-gray-900">
                {ACCOUNT}
              </p>

            </div>

          </div>

          <div className="flex items-start gap-3 border-t border-gray-100 px-5 py-4 sm:px-6">

            <ShieldCheck
              size={17}
              className="mt-0.5 shrink-0 text-[#B8941F]"
            />

            <p className="text-xs leading-5 text-gray-500">
              Pay the exact monthly amount shown below and keep the full I&amp;M Bank confirmation message.
            </p>

          </div>

        </Card>

        {/* ===================================================
            REFRESH STATUS
        =================================================== */}

        <div className="mb-6 flex justify-end">

          <button
            type="button"
            onClick={
              handleManualRefresh
            }
            disabled={
              refreshingStatus
            }
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >

            <RefreshCw
              size={16}
              className={
                refreshingStatus
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh status

          </button>

        </div>

        {/* ===================================================
            MAIN GRID
        =================================================== */}

        <div className="grid gap-6 xl:grid-cols-5">

          {/* =================================================
              SUBSCRIPTION COVERAGE
          ================================================= */}

          <Card className="xl:col-span-3">

            <div className="flex items-start gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#D4AF37]/10">

                <Calculator
                  size={22}
                  className="text-[#B8941F]"
                />

              </div>

              <div>

                <h2 className="text-xl font-bold text-gray-900">
                  Subscription coverage
                </h2>

                <p className="mt-1 text-sm leading-6 text-gray-500">
                  Choose the number of rental units you want your subscription to cover.
                </p>

              </div>

            </div>

            <div className="mt-7">

              <label
                htmlFor="units"
                className="mb-2 block text-sm font-bold text-gray-700"
              >
                Number of units
              </label>

              <div className="relative">

                <input
                  id="units"
                  type="number"
                  min="1"
                  step="1"
                  value={units}
                  disabled={
                    paymentPending ||
                    paymentVerified ||
                    subscriptionActive
                  }
                  onChange={(
                    event,
                  ) => {

                    setUnits(
                      event.target.value,
                    );

                    setError(null);
                    setPaymentError(null);

                  }}
                  placeholder="e.g. 35"
                  className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-4 pr-20 text-xl font-bold text-gray-900 outline-none transition focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10 disabled:cursor-not-allowed disabled:bg-gray-50"
                />

                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">
                  Units
                </span>

              </div>

              <p className="mt-2 text-xs leading-5 text-gray-400">
                Your monthly charge is calculated using Ruby Rental&apos;s progressive unit pricing.
              </p>

            </div>

            {/* PRICING */}

            <div className="mt-8">

              <p className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-gray-400">
                Monthly pricing
              </p>

              <div className="grid gap-3 sm:grid-cols-3">

                <div
                  className={`rounded-2xl p-4 ${
                    quote?.plan_name ===
                    "Basic"
                      ? "border border-[#D4AF37]/40 bg-[#D4AF37]/5"
                      : "bg-gray-50"
                  }`}
                >

                  <p className="text-sm font-bold text-gray-900">
                    Basic
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    1–20 units
                  </p>

                  <p className="mt-3 font-black text-gray-900">
                    KSh 50
                  </p>

                  <p className="text-[11px] text-gray-400">
                    per unit
                  </p>

                </div>

                <div
                  className={`rounded-2xl p-4 ${
                    quote?.plan_name ===
                    "Growth"
                      ? "border border-[#D4AF37]/40 bg-[#D4AF37]/5"
                      : "bg-gray-50"
                  }`}
                >

                  <p className="text-sm font-bold text-gray-900">
                    Growth
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    21–100 units
                  </p>

                  <p className="mt-3 font-black text-gray-900">
                    KSh 40
                  </p>

                  <p className="text-[11px] text-gray-400">
                    per unit
                  </p>

                </div>

                <div
                  className={`rounded-2xl p-4 ${
                    quote?.plan_name ===
                    "Professional"
                      ? "border border-[#D4AF37]/40 bg-[#D4AF37]/5"
                      : "bg-gray-50"
                  }`}
                >

                  <p className="text-sm font-bold text-gray-900">
                    Professional
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    101+ units
                  </p>

                  <p className="mt-3 font-black text-gray-900">
                    KSh 30
                  </p>

                  <p className="text-[11px] text-gray-400">
                    per unit
                  </p>

                </div>

              </div>

            </div>

            <div className="mt-6 flex items-center gap-2 text-xs text-gray-400">

              <ShieldCheck
                size={15}
              />

              <span>
                Pricing is calculated securely by Ruby Rental.
              </span>

            </div>

          </Card>

          {/* =================================================
              QUOTE
          ================================================= */}

          <Card className="relative overflow-hidden xl:col-span-2">

            <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#D4AF37]/10" />

            <div className="relative">

              <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400">
                Your monthly subscription
              </p>

              {loading ? (

                <div className="mt-8 flex items-center gap-3 text-sm text-gray-500">

                  <RefreshCw
                    size={18}
                    className="animate-spin text-[#B8941F]"
                  />

                  Calculating...

                </div>

              ) : quote ? (

                <>

                  <div className="mt-5">

                    <p className="text-4xl font-black tracking-tight text-gray-900">
                      {formatMoney(
                        subscription?.monthly_amount ??
                          quote.monthly_amount,

                        subscription?.currency ??
                          quote.currency,
                      )}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      per month
                    </p>

                  </div>

                  <div className="mt-7 space-y-3">

                    <div className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-4">

                      <span className="text-sm text-gray-500">
                        Package
                      </span>

                      <span className="text-sm font-bold text-gray-900">
                        {quote.plan_name}
                      </span>

                    </div>

                    <div className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-4">

                      <span className="text-sm text-gray-500">
                        Units
                      </span>

                      <span className="text-sm font-bold text-gray-900">
                        {subscription?.subscribed_units ??
                          quote.subscribed_units}
                      </span>

                    </div>

                    <div className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-4">

                      <span className="text-sm text-gray-500">
                        Rate
                      </span>

                      <span className="text-sm font-bold text-gray-900">
                        {formatMoney(
                          subscription?.rate_per_unit ??
                            quote.rate_per_unit,

                          subscription?.currency ??
                            quote.currency,
                        )}{" "}
                        / unit
                      </span>

                    </div>

                  </div>

                </>

              ) : (

                <div className="mt-6 rounded-2xl bg-gray-50 p-5 text-sm leading-6 text-gray-500">
                  Enter your number of units to see your exact monthly subscription cost.
                </div>

              )}

              {paymentError && (
                <div className="mt-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs leading-5 text-red-700">

                  <AlertCircle
                    size={16}
                    className="mt-0.5 shrink-0"
                  />

                  <span>
                    {paymentError}
                  </span>

                </div>
              )}

              {/* I HAVE PAID */}

              {canSubmitPayment && (
                <button
                  type="button"
                  onClick={() => {

                    setPaymentError(
                      null,
                    );

                    setBankConfirmationMessage(
                      "",
                    );

                    setPaymentModalOpen(
                      true,
                    );

                  }}
                  className="mt-6 flex w-full items-center justify-between rounded-2xl bg-[#111111] px-5 py-4 text-sm font-bold text-white transition hover:bg-black"
                >

                  <span className="flex items-center gap-2">

                    <CreditCard
                      size={18}
                    />

                    I Have Paid

                  </span>

                  <ChevronRight
                    size={18}
                  />

                </button>
              )}

              {/* PENDING */}

              {paymentPending && (
                <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">

                  <div className="flex items-start gap-3">

                    <Clock3
                      size={19}
                      className="mt-0.5 shrink-0 text-amber-600"
                    />

                    <div>

                      <p className="text-sm font-bold text-amber-800">
                        Payment awaiting verification
                      </p>

                      <p className="mt-1 text-xs leading-5 text-amber-700">
                        Ruby Rental Admin is verifying your payment.
                      </p>

                    </div>

                  </div>

                </div>
              )}

              {/* ACTIVE */}

              {subscriptionActive && (
                <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-4">

                  <div className="flex items-start gap-3">

                    <CheckCircle2
                      size={19}
                      className="mt-0.5 shrink-0 text-green-600"
                    />

                    <div>

                      <p className="text-sm font-bold text-green-800">
                        Subscription active
                      </p>

                      <p className="mt-1 text-xs leading-5 text-green-700">
                        Your payment has been verified and your subscription is active.
                      </p>

                    </div>

                  </div>

                </div>
              )}

            </div>

          </Card>

        </div>

        {/* ===================================================
            HOW IT WORKS
        =================================================== */}

        <Card className="mt-6">

          <div className="grid gap-6 md:grid-cols-3">

            <div>

              <span className="text-xs font-black text-[#B8941F]">
                01
              </span>

              <h3 className="mt-2 font-bold text-gray-900">
                Choose your units
              </h3>

              <p className="mt-1 text-sm leading-6 text-gray-500">
                Enter the number of rental units you want Ruby Rental to manage.
              </p>

            </div>

            <div>

              <span className="text-xs font-black text-[#B8941F]">
                02
              </span>

              <h3 className="mt-2 font-bold text-gray-900">
                Make payment
              </h3>

              <p className="mt-1 text-sm leading-6 text-gray-500">
                Pay the displayed amount using Paybill {PAYBILL} and Account {ACCOUNT}.
              </p>

            </div>

            <div>

              <span className="text-xs font-black text-[#B8941F]">
                03
              </span>

              <h3 className="mt-2 font-bold text-gray-900">
                Confirm payment
              </h3>

              <p className="mt-1 text-sm leading-6 text-gray-500">
                Paste your I&amp;M Bank confirmation message and click I Have Paid.
              </p>

            </div>

          </div>

        </Card>

        {/* ===================================================
            PAYMENT MODAL
        =================================================== */}

        {paymentModalOpen &&
          quote &&
          subscription && (

            <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-5">

              <div className="flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">

                {/* HEADER */}

                <div className="flex items-center justify-between border-b border-gray-100 px-5 py-5 sm:px-6">

                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D4AF37]/10">

                      <CreditCard
                        size={20}
                        className="text-[#B8941F]"
                      />

                    </div>

                    <div>

                      <h2 className="font-bold text-gray-900">
                        Confirm your payment
                      </h2>

                      <p className="text-xs text-gray-400">
                        Final step
                      </p>

                    </div>

                  </div>

                  <button
                    type="button"
                    onClick={() => {

                      if (
                        !submittingPayment
                      ) {
                        setPaymentModalOpen(
                          false,
                        );
                      }

                    }}
                    disabled={
                      submittingPayment
                    }
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                    aria-label="Close payment confirmation"
                  >

                    <X size={20} />

                  </button>

                </div>

                {/* BODY */}

                <div className="overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">

                  <div className="rounded-2xl border border-[#D4AF37]/25 bg-[#D4AF37]/5 p-5">

                    <p className="text-xs font-black uppercase tracking-[0.16em] text-[#B8941F]">
                      I&amp;M Bank confirmation
                    </p>

                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      Paste the full I&amp;M Bank payment confirmation message you received after making your payment.
                    </p>

                  </div>

                  {/* PAYMENT SUMMARY */}

                  <div className="mt-5 grid grid-cols-3 gap-3">

                    <div className="rounded-2xl bg-gray-50 p-4">

                      <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                        Amount
                      </p>

                      <p className="mt-1 text-sm font-black text-gray-900">
                        {formatMoney(
                          subscription.monthly_amount,
                          subscription.currency,
                        )}
                      </p>

                    </div>

                    <div className="rounded-2xl bg-gray-50 p-4">

                      <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                        Units
                      </p>

                      <p className="mt-1 text-sm font-black text-gray-900">
                        {subscription.subscribed_units}
                      </p>

                    </div>

                    <div className="rounded-2xl bg-gray-50 p-4">

                      <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                        Package
                      </p>

                      <p className="mt-1 text-sm font-black text-gray-900">
                        {quote.plan_name}
                      </p>

                    </div>

                  </div>

                  {/* BANK MESSAGE */}

                  <div className="mt-6">

                    <label
                      htmlFor="bank-confirmation-message"
                      className="mb-2 block text-sm font-bold text-gray-800"
                    >
                      I&amp;M Bank confirmation message
                    </label>

                    <textarea
                      id="bank-confirmation-message"
                      value={
                        bankConfirmationMessage
                      }
                      onChange={(
                        event,
                      ) => {

                        setBankConfirmationMessage(
                          event.target.value,
                        );

                        setPaymentError(
                          null,
                        );

                      }}
                      rows={7}
                      placeholder="Paste your full I&M Bank payment confirmation message here..."
                      autoComplete="off"
                      disabled={
                        submittingPayment
                      }
                      className="w-full resize-none rounded-2xl border border-gray-200 bg-white px-4 py-4 text-sm leading-6 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10 disabled:cursor-not-allowed disabled:bg-gray-50"
                    />

                    <p className="mt-2 text-xs leading-5 text-gray-400">
                      Please provide the full message so Ruby Rental Admin can verify the payment.
                    </p>

                  </div>

                  {paymentError && (
                    <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs leading-5 text-red-700">

                      <AlertCircle
                        size={16}
                        className="mt-0.5 shrink-0"
                      />

                      <span>
                        {paymentError}
                      </span>

                    </div>
                  )}

                </div>

                {/* FINAL ACTION */}

                <div className="border-t border-gray-100 bg-white px-5 py-4 sm:px-6">

                  <button
                    type="button"
                    onClick={
                      handleSubmitPayment
                    }
                    disabled={
                      submittingPayment ||
                      !bankConfirmationMessage.trim()
                    }
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#111111] px-5 py-4 text-sm font-bold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
                  >

                    {submittingPayment ? (
                      <>
                        <RefreshCw
                          size={18}
                          className="animate-spin"
                        />

                        Sending confirmation...
                      </>
                    ) : (
                      <>
                        <CheckCircle2
                          size={18}
                        />

                        I Have Paid
                      </>
                    )}

                  </button>

                  <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-gray-400">

                    <LockKeyhole
                      size={13}
                    />

                    Your payment will be reviewed by Ruby Rental Admin.

                  </div>

                </div>

              </div>

            </div>
          )}

      </PageContainer>
    </AppShell>
  );
}