"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  CreditCard,
  FileText,
  RefreshCw,
  Search,
  ShieldCheck,
  User,
  X,
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

  const [error, setError] =
    useState<string | null>(null);

  const [success, setSuccess] =
    useState<string | null>(null);

  const [rejectionReason, setRejectionReason] =
    useState("");

  const [showRejectModal, setShowRejectModal] =
    useState(false);

  async function loadPayments(showLoader = true) {
    if (showLoader) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    setError(null);

    try {
      const result =
        await getPendingSubscriptionPayments();

      if (result.error) {
        setError(result.error);
        setPayments([]);
        return;
      }

      const paymentRequests =
        result.data ?? [];

      if (paymentRequests.length === 0) {
        setPayments([]);
        return;
      }

      const workspaceIds = [
        ...new Set(
          paymentRequests.map(
            (payment) =>
              payment.workspace_id
          )
        ),
      ];

      const subscriptionIds = [
        ...new Set(
          paymentRequests.map(
            (payment) =>
              payment.subscription_id
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
        setError(
          workspaceResult.error.message
        );
      }

      if (subscriptionResult.error) {
        setError(
          subscriptionResult.error.message
        );
      }

      const workspaceMap =
        new Map<string, Workspace>();

      for (
        const workspace of
          workspaceResult.data ?? []
      ) {
        workspaceMap.set(
          workspace.id,
          workspace
        );
      }

      const subscriptionMap =
        new Map<string, Subscription>();

      for (
        const subscription of
          subscriptionResult.data ?? []
      ) {
        subscriptionMap.set(
          subscription.id,
          {
            ...subscription,
            subscribed_units:
              Number(
                subscription.subscribed_units
              ),
            monthly_amount:
              Number(
                subscription.monthly_amount
              ),
          }
        );
      }

      const rows: PaymentRow[] =
        paymentRequests.map(
          (payment) => ({
            ...payment,

            amount:
              Number(payment.amount),

            workspace:
              workspaceMap.get(
                payment.workspace_id
              ) ?? null,

            subscription:
              subscriptionMap.get(
                payment.subscription_id
              ) ?? null,
          })
        );

      setPayments(rows);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load payment requests."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadPayments();
  }, []);

  const filteredPayments =
    useMemo(() => {
      const query =
        search.trim().toLowerCase();

      if (!query) {
        return payments;
      }

      return payments.filter(
        (payment) => {
          const workspaceName =
            payment.workspace?.name ??
            "";

          const brandName =
            payment.workspace
              ?.brand_name ?? "";

          const email =
            payment.workspace?.email ??
            "";

          const reference =
            payment.transaction_reference ??
            "";

          const bankMessage =
            payment.bank_confirmation_message ??
            "";

          return [
            workspaceName,
            brandName,
            email,
            reference,
            bankMessage,
          ].some((value) =>
            value
              .toLowerCase()
              .includes(query)
          );
        }
      );
    }, [payments, search]);

  function formatMoney(
    amount: number,
    currency = "KES"
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
      }
    )}`;
  }

  function formatDateTime(
    date: string
  ) {
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

  async function handleVerify() {
    if (!selectedPayment) {
      return;
    }

    setProcessing(true);
    setError(null);
    setSuccess(null);

    const {
      data,
      error: rpcError,
    } = await supabase.rpc(
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

    const {
      data,
      error: rpcError,
    } = await supabase.rpc(
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

          <p className="mt-2 max-w-2xl text-sm text-gray-500 sm:text-base">
            Review customer payment
            confirmations and activate
            verified subscriptions.
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
              The payment verification
              queue has been updated.
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
              (
                total,
                payment
              ) =>
                total +
                Number(
                  payment.amount
                ),
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
          value="I&M Bank"
          subtitle="Manual verification"
          icon={
            <ShieldCheck
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
            placeholder="Search customer, email or bank message..."
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
            Compare the customer's
            I&M Bank confirmation message
            with your bank records before
            activating the subscription.
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
                New customer payment
                submissions will appear here.
              </p>

            </div>

          </div>

        ) : (

          <>

            {/* DESKTOP */}

            <div className="hidden overflow-x-auto md:block">

              <table className="w-full min-w-[1100px]">

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
                      I&M Confirmation
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
                    (payment) => {

                      const bankMessage =
                        payment.bank_confirmation_message?.trim() ||
                        "No bank message provided.";

                      return (
                        <tr
                          key={payment.id}
                          className="transition hover:bg-gray-50"
                        >

                          {/* CUSTOMER */}

                          <td className="px-6 py-5">

                            <div className="flex items-center gap-3">

                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-600">

                                <User
                                  size={18}
                                />

                              </div>

                              <div className="min-w-0">

                                <p className="max-w-[180px] truncate font-semibold text-gray-900">
                                  {payment.workspace?.brand_name ||
                                    payment.workspace?.name ||
                                    "Unnamed customer"}
                                </p>

                                <p className="mt-1 max-w-[180px] truncate text-xs text-gray-400">
                                  {payment.workspace?.email ||
                                    "No email"}
                                </p>

                              </div>

                            </div>

                          </td>

                          {/* SUBSCRIPTION */}

                          <td className="px-6 py-5">

                            <p className="font-semibold text-gray-900">
                              {payment.subscription
                                ? `${payment.subscription.subscribed_units.toLocaleString()} units`
                                : "Unknown"}
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                              {payment.subscription
                                ? formatMoney(
                                    Number(
                                      payment.subscription.monthly_amount
                                    ),
                                    payment.subscription.currency
                                  )
                                : "Subscription unavailable"}
                            </p>

                          </td>

                          {/* AMOUNT */}

                          <td className="px-6 py-5">

                            <p className="font-bold text-gray-900">
                              {formatMoney(
                                Number(
                                  payment.amount
                                ),
                                payment.currency
                              )}
                            </p>

                            <span className="mt-1 inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
                              Awaiting review
                            </span>

                          </td>

                          {/* BANK MESSAGE */}

                          <td className="max-w-[300px] px-6 py-5">

                            <div className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-3">

                              <div className="mb-1 flex items-center gap-2">

                                <FileText
                                  size={14}
                                  className="text-[#B8941F]"
                                />

                                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                  I&M Bank Message
                                </span>

                              </div>

                              <p className="line-clamp-3 text-xs leading-5 text-gray-700">
                                {bankMessage}
                              </p>

                            </div>

                          </td>

                          {/* SUBMITTED */}

                          <td className="px-6 py-5">

                            <p className="whitespace-nowrap text-sm text-gray-600">
                              {formatDateTime(
                                payment.created_at
                              )}
                            </p>

                          </td>

                          {/* ACTION */}

                          <td className="px-6 py-5">

                            <div className="flex justify-end">

                              <button
                                type="button"
                                onClick={() =>
                                  setSelectedPayment(
                                    payment
                                  )
                                }
                                className="inline-flex items-center justify-center rounded-xl bg-[#111111] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-black"
                              >
                                Review
                              </button>

                            </div>

                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            </div>

            {/* MOBILE */}

            <div className="divide-y divide-gray-100 md:hidden">

              {filteredPayments.map(
                (payment) => {

                  const bankMessage =
                    payment.bank_confirmation_message?.trim() ||
                    "No bank message provided.";

                  return (
                    <div
                      key={payment.id}
                      className="space-y-4 p-5"
                    >

                      {/* CUSTOMER */}

                      <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-600">

                          <User size={19} />

                        </div>

                        <div className="min-w-0">

                          <p className="truncate font-semibold text-gray-900">
                            {payment.workspace?.brand_name ||
                              payment.workspace?.name ||
                              "Unnamed customer"}
                          </p>

                          <p className="truncate text-xs text-gray-400">
                            {payment.workspace?.email ||
                              "No email"}
                          </p>

                        </div>

                      </div>

                      {/* AMOUNT */}

                      <div className="rounded-xl bg-gray-50 p-4">

                        <div className="flex items-center justify-between">

                          <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                            Amount
                          </span>

                          <span className="text-lg font-bold text-gray-900">
                            {formatMoney(
                              Number(
                                payment.amount
                              ),
                              payment.currency
                            )}
                          </span>

                        </div>

                        <div className="mt-3 flex items-center justify-between border-t border-gray-200 pt-3">

                          <span className="text-xs text-gray-400">
                            Units
                          </span>

                          <span className="text-sm font-semibold text-gray-700">
                            {payment.subscription
                              ?.subscribed_units ??
                              "—"}
                          </span>

                        </div>

                      </div>

                      {/* BANK MESSAGE */}

                      <div className="rounded-xl border border-[#D4AF37]/30 bg-[#D4AF37]/5 p-4">

                        <div className="mb-2 flex items-center gap-2">

                          <FileText
                            size={16}
                            className="text-[#B8941F]"
                          />

                          <span className="text-xs font-bold uppercase tracking-wider text-[#8C6D14]">
                            I&M Bank Confirmation
                          </span>

                        </div>

                        <p className="text-sm leading-6 text-gray-700">
                          {bankMessage}
                        </p>

                      </div>

                      <div className="flex items-center justify-between">

                        <p className="text-xs text-gray-400">
                          {formatDateTime(
                            payment.created_at
                          )}
                        </p>

                        <button
                          type="button"
                          onClick={() =>
                            setSelectedPayment(
                              payment
                            )
                          }
                          className="rounded-xl bg-[#111111] px-4 py-2.5 text-sm font-semibold text-white"
                        >
                          Review Payment
                        </button>

                      </div>

                    </div>
                  );
                }
              )}

            </div>

          </>
        )}

      </Card>

      {/* REVIEW MODAL */}

      {selectedPayment &&
        !showRejectModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">

            <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

              {/* MODAL HEADER */}

              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-5 py-4 sm:px-6">

                <div>

                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#B8941F]">
                    Payment Review
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-gray-900">
                    Verify Customer Payment
                  </h2>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedPayment(
                      null
                    )
                  }
                  disabled={processing}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-gray-500 transition hover:bg-gray-200"
                >
                  <X size={18} />
                </button>

              </div>

              <div className="space-y-6 p-5 sm:p-6">

                {/* CUSTOMER */}

                <div className="rounded-2xl border border-gray-200 p-4">

                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100">

                      <User
                        size={19}
                        className="text-gray-600"
                      />

                    </div>

                    <div>

                      <p className="font-semibold text-gray-900">
                        {selectedPayment.workspace?.brand_name ||
                          selectedPayment.workspace?.name ||
                          "Unnamed customer"}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        {selectedPayment.workspace?.email ||
                          "No email available"}
                      </p>

                    </div>

                  </div>

                </div>

                {/* PAYMENT SUMMARY */}

                <div className="grid gap-3 sm:grid-cols-3">

                  <div className="rounded-xl bg-gray-50 p-4">

                    <p className="text-xs text-gray-400">
                      Amount
                    </p>

                    <p className="mt-1 text-lg font-bold text-gray-900">
                      {formatMoney(
                        Number(
                          selectedPayment.amount
                        ),
                        selectedPayment.currency
                      )}
                    </p>

                  </div>

                  <div className="rounded-xl bg-gray-50 p-4">

                    <p className="text-xs text-gray-400">
                      Units
                    </p>

                    <p className="mt-1 text-lg font-bold text-gray-900">
                      {selectedPayment.subscription
                        ?.subscribed_units ??
                        "—"}
                    </p>

                  </div>

                  <div className="rounded-xl bg-gray-50 p-4">

                    <p className="text-xs text-gray-400">
                      Subscription
                    </p>

                    <p className="mt-1 text-sm font-bold text-gray-900">
                      {selectedPayment.subscription?.status ||
                        "Unknown"}
                    </p>

                  </div>

                </div>

                {/* I&M MESSAGE — MAIN FIX */}

                <div className="rounded-2xl border-2 border-[#D4AF37]/40 bg-[#D4AF37]/5 p-5">

                  <div className="flex items-center gap-2">

                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D4AF37]/15">

                      <FileText
                        size={17}
                        className="text-[#9A7818]"
                      />

                    </div>

                    <div>

                      <p className="text-sm font-bold text-gray-900">
                        I&M Bank Confirmation Message
                      </p>

                      <p className="text-xs text-gray-500">
                        Customer-provided payment confirmation
                      </p>

                    </div>

                  </div>

                  <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4">

                    <p className="whitespace-pre-wrap break-words text-sm leading-6 text-gray-800">
                      {selectedPayment.bank_confirmation_message?.trim() ||
                        "No I&M Bank confirmation message was provided."}
                    </p>

                  </div>

                  {!selectedPayment.bank_confirmation_message?.trim() && (
                    <div className="mt-3 flex items-start gap-2 text-xs text-amber-700">

                      <AlertCircle
                        size={15}
                        className="mt-0.5 shrink-0"
                      />

                      <span>
                        No bank confirmation
                        message was submitted.
                        Verify the payment
                        manually before
                        activating the account.
                      </span>

                    </div>
                  )}

                </div>

                {/* TRANSACTION REFERENCE */}

                {selectedPayment.transaction_reference && (
                  <div className="rounded-xl border border-gray-200 p-4">

                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Transaction Reference
                    </p>

                    <p className="mt-2 break-all font-mono text-sm text-gray-700">
                      {
                        selectedPayment.transaction_reference
                      }
                    </p>

                  </div>
                )}

                {/* SUBMISSION TIME */}

                <div className="text-xs text-gray-400">

                  Submitted{" "}
                  {formatDateTime(
                    selectedPayment.created_at
                  )}

                </div>

                {/* VERIFICATION WARNING */}

                <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">

                  <ShieldCheck
                    size={18}
                    className="mt-0.5 shrink-0 text-amber-700"
                  />

                  <div>

                    <p className="text-sm font-semibold text-amber-900">
                      Verify before activating
                    </p>

                    <p className="mt-1 text-xs leading-5 text-amber-800">
                      Compare the customer's
                      I&M Bank message with
                      your actual bank records.
                      Only verify the payment
                      when the funds have been
                      confirmed.
                    </p>

                  </div>

                </div>

                {/* ACTIONS */}

                <div className="grid gap-3 sm:grid-cols-2">

                  <button
                    type="button"
                    onClick={() =>
                      openRejectModal(
                        selectedPayment
                      )
                    }
                    disabled={processing}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >

                    <XCircle size={17} />

                    Reject Payment

                  </button>

                  <button
                    type="button"
                    onClick={
                      handleVerify
                    }
                    disabled={processing}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#111111] px-4 py-3 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
                  >

                    {processing ? (
                      <>
                        <RefreshCw
                          size={17}
                          className="animate-spin"
                        />

                        Verifying...
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

              </div>

            </div>

          </div>
        )}

      {/* REJECTION MODAL */}

      {showRejectModal &&
        selectedPayment && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-4">

            <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">

              <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">

                <div>

                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-red-500">
                    Reject Payment
                  </p>

                  <h2 className="mt-1 text-lg font-bold text-gray-900">
                    Reject this payment?
                  </h2>

                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowRejectModal(
                      false
                    );
                    setRejectionReason(
                      ""
                    );
                  }}
                  disabled={processing}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-gray-500"
                >

                  <X size={18} />

                </button>

              </div>

              <div className="space-y-5 p-5">

                <p className="text-sm leading-6 text-gray-500">
                  Give the reason why this
                  payment cannot be verified.
                  The reason can be used when
                  communicating with the
                  customer.
                </p>

                <textarea
                  value={rejectionReason}
                  onChange={(event) =>
                    setRejectionReason(
                      event.target.value
                    )
                  }
                  rows={4}
                  placeholder="e.g. Payment not found in I&M Bank records..."
                  disabled={processing}
                  className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-red-300 focus:ring-4 focus:ring-red-500/10 disabled:bg-gray-50"
                />

                {error && (
                  <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">

                    <AlertCircle
                      size={17}
                      className="mt-0.5 shrink-0"
                    />

                    <span>{error}</span>

                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">

                  <button
                    type="button"
                    onClick={() => {
                      setShowRejectModal(
                        false
                      );
                      setRejectionReason(
                        ""
                      );
                    }}
                    disabled={processing}
                    className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
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
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >

                    {processing ? (
                      <>
                        <RefreshCw
                          size={16}
                          className="animate-spin"
                        />

                        Rejecting...
                      </>
                    ) : (
                      <>
                        <XCircle
                          size={16}
                        />

                        Reject Payment
                      </>
                    )}

                  </button>

                </div>

              </div>

            </div>

          </div>
        )}

    </div>
  );
}