"use client";

import { useEffect, useState } from "react";
import {
  Calculator,
  CheckCircle2,
  CreditCard,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

import Card from "@/components/ui/Card";

import {
  calculateSubscriptionQuote,
  activateSubscription,
  SubscriptionQuote,
} from "@/services/subscription";

export default function SubscriptionPage() {
  const [units, setUnits] = useState("");

  const [quote, setQuote] =
    useState<SubscriptionQuote | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [activating, setActivating] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [success, setSuccess] =
    useState(false);

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
    setSuccess(false);

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

  async function handleActivate() {
    if (!quote) return;

    setActivating(true);
    setError(null);
    setSuccess(false);

    const result =
      await activateSubscription(
        quote.subscribed_units
      );

    if (result.error) {
      setError(result.error);
      setActivating(false);
      return;
    }

    setSuccess(true);
    setActivating(false);
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

      {/* Success */}

      {success && (
        <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-4 text-sm text-green-700">

          <CheckCircle2
            size={20}
            className="mt-0.5 shrink-0"
          />

          <div>

            <p className="font-semibold">
              Subscription activated successfully.
            </p>

            <p className="mt-1 text-green-600">
              Your subscription capacity is now{" "}
              {quote?.subscribed_units} units.
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
                  setUnits(event.target.value);
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

                <button
                  type="button"
                  onClick={handleActivate}
                  disabled={
                    activating ||
                    success
                  }
                  className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#111111] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {activating ? (
                    <>
                      <RefreshCw
                        size={17}
                        className="animate-spin"
                      />

                      Activating...
                    </>
                  ) : success ? (
                    <>
                      <CheckCircle2
                        size={17}
                      />

                      Subscription Active
                    </>
                  ) : (
                    <>
                      <CreditCard
                        size={17}
                      />

                      Activate Subscription
                    </>
                  )}
                </button>

                <p className="mt-3 text-center text-xs leading-5 text-gray-400">
                  Payment processing will be connected before production activation.
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
              2. Get your rate
            </p>

            <p className="mt-1 text-sm leading-5 text-gray-500">
              Ruby Rental automatically applies the appropriate package rate.
            </p>

          </div>

          <div>

            <p className="text-sm font-semibold text-gray-900">
              3. Manage within your limit
            </p>

            <p className="mt-1 text-sm leading-5 text-gray-500">
              Your subscription determines the maximum number of units you can create.
            </p>

          </div>

        </div>

      </Card>

    </div>
  );
}