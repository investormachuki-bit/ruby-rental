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
     LOAD CURRENT SUBSCRIPTION
  ========================================================= */

  async function loadCurrentSubscription() {

    setPageLoading(true);

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

      if (!profile?.workspace_id) {
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
        return;
      }

      const normalizedSubscription:
        CustomerSubscription = {
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
      };

      setSubscription(
        normalizedSubscription,
      );

      setUnits(
        String(
          normalizedSubscription.subscribed_units,
        ),
      );

      const quoteResult =
        await calculateSubscriptionQuote(
          normalizedSubscription.subscribed_units,
        );

      if (!quoteResult.error) {
        setQuote(
          quoteResult.data,
        );
      }

      await loadPaymentRequest(
        normalizedSubscription.id,
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

      /*
       * First calculate using the existing
       * Ruby Rental progressive pricing engine.
       */

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


      /*
       * Then create/update the actual
       * subscription record.
       */

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

    loadCurrentSubscription();

  }, []);


  /* =========================================================
     AUTO CALCULATE
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
     * Once payment has been submitted,
     * don't allow the customer to change
     * the subscription amount.
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
      setTimeout(() => {

        prepareSubscription(
          numberOfUnits,
        );

      }, 400);

    return () =>
      clearTimeout(timer);

  }, [
    units,
    paymentRequest?.status,
    subscription?.status,
  ]);


  /* =========================================================
     REFRESH PENDING PAYMENT
  ========================================================= */

  useEffect(() => {

    if (
      !subscription ||
      paymentRequest?.status !==
        "Pending"
    ) {
      return;
    }

    const interval =
      setInterval(() => {

        loadPaymentRequest(
          subscription.id,
        );

      }, 8000);

    return () =>
      clearInterval(interval);

  }, [
    subscription?.id,
    paymentRequest?.status,
  ]);


  /* =========================================================
     PAYMENT STATES
  ========================================================= */

  const paymentPending =
    paymentRequest?.status ===
    "Pending";

  const paymentVerified =
    paymentRequest?.status ===
    "Verified";

  const paymentRejected =
    paymentRequest?.status ===
    "Rejected";


  const canSubmitPayment =
    Boolean(subscription) &&
    Boolean(quote) &&
    !paymentPending &&
    !paymentVerified &&
    subscription?.status !==
      "Active";


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

    setSubmittingPayment(true);
    setPaymentError(null);

    try {

      /*
       * IMPORTANT:
       *
       * We now use the subscription already
       * prepared for this customer.
       *
       * We do NOT query for a subscription here.
       */

      const result =
        await submitSubscriptionPayment(
          {
            subscriptionId:
              subscription.id,

            amount:
              subscription.monthly_amount,

            currency:
              subscription.currency,

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

      setBankConfirmationMessage("");

      setPaymentModalOpen(
        false,
      );

    } catch (submissionError) {

      console.error(
        "Payment submission failed:",
        submissionError,
      );

      setPaymentError(
        "Something went wrong while submitting your payment. Please try again.",
      );

    } finally {

      setSubmittingPayment(false);

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


        {/* ERROR */}

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


        {/* PENDING */}

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


        {/* VERIFIED */}

        {paymentVerified && (

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


        {/* REJECTED */}

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


        {/* =================================================
            PAYMENT INSTRUCTIONS
        ================================================= */}

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
                  Make your payment using the details below. After payment, return here and click <strong>I Have Paid</strong> to submit your I&amp;M Bank confirmation.
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
              Pay the exact monthly amount shown in your subscription summary. Keep the full I&amp;M Bank confirmation message.
            </p>

          </div>

        </Card>


        {/* =================================================
            MAIN
        ================================================= */}

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
                  Tell Ruby Rental how many rental units you want your subscription to cover.
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
                    subscription?.status ===
                      "Active"
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
                Your monthly rate is automatically calculated using Ruby Rental's progressive pricing model.
              </p>

            </div>


            {/* PRICING TIERS */}

            <div className="mt-8">

              <p className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-gray-400">
                Monthly pricing
              </p>

              <div className="grid gap-3 sm:grid-cols-3">

                {[
                  [
                    "Basic",
                    "1–20 units",
                    "KSh 50",
                  ],
                  [
                    "Growth",
                    "21–100 units",
                    "KSh 40",
                  ],
                  [
                    "Professional",
                    "101+ units",
                    "KSh 30",
                  ],
                ].map(
                  ([
                    name,
                    range,
                    rate,
                  ]) => (

                    <div
                      key={name}
                      className={`rounded-2xl p-4 ${
                        quote?.plan_name ===
                        name
                          ? "border border-[#D4AF37]/40 bg-[#D4AF37]/5"
                          : "bg-gray-50"
                      }`}
                    >

                      <p className="text-sm font-bold text-gray-900">
                        {name}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {range}
                      </p>

                      <p className="mt-3 font-black text-gray-900">
                        {rate}
                      </p>

                      <p className="text-[11px] text-gray-400">
                        per unit
                      </p>

                    </div>

                  ),
                )}

              </div>

            </div>

          </Card>


          {/* =================================================
              PRICE / ACTION
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

                  Preparing your subscription...

                </div>

              ) : quote ? (

                <>

                  <p className="mt-5 text-4xl font-black tracking-tight text-gray-900 sm:text-5xl">
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


                  <div className="mt-7 space-y-3">

                    <div className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-4">

                      <span className="text-sm text-gray-500">
                        Package
                      </span>

                      <span className="text-sm font-bold text-gray-900">
                        {subscription
                          ? quote.plan_name
                          : quote.plan_name}
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


              {/* FINAL ACTION */}

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
                        Your payment confirmation has been sent to Ruby Rental Admin.
                      </p>

                    </div>

                  </div>

                </div>

              )}


              {paymentVerified && (

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


              <div className="mt-5 flex items-start gap-2">

                <ShieldCheck
                  size={15}
                  className="mt-0.5 shrink-0 text-[#B8941F]"
                />

                <p className="text-xs leading-5 text-gray-400">
                  Pricing is calculated securely by Ruby Rental.
                </p>

              </div>

            </div>

          </Card>

        </div>


        {/* =================================================
            THREE STEPS
        ================================================= */}

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
                Pay the exact amount using Paybill {PAYBILL} and Account {ACCOUNT}.
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


        {/* =================================================
            PAYMENT CONFIRMATION MODAL
        ================================================= */}

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
                      One final step
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


              {/* CONTENT */}

              <div className="overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">


                {/* INSTRUCTIONS FIRST */}

                <div className="rounded-2xl border border-[#D4AF37]/25 bg-[#D4AF37]/5 p-5">

                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#B8941F]">
                    I&amp;M Bank payment confirmation
                  </p>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    Paste the full confirmation message you received after making your payment. This is the only payment evidence required at this stage.
                  </p>

                </div>


                {/* SUMMARY */}

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


                {/* MESSAGE */}

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
                    className="w-full resize-none rounded-2xl border border-gray-200 bg-white px-4 py-4 text-sm leading-6 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10"
                    disabled={
                      submittingPayment
                    }
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


              {/* FINAL BUTTON */}

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