"use client";

import { useEffect, useState } from "react";
import {
  Calculator,
  CheckCircle2,
  CreditCard,
  RefreshCw,
  ShieldCheck,
  Clock3,
  AlertCircle,
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

import { supabase } from "@/lib/supabase";

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

  /*
   * Only the I&M Bank confirmation message
   * is collected from the customer.
   *
   * The old M-Pesa transaction_reference
   * remains in the database for future use.
   */
  const [
    bankConfirmationMessage,
    setBankConfirmationMessage,
  ] = useState("");

  /*
   * Load the customer's latest payment request.
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

  /*
   * Calculate subscription price.
   */
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
   * Submit payment confirmation.
   *
   * IMPORTANT:
   *
   * This does NOT activate the subscription.
   *
   * It creates/submits a Pending payment
   * verification request for Platform Admin.
   *
   * The customer only needs to provide
   * the I&M Bank confirmation message.
   *
   * transactionReference is deliberately
   * left empty because that field remains
   * available in the database for future use.
   */
  async function handleSubmitPayment() {
    if (!quote) {
      return;
    }

    const bankMessage =
      bankConfirmationMessage.trim();

    if (!bankMessage) {
      setPaymentError(
        "Please paste your I&M Bank payment confirmation message."
      );
      return;
    }

    setSubmittingPayment(true);
    setPaymentError(null);
    setSuccess(false);

    try {
      /*
       * Get authenticated user.
       */
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setPaymentError(
          "Your session has expired. Please log in again."
        );
        return;
      }

      /*
       * Find workspace.
       */
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
        return;
      }

      /*
       * Find the customer's latest subscription.
       */
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
        return;
      }

      /*
       * Create the payment verification request.
       *
       * The existing M-Pesa transaction reference
       * field remains in the database but is not
       * requested from the customer.
       */
      const result =
        await submitSubscriptionPayment({
          subscriptionId:
            subscription.id,

          amount:
            quote.monthly_amount,

          currency: "KES",

          transactionReference: "",

          bankConfirmationMessage:
            bankMessage,
        });

      if (result.error) {
        setPaymentError(result.error);
        return;
      }

      /*
       * Store the returned payment request.
       */
      setPaymentRequest(result.data);

      /*
       * Clear the form.
       */
      setBankConfirmationMessage("");

      /*
       * Show confirmation.
       */
      setSuccess(true);

    } catch (submissionError) {
      console.error(
        "Payment submission failed:",
        submissionError
      );

      setPaymentError(
        "Something went wrong while submitting your payment. Please try again."
      );
    } finally {
      setSubmittingPayment(false);
    }
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

  function formatDate(date: string) {
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

  /*
   * Automatically calculate pricing.
   */
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
   * Load customer's current subscription.
   */
  useEffect(() => {
    async function loadCurrentSubscription() {
      const {
        data: { user },
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

      {/* =====================================================
          HEADER
      ====================================================== */}

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
          Choose the number of rental units you want
          to manage and see your monthly Ruby Rental
          subscription cost.
        </p>

      </div>

      {/* =====================================================
          GENERAL ERROR
      ====================================================== */}

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

          <AlertCircle size={18} />

          <span>{error}</span>

        </div>
      )}

      {/* =====================================================
          PAYMENT SUBMITTED
      ====================================================== */}

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

            <p className="mt-1 leading-5 text-amber-700">
              Your payment confirmation has been
              sent to Ruby Rental Admin for
              verification.
            </p>

            <p className="mt-2 font-semibold text-amber-800">
              Your subscription will be immediately
              activated once payment is verified by
              Admin.
            </p>

          </div>

        </div>
      )}

      {/* =====================================================
          PAYMENT VERIFIED
      ====================================================== */}

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

            <p className="mt-1 leading-5 text-green-600">
              Your Ruby Rental subscription payment
              has been verified by Admin.
            </p>

          </div>

        </div>
      )}

      {/* =====================================================
          PAYMENT REJECTED
      ====================================================== */}

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

            <p className="mt-1 leading-5">
              {paymentRequest
                ?.rejection_reason ||
                "Your previous payment could not be verified. Please submit your payment confirmation again."}
            </p>

          </div>

        </div>
      )}

      {/* =====================================================
          MAIN SUBSCRIPTION AREA
      ====================================================== */}

      <div className="grid gap-6 lg:grid-cols-5">

        {/* ===================================================
            CALCULATOR
        ==================================================== */}

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
                Your monthly charge depends on the
                number of units you subscribe to.
              </p>

            </div>

          </div>

          {/* UNIT INPUT */}

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
              Enter the total number of units you
              want your subscription to cover.
            </p>

          </div>

          {/* PRICING BANDS */}

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
              Pricing is calculated securely by Ruby
              Rental.
            </span>

          </div>

        </Card>

        {/* ===================================================
            SUBSCRIPTION / PAYMENT
        ==================================================== */}

        <Card className="relative overflow-hidden lg:col-span-2">

          <div className="absolute right-0 top-0 h-32 w-32 translate-x-10 -translate-y-10 rounded-full bg-[#D4AF37]/10" />

          <div className="relative">

            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">
              Your monthly subscription
            </p>

            {loading ? (

              <div className="mt-8 flex items-center gap-3">

                <RefreshCw
                  size={20}
                  className="animate-spin text-[#B8941F]"
                />

                <span className="text-sm text-gray-500">
                  Calculating...
                </span>

              </div>

            ) : quote ? (

              <>

                {/* =================================================
                    PAYMENT INSTRUCTIONS — TOP
                ================================================== */}

                <div className="mt-5 rounded-2xl border border-[#D4AF37]/30 bg-[#D4AF37]/5 p-5">

                  <div className="flex items-center gap-2">

                    <CreditCard
                      size={18}
                      className="text-[#B8941F]"
                    />

                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8D6D12]">
                      Payment instructions
                    </p>

                  </div>

                  <p className="mt-2 text-sm leading-5 text-gray-600">
                    Make your payment using the
                    details below, then return here
                    and submit your I&M Bank
                    confirmation message.
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-3">

                    <div className="rounded-xl bg-white px-4 py-4">

                      <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                        Paybill
                      </p>

                      <p className="mt-1 text-xl font-bold tracking-tight text-gray-900">
                        542 542
                      </p>

                    </div>

                    <div className="rounded-xl bg-white px-4 py-4">

                      <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                        Account
                      </p>

                      <p className="mt-1 text-xl font-bold tracking-tight text-gray-900">
                        460 500
                      </p>

                    </div>

                  </div>

                </div>

                {/* =================================================
                    AMOUNT
                ================================================== */}

                <div className="mt-6">

                  <p className="text-4xl font-bold tracking-tight text-gray-900">
                    {formatMoney(
                      quote.monthly_amount
                    )}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    per month
                  </p>

                </div>

                {/* =================================================
                    SUBSCRIPTION DETAILS
                ================================================== */}

                <div className="mt-6 space-y-3">

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

                {/* =================================================
                    PAYMENT STATUS
                ================================================== */}

                {paymentLoading ? (

                  <div className="mt-7 flex items-center justify-center gap-2 rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-500">

                    <RefreshCw
                      size={16}
                      className="animate-spin"
                    />

                    Checking payment status...

                  </div>

                ) : paymentPending ? (

                  <div className="mt-7 rounded-2xl border border-amber-200 bg-amber-50 p-5">

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
                          Your payment confirmation
                          has been received and sent
                          to Ruby Rental Admin.
                        </p>

                        {paymentRequest
                          ?.submitted_at && (
                          <p className="mt-2 text-xs text-amber-700">
                            Submitted{" "}
                            {formatDate(
                              paymentRequest.submitted_at
                            )}
                          </p>
                        )}

                      </div>

                    </div>

                  </div>

                ) : paymentVerified ? (

                  <div className="mt-7 rounded-2xl border border-green-200 bg-green-50 p-5">

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
                          Your subscription payment has
                          been verified by Ruby Rental
                          Admin.
                        </p>

                      </div>

                    </div>

                  </div>

                ) : (

                  <>
                    {/* =================================================
                        AFTER PAYMENT
                    ================================================== */}

                    <div className="mt-7">

                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-gray-400">
                        After payment
                      </p>

                      <p className="mt-1 text-sm leading-5 text-gray-500">
                        Paste the I&M Bank payment
                        confirmation message below.
                      </p>

                    </div>

                    {/* =================================================
                        I&M BANK MESSAGE ONLY
                    ================================================== */}

                    <div className="mt-5">

                      <label
                        htmlFor="bank-confirmation"
                        className="mb-2 block text-sm font-semibold text-gray-700"
                      >
                        I&M Bank Payment Confirmation
                      </label>

                      <textarea
                        id="bank-confirmation"
                        value={
                          bankConfirmationMessage
                        }
                        onChange={(event) => {
                          setBankConfirmationMessage(
                            event.target.value
                          );

                          setPaymentError(null);
                          setSuccess(false);
                        }}
                        rows={6}
                        placeholder="Paste or share your I&M Bank payment confirmation message here..."
                        className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm leading-6 text-gray-900 outline-none transition focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10"
                      />

                      <p className="mt-2 text-xs leading-5 text-gray-400">
                        Please provide the full payment
                        confirmation message so Admin
                        can verify your payment.
                      </p>

                    </div>

                    {/* =================================================
                        PAYMENT ERROR
                    ================================================== */}

                    {paymentError && (
                      <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700">

                        <AlertCircle
                          size={17}
                          className="mt-0.5 shrink-0"
                        />

                        <span>
                          {paymentError}
                        </span>

                      </div>
                    )}

                    {/* =================================================
                        FINAL BUTTON
                    ================================================== */}

                    <button
                      type="button"
                      onClick={
                        handleSubmitPayment
                      }
                      disabled={
                        submittingPayment ||
                        !bankConfirmationMessage.trim()
                      }
                      className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#111111] px-5 py-4 text-sm font-bold text-white shadow-sm transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
                    >

                      {submittingPayment ? (

                        <>
                          <RefreshCw
                            size={18}
                            className="animate-spin"
                          />

                          Submitting payment...

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

                    <p className="mt-3 text-center text-xs leading-5 text-gray-400">
                      Your subscription will be immediately
                      activated once payment is verified
                      by Admin.
                    </p>

                  </>

                )}

              </>

            ) : (

              <div className="mt-8 rounded-xl bg-gray-50 p-5">

                <p className="text-sm font-medium text-gray-700">
                  Enter your number of units
                </p>

                <p className="mt-1 text-sm leading-5 text-gray-500">
                  Your applicable package and monthly
                  charge will appear here automatically.
                </p>

              </div>

            )}

          </div>

        </Card>

      </div>

      {/* =====================================================
          HOW IT WORKS
      ====================================================== */}

      <Card>

        <div className="grid gap-6 md:grid-cols-3">

          <div>

            <p className="text-sm font-semibold text-gray-900">
              1. Choose your units
            </p>

            <p className="mt-1 text-sm leading-5 text-gray-500">
              Enter the number of rental units you
              want Ruby Rental to manage.
            </p>

          </div>

          <div>

            <p className="text-sm font-semibold text-gray-900">
              2. Make payment
            </p>

            <p className="mt-1 text-sm leading-5 text-gray-500">
              Pay the exact amount shown using
              Paybill 542 542 and Account 460 500.
            </p>

          </div>

          <div>

            <p className="text-sm font-semibold text-gray-900">
              3. Confirm payment
            </p>

            <p className="mt-1 text-sm leading-5 text-gray-500">
              Paste your I&M Bank confirmation message
              and click I Have Paid.
            </p>

          </div>

        </div>

      </Card>

    </div>
  );
}