"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  CreditCard,
  RefreshCw,
  Search,
  XCircle,
} from "lucide-react";

import Card from "@/components/ui/Card";
import StatCard from "@/components/ui/StatCard";

import {
  getPendingSubscriptionPayments,
  SubscriptionPaymentRequest,
} from "@/services/subscriptionPayments";

import { supabase } from "@/lib/supabase";

type Workspace = {
  id: string;
  name: string;
  brand_name: string | null;
  email: string | null;
  phone: string | null;
};

type Subscription = {
  id: string;
  workspace_id: string;
  subscribed_units: number;
  monthly_amount: number;
  currency: string;
  status: string;
  next_billing_date: string | null;
};

type PaymentRow = SubscriptionPaymentRequest & {
  workspace: Workspace | null;
  subscription: Subscription | null;
};

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentRow[]>([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");

  const [selectedPayment, setSelectedPayment] =
    useState<PaymentRow | null>(null);

  const [processing, setProcessing] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [success, setSuccess] = useState<string | null>(null);

  const [rejectionReason, setRejectionReason] = useState("");

  const [showRejectModal, setShowRejectModal] =
    useState(false);

  async function loadPayments(showLoader = true) {
    if (showLoader) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    setError(null);

    const result = await getPendingSubscriptionPayments();

    if (result.error) {
      setError(result.error);
      setPayments([]);
      setLoading(false);
      setRefreshing(false);
      return;
    }

    const paymentRequests = result.data ?? [];

    if (paymentRequests.length === 0) {
      setPayments([]);
      setLoading(false);
      setRefreshing(false);
      return;
    }

    const workspaceIds = [
      ...new Set(
        paymentRequests.map(
          (payment) => payment.workspace_id
        )
      ),
    ];

    const subscriptionIds = [
      ...new Set(
        paymentRequests.map(
          (payment) => payment.subscription_id
        )
      ),
    ];

    const [
      workspaceResult,
      subscriptionResult,
    ] = await Promise.all([
      supabase
        .from("workspaces")
        .select(`
          id,
          name,
          brand_name,
          email,
          phone
        `)
        .in("id", workspaceIds),

      supabase
        .from("subscriptions")
        .select(`
          id,
          workspace_id,
          subscribed_units,
          monthly_amount,
          currency,
          status,
          next_billing_date
        `)
        .in("id", subscriptionIds),
    ]);

    if (workspaceResult.error) {
      setError(workspaceResult.error.message);
    }

    if (subscriptionResult.error) {
      setError(subscriptionResult.error.message);
    }

    const workspaceMap = new Map<string, Workspace>();

    for (const workspace of workspaceResult.data ?? []) {
      workspaceMap.set(workspace.id, workspace);
    }

    const subscriptionMap =
      new Map<string, Subscription>();

    for (
      const subscription of
        subscriptionResult.data ?? []
    ) {
      subscriptionMap.set(subscription.id, {
        ...subscription,
        subscribed_units: Number(
          subscription.subscribed_units
        ),
        monthly_amount: Number(
          subscription.monthly_amount
        ),
      });
    }

    const rows: PaymentRow[] =
      paymentRequests.map((payment) => ({
        ...payment,
        amount: Number(payment.amount),
        workspace:
          workspaceMap.get(
            payment.workspace_id
          ) ?? null,
        subscription:
          subscriptionMap.get(
            payment.subscription_id
          ) ?? null,
      }));

    setPayments(rows);
    setLoading(false);
    setRefreshing(false);
  }

  useEffect(() => {
    loadPayments();
  }, []);

  const filteredPayments = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return payments;
    }

    return payments.filter((payment) => {
      const workspaceName =
        payment.workspace?.name ?? "";

      const brandName =
        payment.workspace?.brand_name ?? "";

      const email =
        payment.workspace?.email ?? "";

      const reference =
        payment.transaction_reference ?? "";

      return [
        workspaceName,
        brandName,
        email,
        reference,
      ].some((value) =>
        value.toLowerCase().includes(query)
      );
    });
  }, [payments, search]);

  function formatMoney(
    amount: number,
    currency = "KES"
  ) {
    return `${
      currency === "KES" ? "KSh" : currency
    } ${amount.toLocaleString("en-KE", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;
  }

  function formatDateTime(date: string) {
    return new Date(date).toLocaleString(
      "en-KE",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }
    );
  }

  /*
   * SECURE VERIFICATION
   *
   * The browser does NOT update the payment
   * or subscription directly.
   *
   * Supabase checks Platform Admin status
   * inside the RPC function.
   */
  async function handleVerify() {
    if (!selectedPayment) {
      return;
    }

    setProcessing(true);
    setError(null);
    setSuccess(null);

    const { data, error: rpcError } =
      await supabase.rpc(
        "verify_subscription_payment",
        {
          p_payment_request_id:
            selectedPayment.id,
        }
      );

    if (rpcError) {
      setError(rpcError.message);
      setProcessing(false);
      return;
    }

    if (!data?.success) {
      setError(
        "Payment verification could not be completed."
      );
      setProcessing(false);
      return;
    }

    setSuccess(
      "Payment verified and subscription activated successfully."
    );

    setSelectedPayment(null);

    await loadPayments(false);

    setProcessing(false);
  }

  function openRejectModal(
    payment: PaymentRow
  ) {
    setSelectedPayment(payment);
    setRejectionReason("");
    setError(null);
    setShowRejectModal(true);
  }

  /*
   * SECURE REJECTION
   *
   * The database function checks that
   * the current user is a Platform Admin.
   */
  async function handleReject() {
    if (!selectedPayment) {
      return;
    }

    const reason =
      rejectionReason.trim();

    if (!reason) {
      setError(
        "Enter a reason for rejecting the payment."
      );
      return;
    }

    setProcessing(true);
    setError(null);
    setSuccess(null);

    const { data, error: rpcError } =
      await supabase.rpc(
        "reject_subscription_payment",
        {
          p_payment_request_id:
            selectedPayment.id,

          p_reason: reason,
        }
      );

    if (rpcError) {
      setError(rpcError.message);
      setProcessing(false);
      return;
    }

    if (!data?.success) {
      setError(
        "Payment rejection could not be completed."
      );
      setProcessing(false);
      return;
    }

    setShowRejectModal(false);
    setSelectedPayment(null);
    setRejectionReason("");

    setSuccess(
      "Payment request rejected successfully."
    );

    await loadPayments(false);

    setProcessing(false);
  }

  return (
    <div className="space-y-8">

      {/* HEADER */}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <div className="mb-2 flex items-center gap-2">

            <CreditCard
              size={17}
              className="text-[#B8941F]"
            />

            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
              Platform
            </span>

          </div>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Payment Verification
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-gray-500">
            Review customer subscription payments
            and activate verified accounts.
          </p>

        </div>

        <button
          type="button"
          onClick={() =>
            loadPayments(false)
          }
          disabled={
            loading || refreshing
          }
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >

          <RefreshCw
            size={17}
            className={
              refreshing
                ? "animate-spin"
                : ""
            }
          />

          Refresh

        </button>

      </div>

      {/* SUCCESS */}

      {success && (
        <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-4 text-sm text-green-700">

          <CheckCircle2
            size={20}
            className="mt-0.5 shrink-0"
          />

          <div>

            <p className="font-semibold">
              {success}
            </p>

            <p className="mt-1 text-green-600">
              The payment verification queue
              has been updated.
            </p>

          </div>

        </div>
      )}

      {/* ERROR */}

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">

          <AlertCircle
            size={19}
            className="mt-0.5 shrink-0"
          />

          <span>{error}</span>

        </div>
      )}

      {/* STATS */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">

        <StatCard
          title="Awaiting Verification"
          value={payments.length}
          subtitle="Subscription payments"
          icon={
            <Clock3
              size={21}
              className="text-[#B8941F]"
            />
          }
        />

        <StatCard
          title="Amount Pending"
          value={formatMoney(
            payments.reduce(
              (total, payment) =>
                total +
                Number(payment.amount),
              0
            )
          )}
          subtitle="Payments awaiting review"
          icon={
            <CreditCard
              size={21}
              className="text-[#B8941F]"
            />
          }
        />

        <StatCard
          title="Payment Method"
          value="M-Pesa"
          subtitle="Manual verification"
          icon={
            <CheckCircle2
              size={21}
              className="text-[#B8941F]"
            />
          }
        />

      </div>

      {/* SEARCH */}

      <Card className="p-5">

        <div className="relative w-full md:max-w-md">

          <Search
            size={17}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Search customer or transaction..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none transition focus:border-[#D4AF37] focus:bg-white focus:ring-2 focus:ring-[#D4AF37]/10"
          />

        </div>

      </Card>

      {/* PAYMENT QUEUE */}

      <Card className="overflow-hidden p-0">

        <div className="border-b border-gray-200 p-5 sm:p-6">

          <h2 className="text-lg font-semibold text-gray-900">
            Payments Awaiting Verification
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Verify the payment against your
            M-Pesa/I&M records before activating
            the subscription.
          </p>

        </div>

        {loading ? (

          <div className="flex min-h-64 items-center justify-center">

            <div className="text-center">

              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#D4AF37]" />

              <p className="mt-3 text-sm text-gray-500">
                Loading payment requests...
              </p>

            </div>

          </div>

        ) : filteredPayments.length === 0 ? (

          <div className="flex min-h-64 items-center justify-center px-6">

            <div className="text-center">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100">

                <CheckCircle2
                  size={22}
                  className="text-gray-400"
                />

              </div>

              <h3 className="mt-4 font-semibold text-gray-900">
                No payments awaiting verification
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                New customer payment submissions
                will appear here.
              </p>

            </div>

          </div>

        ) : (

          <>

            {/* DESKTOP */}

            <div className="hidden overflow-x-auto md:block">

              <table className="w-full min-w-[1000px]">

                <thead>

                  <tr className="border-b border-gray-200 bg-gray-50/80">

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Customer
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Subscription
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Amount
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Reference
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Submitted
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-gray-100">

                  {filteredPayments.map(
                    (payment) => (

                      <tr
                        key={payment.id}
                        className="transition hover:bg-gray-50/70"
                      >

                        <td className="px-6 py-5">

                          <p className="font-semibold text-gray-900">
                            {payment.workspace
                              ?.brand_name ||
                              payment.workspace
                                ?.name ||
                              "Unknown customer"}
                          </p>

                          {payment.workspace
                            ?.email && (
                            <p className="mt-1 text-xs text-gray-400">
                              {
                                payment.workspace
                                  .email
                              }
                            </p>
                          )}

                        </td>

                        <td className="px-6 py-5">

                          <p className="font-semibold text-gray-900">
                            {payment.subscription
                              ?.subscribed_units ??
                              "—"}{" "}
                            units
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            Monthly subscription
                          </p>

                        </td>

                        <td className="px-6 py-5">

                          <p className="font-bold text-gray-900">
                            {formatMoney(
                              Number(
                                payment.amount
                              ),
                              payment.currency
                            )}
                          </p>

                        </td>

                        <td className="px-6 py-5">

                          <span className="font-mono text-sm font-semibold text-gray-700">
                            {payment.transaction_reference ||
                              "—"}
                          </span>

                        </td>

                        <td className="px-6 py-5">

                          <p className="text-sm font-medium text-gray-700">
                            {formatDateTime(
                              payment.submitted_at
                            )}
                          </p>

                        </td>

                        <td className="px-6 py-5">

                          <div className="flex justify-end">

                            <button
                              type="button"
                              onClick={() =>
                                setSelectedPayment(
                                  payment
                                )
                              }
                              className="rounded-xl bg-[#111111] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-black"
                            >
                              Review
                            </button>

                          </div>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

            {/* MOBILE */}

            <div className="divide-y divide-gray-100 md:hidden">

              {filteredPayments.map(
                (payment) => (

                  <button
                    key={payment.id}
                    type="button"
                    onClick={() =>
                      setSelectedPayment(
                        payment
                      )
                    }
                    className="block w-full p-5 text-left transition active:bg-gray-50"
                  >

                    <div className="flex items-start justify-between gap-4">

                      <div className="min-w-0">

                        <p className="truncate font-semibold text-gray-900">
                          {payment.workspace
                            ?.brand_name ||
                            payment.workspace
                              ?.name ||
                            "Unknown customer"}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {payment.subscription
                            ?.subscribed_units ??
                            "—"}{" "}
                          units
                        </p>

                      </div>

                      <span className="shrink-0 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                        Pending
                      </span>

                    </div>

                    <div className="mt-4 flex items-end justify-between gap-4">

                      <div>

                        <p className="text-lg font-bold text-gray-900">
                          {formatMoney(
                            Number(
                              payment.amount
                            ),
                            payment.currency
                          )}
                        </p>

                        <p className="mt-1 font-mono text-xs text-gray-400">
                          {payment.transaction_reference ||
                            "No reference"}
                        </p>

                      </div>

                      <span className="text-xs font-semibold text-gray-400">
                        Review →
                      </span>

                    </div>

                  </button>

                )
              )}

            </div>

          </>

        )}

      </Card>

      {/* =====================================================
          REVIEW MODAL
      ====================================================== */}

      {selectedPayment &&
        !showRejectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

              <div className="flex items-start justify-between border-b border-gray-100 p-5 sm:p-6">

                <div>

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4AF37]/10">

                      <CreditCard
                        size={19}
                        className="text-[#B8941F]"
                      />

                    </div>

                    <div>

                      <h2 className="font-semibold text-gray-900">
                        Review Payment
                      </h2>

                      <p className="text-xs text-gray-400">
                        Verify before activating
                      </p>

                    </div>

                  </div>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedPayment(
                      null
                    )
                  }
                  disabled={processing}
                  className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                >
                  <XCircle size={20} />
                </button>

              </div>

              <div className="space-y-6 p-5 sm:p-6">

                {/* CUSTOMER */}

                <div>

                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Customer
                  </p>

                  <p className="mt-2 text-xl font-bold text-gray-900">
                    {selectedPayment
                      .workspace
                      ?.brand_name ||
                      selectedPayment
                        .workspace?.name ||
                      "Unknown customer"}
                  </p>

                  {selectedPayment
                    .workspace?.email && (
                    <p className="mt-1 text-sm text-gray-500">
                      {
                        selectedPayment
                          .workspace.email
                      }
                    </p>
                  )}

                </div>

                {/* SUMMARY */}

                <div className="grid gap-3 sm:grid-cols-3">

                  <div className="rounded-xl bg-gray-50 p-4">

                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Amount
                    </p>

                    <p className="mt-2 text-lg font-bold text-gray-900">
                      {formatMoney(
                        Number(
                          selectedPayment.amount
                        ),
                        selectedPayment.currency
                      )}
                    </p>

                  </div>

                  <div className="rounded-xl bg-gray-50 p-4">

                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Units
                    </p>

                    <p className="mt-2 text-lg font-bold text-gray-900">
                      {selectedPayment
                        .subscription
                        ?.subscribed_units ??
                        "—"}
                    </p>

                  </div>

                  <div className="rounded-xl bg-gray-50 p-4">

                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Method
                    </p>

                    <p className="mt-2 text-lg font-bold text-gray-900">
                      M-Pesa
                    </p>

                  </div>

                </div>

                {/* PAYMENT DETAILS */}

                <div className="rounded-xl border border-[#D4AF37]/30 bg-[#D4AF37]/5 p-4">

                  <p className="text-xs font-semibold uppercase tracking-wider text-[#8A6D16]">
                    Payment Details
                  </p>

                  <div className="mt-3 grid gap-3 sm:grid-cols-2">

                    <div>

                      <p className="text-xs text-gray-500">
                        Paybill
                      </p>

                      <p className="mt-1 text-lg font-bold text-gray-900">
                        542 542
                      </p>

                    </div>

                    <div>

                      <p className="text-xs text-gray-500">
                        Account
                      </p>

                      <p className="mt-1 text-lg font-bold text-gray-900">
                        460 500
                      </p>

                    </div>

                  </div>

                </div>

                {/* TRANSACTION REFERENCE */}

                <div>

                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Transaction Reference
                  </p>

                  <div className="mt-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">

                    <p className="font-mono text-sm font-bold text-gray-900">
                      {selectedPayment
                        .transaction_reference ||
                        "Not provided"}
                    </p>

                  </div>

                </div>

                {/* CUSTOMER MESSAGE */}

                <div>

                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Customer Payment Confirmation
                  </p>

                  <div className="mt-2 rounded-xl border border-gray-200 bg-gray-50 p-4">

                    {selectedPayment.notes ? (

                      <p className="whitespace-pre-wrap text-sm leading-6 text-gray-700">
                        {selectedPayment.notes}
                      </p>

                    ) : (

                      <p className="text-sm italic text-gray-400">
                        No payment confirmation
                        message provided.
                      </p>

                    )}

                  </div>

                </div>

                {/* SUBMITTED */}

                <div className="flex items-center gap-2 text-xs text-gray-400">

                  <Clock3 size={14} />

                  Submitted{" "}
                  {formatDateTime(
                    selectedPayment.submitted_at
                  )}

                </div>

                {/* ACTIONS */}

                <div className="grid gap-3 border-t border-gray-100 pt-5 sm:grid-cols-2">

                  <button
                    type="button"
                    disabled={processing}
                    onClick={() =>
                      openRejectModal(
                        selectedPayment
                      )
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-3.5 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >

                    <XCircle size={17} />

                    Reject Payment

                  </button>

                  <button
                    type="button"
                    disabled={processing}
                    onClick={
                      handleVerify
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#111111] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
                  >

                    {processing ? (
                      <>
                        <RefreshCw
                          size={17}
                          className="animate-spin"
                        />

                        Processing...

                      </>
                    ) : (
                      <>
                        <CheckCircle2
                          size={17}
                        />

                        Verify & Activate

                      </>
                    )}

                  </button>

                </div>

                <p className="text-center text-xs leading-5 text-gray-400">
                  Verification is protected by
                  Ruby Rental Platform Admin
                  permissions.
                </p>

              </div>

            </div>

          </div>
        )}

      {/* =====================================================
          REJECTION MODAL
      ====================================================== */}

      {showRejectModal &&
        selectedPayment && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">

            <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">

              <div className="flex items-start justify-between border-b border-gray-100 p-5">

                <div>

                  <h2 className="font-semibold text-gray-900">
                    Reject Payment
                  </h2>

                  <p className="mt-1 text-xs text-gray-400">
                    {selectedPayment
                      .workspace
                      ?.brand_name ||
                      selectedPayment
                        .workspace?.name}
                  </p>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowRejectModal(
                      false
                    )
                  }
                  disabled={processing}
                  className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
                >
                  <XCircle size={20} />
                </button>

              </div>

              <div className="p-5">

                <label className="text-sm font-semibold text-gray-700">
                  Reason for rejection
                </label>

                <textarea
                  value={rejectionReason}
                  onChange={(event) => {
                    setRejectionReason(
                      event.target.value
                    );
                    setError(null);
                  }}
                  rows={4}
                  placeholder="e.g. Transaction could not be verified."
                  className="mt-2 w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10"
                />

                {error && (
                  <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <div className="mt-5 grid gap-3 sm:grid-cols-2">

                  <button
                    type="button"
                    onClick={() =>
                      setShowRejectModal(
                        false
                      )
                    }
                    disabled={processing}
                    className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={
                      handleReject
                    }
                    disabled={
                      processing ||
                      !rejectionReason.trim()
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >

                    {processing ? (
                      <RefreshCw
                        size={16}
                        className="animate-spin"
                      />
                    ) : (
                      <XCircle size={16} />
                    )}

                    Reject Payment

                  </button>

                </div>

              </div>

            </div>

          </div>
        )}

    </div>
  );
}