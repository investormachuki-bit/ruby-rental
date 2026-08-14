"use client";

import { useEffect, useState } from "react";
import {
  Calculator,
  CheckCircle2,
  CreditCard,
  RefreshCw,
  ShieldCheck,
  X,
  Clock3,
} from "lucide-react";

import Card from "@/components/ui/Card";

import {
  calculateSubscriptionQuote,
  SubscriptionQuote,
} from "@/services/subscription";

import {
  getSubscriptionPaymentRequest,
  submitSubscriptionPayment,
  SubscriptionPaymentRequest,
} from "@/services/subscriptionPayments";

export default function SubscriptionPage() {
  const [units, setUnits] = useState("");

  const [quote, setQuote] =
    useState<SubscriptionQuote | null>(null);

  const [paymentRequest, setPaymentRequest] =
    useState<SubscriptionPaymentRequest | null>(
      null
    );

  const [loading, setLoading] =
    useState(false);

  const [paymentLoading, setPaymentLoading] =
    useState(true);

  const [submittingPayment, setSubmittingPayment] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [paymentError, setPaymentError] =
    useState<string | null>(null);

  const [success, setSuccess] =
    useState(false);

  const [showPaymentModal, setShowPaymentModal] =
    useState(false);

  const [
    transactionReference,
    setTransactionReference,
  ] = useState("");

  /*
   * Load the customer's latest payment request.
   *
   * This allows the page to remember that
   * the customer has already clicked
   * "I Have Paid".
   */
  async function loadPaymentRequest(
    subscriptionId?: string
  ) {
    if (!subscriptionId) {
      setPaymentRequest(null);
      setPaymentLoading(false);
      return;
    }

    setPaymentLoading(true);

    const result =
      await getSubscriptionPaymentRequest(
        subscriptionId
      );

    if (!result.error) {
      setPaymentRequest(result.data);
    }

    setPaymentLoading(false);
  }

  async function calculate() {
    const numberOfUnits = Number(units);

    if (
      !Number.isInteger(numberOfUnits) ||
      numberOfUnits < 1
    ) {
      setQuote(null);
      setError("Enter at least 1 unit.");
      return;
    }

    setLoading(true);
    setError(null);

    const result =
      await calculateSubscriptionQuote(
        numberOfUnits
      );

    if (result.error) {
      setQuote(null);
      setError(result.error);
    } else {
      setQuote(result.data);
    }

    setLoading(false);
  }

  /*
   * Open the payment confirmation modal.
   */
  function openPaymentModal() {
    setPaymentError(null);
    setTransactionReference("");
    setShowPaymentModal(true);
  }

  /*
   * Submit the customer's manual payment.
   *
   * IMPORTANT:
   * This does NOT activate the subscription.
   *
   * It creates a Pending verification request
   * for Platform Admin.
   */
  async function handleSubmitPayment() {
    if (!quote) {
      return;
    }

    const reference =
      transactionReference
        .trim()
        .toUpperCase();

    if (!reference) {
      setPaymentError(
        "Enter your M-Pesa transaction code."
      );
      return;
    }

    setSubmittingPayment(true);
    setPaymentError(null);

    /*
     * We need the customer's subscription ID.
     *
     * The quote itself does not contain it,
     * so we retrieve the active/latest
     * subscription for the current workspace.
     */
    const {
      data: {
        user,
      },
      error: userError,
    } = await (
      await import("@/lib/supabase")
    ).supabase.auth.getUser();

    if (userError || !user) {
      setPaymentError(
        "Your session has expired. Please log in again."
      );

      setSubmittingPayment(false);
      return;
    }

    const { supabase } =
      await import("@/lib/supabase");

    const {
      data: profile,
      error: profileError,
    } = await supabase
      .from("profiles")
      .select("workspace_id")
      .eq("id", user.id)
      .single();

    if (
      profileError ||
      !profile?.workspace_id
    ) {
      setPaymentError(
        "Your workspace could not be found."
      );

      setSubmittingPayment(false);
      return;
    }

    const {
      data: subscription,
      error: subscriptionError,
    } = await supabase
      .from("subscriptions")
      .select("id")
      .eq(
        "workspace_id",
        profile.workspace_id
      )
      .order("created_at", {
        ascending: false,
      })
      .limit(1)
      .maybeSingle();

    if (
      subscriptionError ||
      !subscription
    ) {
      setPaymentError(
        "No subscription was found. Please contact Ruby Rental support."
      );

      setSubmittingPayment(false);
      return;
    }

    const result =
      await submitSubscriptionPayment({
        subscriptionId:
          subscription.id,

        amount:
          quote.monthly_amount,

        currency: "KES",

        transactionReference:
          reference,
      });

    if (result.error) {
      setPaymentError(
        result.error
      );

      setSubmittingPayment(false);
      return;
    }

    setPaymentRequest(
      result.data
    );

    setShowPaymentModal(false);
    setTransactionReference("");
    setSuccess(true);

    setSubmittingPayment(false);
  }

  function formatMoney(amount: number) {
    return `KSh ${amount.toLocaleString(
      "en-KE",
      {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }
    )}`;
  }

  function formatDate(
    date: string
  ) {
    return new Date(date).toLocaleDateString(
      "en-KE",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  }

  const paymentPending =
    paymentRequest?.status ===
    "Pending";

  const paymentVerified =
    paymentRequest?.status ===
    "Verified";

  const paymentRejected =
    paymentRequest?.status ===
    "Rejected";

  useEffect(() => {
    const numberOfUnits = Number(units);

    if (
      !units ||
      !Number.isInteger(numberOfUnits) ||
      numberOfUnits < 1
    ) {
      setQuote(null);
      return;
    }

    const timer = setTimeout(() => {
      calculate();
    }, 400);

    return () => clearTimeout(timer);
  }, [units]);

  /*
   * Load the customer's subscription
   * payment request when the page loads.
   */
  useEffect(() => {
    async function loadCurrentSubscription() {
      const { supabase } =
        await import("@/lib/supabase");

      const {
        data: {
          user,
        },
      } = await supabase.auth.getUser();

      if (!user) {
        setPaymentLoading(false);
        return;
      }

      const {
        data: profile,
      } = await supabase
        .from("profiles")
        .select("workspace_id")
        .eq("id", user.id)
        .single();

      if (!profile?.workspace_id) {
        setPaymentLoading(false);
        return;
      }

      const {
        data: subscription,
      } = await supabase
        .from("subscriptions")
        .select(
          "id, subscribed_units"
        )
        .eq(
          "workspace_id",
          profile.workspace_id
        )
        .order("created_at", {
          ascending: false,
        })
        .limit(1)
        .maybeSingle();

      if (!subscription) {
        setPaymentLoading(false);
        return;
      }

      setUnits(
        String(
          subscription.subscribed_units
        )
      );

      await loadPaymentRequest(
        subscription.id
      );
    }

    loadCurrentSubscription();
  }, []);

  return (
    <div className="min-h-full space-y-8">

      {/* Header */}

      <div>

        <div className="mb-2 flex items-center gap-2">

          <CreditCard
            size={17}
            className="text-[#B8941F]"
          />

          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
            Billing
          </span>

        </div>

        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Subscription
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
          Choose the number of rental units you want to manage and see your monthly Ruby Rental subscription cost.
        </p>

      </div>

      {/* Error */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Payment Submitted */}

      {success && paymentPending && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-800">

          <Clock3
            size={20}
            className="mt-0.5 shrink-0"
          />

          <div>

            <p className="font-semibold">
              Payment submitted successfully.
            </p>

            <p className="mt-1 text-amber-700">
              Your payment is awaiting
              verification. Your subscription
              will be activated after Ruby
              Rental verifies the payment.
            </p>

          </div>

        </div>
      )}

      {/* Payment Verified */}

      {paymentVerified && (
        <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-4 text-sm text-green-700">

          <CheckCircle2
            size={20}
            className="mt-0.5 shrink-0"
          />

          <div>

            <p className="font-semibold">
              Payment verified.
            </p>

            <p className="mt-1 text-green-600">
              Your subscription payment has
              been verified.
            </p>

          </div>

        </div>
      )}

      {/* Rejected */}

      {paymentRejected && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">

          <CreditCard
            size={20}
            className="mt-0.5 shrink-0"
          />

          <div>

            <p className="font-semibold">
              Payment requires attention.
            </p>

            <p className="mt-1">
              {paymentRequest
                ?.rejection_reason ||
                "Your previous payment could not be verified. Please make the payment again and submit the new transaction code."}
            </p>

          </div>

        </div>
      )}

      {/* Calculator */}

      <div className="grid gap-6 lg:grid-cols-5">

        {/* Input */}

        <Card className="lg:col-span-3">

          <div className="flex items-start gap-4">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#D4AF37]/10">

              <Calculator
                size={22}
                className="text-[#B8941F]"
              />

            </div>

            <div>

              <h2 className="text-lg font-semibold text-gray-900">
                Calculate your subscription
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Your monthly charge depends on the number of units you subscribe to.
              </p>

            </div>

          </div>

          <div className="mt-8">

            <label
              htmlFor="units"
              className="mb-2 block text-sm font-semibold text-gray-700"
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
                onChange={(event) => {
                  setUnits(
                    event.target.value
                  );

                  setError(null);
                  setSuccess(false);
                }}
                placeholder="e.g. 35"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-4 pr-20 text-lg font-semibold text-gray-900 outline-none transition focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10"
              />

              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-400">
                Units
              </span>

            </div>

            <p className="mt-2 text-xs text-gray-400">
              Enter the total number of units you want your subscription to cover.
            </p>

          </div>

          {/* Pricing bands */}

          <div className="mt-8">

            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">
              Monthly pricing
            </p>

            <div className="grid gap-3 sm:grid-cols-3">

              <div className="rounded-xl bg-gray-50 p-4">

                <p className="text-sm font-semibold text-gray-900">
                  Basic
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  1–20 units
                </p>

                <p className="mt-3 font-bold text-gray-900">
                  KSh 50
                </p>

                <p className="text-[11px] text-gray-400">
                  per unit
                </p>

              </div>

              <div className="rounded-xl bg-gray-50 p-4">

                <p className="text-sm font-semibold text-gray-900">
                  Growth
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  21–100 units
                </p>

                <p className="mt-3 font-bold text-gray-900">
                  KSh 40
                </p>

                <p className="text-[11px] text-gray-400">
                  per unit
                </p>

              </div>

              <div className="rounded-xl bg-gray-50 p-4">

                <p className="text-sm font-semibold text-gray-900">
                  Professional
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  101+ units
                </p>

                <p className="mt-3 font-bold text-gray-900">
                  KSh 30
                </p>

                <p className="text-[11px] text-gray-400">
                  per unit
                </p>

              </div>

            </div>

          </div>

          <div className="mt-6 flex items-center gap-2 text-xs text-gray-400">

            <ShieldCheck size={15} />

            <span>
              Pricing is calculated securely by Ruby Rental.
            </span>

          </div>

        </Card>

        {/* Quote */}

        <Card className="relative overflow-hidden lg:col-span-2">

          <div className="absolute right-0 top-0 h-32 w-32 translate-x-10 -translate-y-10 rounded-full bg-[#D4AF37]/10" />

          <div className="relative">

            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">
              Your monthly subscription
            </p>

            {loading ? (

              <div className="mt-8">

                <div className="flex items-center gap-3">

                  <RefreshCw
                    size={20}
                    className="animate-spin text-[#B8941F]"
                  />

                  <span className="text-sm text-gray-500">
                    Calculating...
                  </span>

                </div>

              </div>

            ) : quote ? (

              <>

                <div className="mt-5">

                  <p className="text-4xl font-bold tracking-tight text-gray-900">
                    {formatMoney(
                      quote.monthly_amount
                    )}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    per month
                  </p>

                </div>

                <div className="mt-7 space-y-3">

                  <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">

                    <span className="text-sm text-gray-500">
                      Package
                    </span>

                    <span className="text-sm font-bold text-gray-900">
                      {quote.plan_name}
                    </span>

                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">

                    <span className="text-sm text-gray-500">
                      Units
                    </span>

                    <span className="text-sm font-bold text-gray-900">
                      {quote.subscribed_units.toLocaleString()}
                    </span>

                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">

                    <span className="text-sm text-gray-500">
                      Rate
                    </span>

                    <span className="text-sm font-bold text-gray-900">
                      {formatMoney(
                        quote.rate_per_unit
                      )}{" "}
                      / unit
                    </span>

                  </div>

                </div>

                {/* Payment status */}

                {paymentLoading ? (

                  <div className="mt-7 flex items-center justify-center gap-2 rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-500">

                    <RefreshCw
                      size={16}
                      className="animate-spin"
                    />

                    Checking payment status...

                  </div>

                ) : paymentPending ? (

                  <div className="mt-7 rounded-xl border border-amber-200 bg-amber-50 p-4">

                    <div className="flex items-start gap-3">

                      <Clock3
                        size={19}
                        className="mt-0.5 shrink-0 text-amber-600"
                      />

                      <div>

                        <p className="text-sm font-semibold text-amber-900">
                          Payment awaiting verification
                        </p>

                        <p className="mt-1 text-xs leading-5 text-amber-700">
                          We received your payment
                          submission on{" "}
                          {paymentRequest
                            ?.submitted_at
                            ? formatDate(
                                paymentRequest.submitted_at
                              )
                            : "today"}
                          .
                        </p>

                        {paymentRequest
                          ?.transaction_reference && (
                          <p className="mt-2 text-xs font-semibold text-amber-800">
                            Reference:{" "}
                            {
                              paymentRequest.transaction_reference
                            }
                          </p>
                        )}

                      </div>

                    </div>

                  </div>

                ) : paymentVerified ? (

                  <div className="mt-7 rounded-xl border border-green-200 bg-green-50 p-4">

                    <div className="flex items-start gap-3">

                      <CheckCircle2
                        size={19}
                        className="mt-0.5 shrink-0 text-green-600"
                      />

                      <div>

                        <p className="text-sm font-semibold text-green-900">
                          Payment verified
                        </p>

                        <p className="mt-1 text-xs leading-5 text-green-700">
                          Your payment has been
                          verified by Ruby Rental.
                        </p>

                      </div>

                    </div>

                  </div>

                ) : (

                  <button
                    type="button"
                    onClick={openPaymentModal}
                    className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#111111] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-black"
                  >

                    <CreditCard
                      size={17}
                    />

                    I Have Paid

                  </button>

                )}

                <p className="mt-3 text-center text-xs leading-5 text-gray-400">
                  Make your payment manually,
                  then submit your M-Pesa
                  transaction code for verification.
                </p>

              </>

            ) : (

              <div className="mt-8 rounded-xl bg-gray-50 p-5">

                <p className="text-sm font-medium text-gray-700">
                  Enter your number of units
                </p>

                <p className="mt-1 text-sm leading-5 text-gray-500">
                  Your applicable package and monthly charge will appear here automatically.
                </p>

              </div>

            )}

          </div>

        </Card>

      </div>

      {/* How pricing works */}

      <Card>

        <div className="grid gap-6 md:grid-cols-3">

          <div>

            <p className="text-sm font-semibold text-gray-900">
              1. Enter your units
            </p>

            <p className="mt-1 text-sm leading-5 text-gray-500">
              Tell Ruby Rental how many rental units your subscription needs to cover.
            </p>

          </div>

          <div>

            <p className="text-sm font-semibold text-gray-900">
              2. Make payment
            </p>

            <p className="mt-1 text-sm leading-5 text-gray-500">
              Pay the displayed monthly amount using the Ruby Rental payment details.
            </p>

          </div>

          <div>

            <p className="text-sm font-semibold text-gray-900">
              3. Submit your payment
            </p>

            <p className="mt-1 text-sm leading-5 text-gray-500">
              Enter your M-Pesa transaction code. Ruby Rental will verify and activate your subscription.
            </p>

          </div>

        </div>

      </Card>

      {/* =====================================================
          PAYMENT MODAL
      ====================================================== */}

      {showPaymentModal && quote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">

            {/* Modal header */}

            <div className="flex items-start justify-between border-b border-gray-100 p-5">

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
                      Payment Confirmation
                    </h2>

                    <p className="text-xs text-gray-400">
                      Submit your M-Pesa payment
                    </p>

                  </div>

                </div>

              </div>

              <button
                type="button"
                onClick={() =>
                  setShowPaymentModal(false)
                }
                disabled={
                  submittingPayment
                }
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              >

                <X size={19} />

              </button>

            </div>

            {/* Modal body */}

            <div className="p-5">

              <div className="rounded-xl bg-gray-50 p-4">

                <div className="flex items-center justify-between">

                  <span className="text-sm text-gray-500">
                    Amount
                  </span>

                  <span className="text-lg font-bold text-gray-900">
                    {formatMoney(
                      quote.monthly_amount
                    )}
                  </span>

                </div>

                <div className="mt-3 flex items-center justify-between">

                  <span className="text-sm text-gray-500">
                    Units
                  </span>

                  <span className="text-sm font-semibold text-gray-900">
                    {quote.subscribed_units.toLocaleString()}
                  </span>

                </div>

                <div className="mt-3 flex items-center justify-between">

                  <span className="text-sm text-gray-500">
                    Package
                  </span>

                  <span className="text-sm font-semibold text-gray-900">
                    {quote.plan_name}
                  </span>

                </div>

              </div>

              <div className="mt-5 rounded-xl border border-[#D4AF37]/30 bg-[#D4AF37]/5 p-4">

                <p className="text-sm font-semibold text-gray-900">
                  Before submitting
                </p>

                <p className="mt-1 text-xs leading-5 text-gray-600">
                  Make sure you have completed
                  the M-Pesa payment for the
                  amount shown above.
                </p>

              </div>

              <div className="mt-5">

                <label
                  htmlFor="transaction-reference"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  M-Pesa Transaction Code
                </label>

                <input
                  id="transaction-reference"
                  type="text"
                  value={
                    transactionReference
                  }
                  onChange={(event) => {
                    setTransactionReference(
                      event.target.value
                    );
                    setPaymentError(null);
                  }}
                  placeholder="e.g. QGH7XXXXXX"
                  autoComplete="off"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold uppercase tracking-wide text-gray-900 outline-none transition focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10"
                />

                <p className="mt-2 text-xs leading-5 text-gray-400">
                  Enter the transaction code
                  exactly as shown in your M-Pesa
                  confirmation message.
                </p>

              </div>

              {paymentError && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {paymentError}
                </div>
              )}

              <button
                type="button"
                onClick={
                  handleSubmitPayment
                }
                disabled={
                  submittingPayment ||
                  !transactionReference.trim()
                }
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#111111] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
              >

                {submittingPayment ? (
                  <>
                    <RefreshCw
                      size={17}
                      className="animate-spin"
                    />

                    Submitting...

                  </>
                ) : (
                  <>
                    <CheckCircle2
                      size={17}
                    />

                    Submit Payment

                  </>
                )}

              </button>

              <p className="mt-3 text-center text-xs leading-5 text-gray-400">
                Your subscription will not be
                activated until the payment is
                verified by Ruby Rental Admin.
              </p>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}