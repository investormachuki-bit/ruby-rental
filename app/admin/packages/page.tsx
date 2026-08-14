"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Calculator,
  Check,
  Edit2,
  Package,
  RefreshCw,
  ShieldCheck,
  X,
} from "lucide-react";

import Card from "@/components/ui/Card";

import {
  getPlatformPackages,
  updateSubscriptionPlan,
  SubscriptionPlan,
} from "@/services/platformPackages";

export default function AdminPackagesPage() {
  const [plans, setPlans] = useState<
    SubscriptionPlan[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [editingPlan, setEditingPlan] =
    useState<SubscriptionPlan | null>(null);

  const [calculatorUnits, setCalculatorUnits] =
    useState("50");

  async function loadPlans() {
    setLoading(true);
    setError(null);

    const result =
      await getPlatformPackages();

    if (result.error) {
      setError(result.error);
    }

    setPlans(result.data);
    setLoading(false);
  }

  useEffect(() => {
    loadPlans();
  }, []);

  /*
   * Calculate the displayed example using
   * the actual package rates from Supabase.
   */
  const calculator = useMemo(() => {
    const units = Number(calculatorUnits);

    if (
      !Number.isInteger(units) ||
      units < 1 ||
      plans.length === 0
    ) {
      return null;
    }

    const basic = plans.find(
      (plan) => plan.name === "Basic"
    );

    const growth = plans.find(
      (plan) => plan.name === "Growth"
    );

    const professional = plans.find(
      (plan) => plan.name === "Professional"
    );

    if (
      !basic ||
      !growth ||
      !professional
    ) {
      return null;
    }

    let amount = 0;

    if (units <= 20) {
      amount =
        units *
        Number(basic.price_per_unit);
    } else if (units <= 100) {
      amount =
        20 *
          Number(basic.price_per_unit) +
        (units - 20) *
          Number(growth.price_per_unit);
    } else {
      amount =
        20 *
          Number(basic.price_per_unit) +
        80 *
          Number(growth.price_per_unit) +
        (units - 100) *
          Number(professional.price_per_unit);
    }

    const packageName =
      units <= 20
        ? "Basic"
        : units <= 100
        ? "Growth"
        : "Professional";

    return {
      units,
      amount,
      packageName,
      basicAmount:
        Math.min(units, 20) *
        Number(basic.price_per_unit),

      growthAmount:
        units > 20
          ? Math.min(units - 20, 80) *
            Number(growth.price_per_unit)
          : 0,

      professionalAmount:
        units > 100
          ? (units - 100) *
            Number(
              professional.price_per_unit
            )
          : 0,
    };
  }, [calculatorUnits, plans]);

  function formatMoney(
    amount: number
  ) {
    return `KSh ${amount.toLocaleString(
      "en-KE",
      {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }
    )}`;
  }

  function formatUnits(
    plan: SubscriptionPlan
  ) {
    if (plan.max_units === null) {
      return `${plan.min_units}+ units`;
    }

    return `${plan.min_units}–${plan.max_units} units`;
  }

  function getPackageDescription(
    plan: SubscriptionPlan
  ) {
    if (plan.name === "Basic") {
      return "The first 20 units in every subscription.";
    }

    if (plan.name === "Growth") {
      return "Units 21–100 are charged at this rate.";
    }

    if (plan.name === "Professional") {
      return "Every unit above 100 is charged at this rate.";
    }

    return (
      plan.description ||
      "Unit-based monthly pricing."
    );
  }

  function getPackageExample(
    plan: SubscriptionPlan
  ) {
    if (plan.name === "Basic") {
      return "20 units = KSh 1,000";
    }

    if (plan.name === "Growth") {
      return "50 units = KSh 2,200";
    }

    if (plan.name === "Professional") {
      return "150 units = KSh 5,700";
    }

    return "Calculated progressively";
  }

  async function savePlan() {
    if (!editingPlan) return;

    setSaving(true);
    setError(null);

    const result =
      await updateSubscriptionPlan(
        editingPlan
      );

    if (result.error) {
      setError(result.error);
      setSaving(false);
      return;
    }

    await loadPlans();

    setEditingPlan(null);
    setSaving(false);
  }

  return (
    <div className="space-y-8">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

        <div>

          <div className="mb-3 flex items-center gap-2">

            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#D4AF37]/10">

              <Package
                size={16}
                className="text-[#B8941F]"
              />

            </div>

            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9A7818]">
              Platform Pricing
            </span>

          </div>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Pricing & Packages
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
            Control the monthly pricing model used by Ruby Rental customers.
          </p>

        </div>

        <button
          type="button"
          onClick={loadPlans}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >

          <RefreshCw
            size={17}
            className={
              loading
                ? "animate-spin"
                : ""
            }
          />

          Refresh

        </button>

      </div>

      {/* =====================================================
          ERROR
      ====================================================== */}

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

          <X
            size={18}
            className="mt-0.5 shrink-0"
          />

          <span>{error}</span>

        </div>
      )}

      {/* =====================================================
          PRICING HERO
      ====================================================== */}

      <Card className="overflow-hidden border-[#D4AF37]/20 bg-gradient-to-br from-white via-white to-[#D4AF37]/10">

        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">

          <div>

            <div className="inline-flex items-center gap-2 rounded-full bg-[#D4AF37]/10 px-3 py-1.5 text-xs font-semibold text-[#8A6D16]">

              <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />

              Progressive monthly pricing

            </div>

            <h2 className="mt-4 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              The more units a landlord manages, the lower the rate on additional units.
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
              Ruby Rental uses one progressive pricing model. The rate is applied according to the position of each unit in the portfolio — so adding a unit can never reduce the customer's monthly bill.
            </p>

          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3">

            {[
              {
                label: "First 20",
                rate: "50",
                detail: "per unit",
              },
              {
                label: "21–100",
                rate: "40",
                detail: "per additional",
              },
              {
                label: "101+",
                rate: "30",
                detail: "per additional",
              },
            ].map((item) => (

              <div
                key={item.label}
                className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm sm:p-4"
              >

                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 sm:text-xs">
                  {item.label}
                </p>

                <p className="mt-2 text-xl font-bold text-gray-900 sm:text-2xl">
                  KSh {item.rate}
                </p>

                <p className="mt-1 text-[10px] leading-4 text-gray-400 sm:text-xs">
                  {item.detail}
                  <br />
                  / month
                </p>

              </div>

            ))}

          </div>

        </div>

      </Card>

      {/* =====================================================
          PACKAGE CONTROL
      ====================================================== */}

      <section>

        <div className="mb-4">

          <h2 className="text-xl font-bold text-gray-900">
            Package Control
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Manage the three pricing bands available to customers.
          </p>

        </div>

        {loading ? (

          <Card>

            <div className="flex min-h-48 items-center justify-center">

              <div className="text-center">

                <RefreshCw
                  size={25}
                  className="mx-auto animate-spin text-[#B8941F]"
                />

                <p className="mt-3 text-sm text-gray-500">
                  Loading packages...
                </p>

              </div>

            </div>

          </Card>

        ) : (

          <div className="grid gap-5 lg:grid-cols-3">

            {plans.map((plan) => (

              <Card
                key={plan.id}
                className="group relative overflow-hidden p-0"
              >

                {/* Accent */}

                <div className="absolute right-0 top-0 h-32 w-32 translate-x-12 -translate-y-12 rounded-full bg-[#D4AF37]/10 transition-transform duration-300 group-hover:scale-125" />

                <div className="relative p-6">

                  {/* Top */}

                  <div className="flex items-start justify-between gap-4">

                    <div>

                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-400">
                        Package
                      </p>

                      <h3 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">
                        {plan.name}
                      </h3>

                    </div>

                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                        plan.is_active
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {plan.is_active
                        ? "Active"
                        : "Inactive"}
                    </span>

                  </div>

                  {/* Description */}

                  <p className="mt-4 min-h-[48px] text-sm leading-6 text-gray-500">
                    {getPackageDescription(
                      plan
                    )}
                  </p>

                  {/* Rate */}

                  <div className="mt-6 rounded-2xl bg-gray-50 p-5">

                    <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400">
                      Rate
                    </p>

                    <div className="mt-1 flex items-baseline gap-2">

                      <span className="text-3xl font-bold tracking-tight text-gray-900">
                        KSh{" "}
                        {Number(
                          plan.price_per_unit
                        ).toLocaleString()}
                      </span>

                    </div>

                    <p className="mt-1 text-xs text-gray-500">

                      {plan.name ===
                      "Basic"
                        ? "per unit / month"
                        : "per additional unit / month"}

                    </p>

                    <div className="my-4 border-t border-gray-200" />

                    <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400">
                      Coverage
                    </p>

                    <p className="mt-1 text-lg font-bold text-gray-900">
                      {formatUnits(plan)}
                    </p>

                  </div>

                  {/* Example */}

                  <div className="mt-4 rounded-xl border border-dashed border-gray-200 px-4 py-3">

                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
                      Example
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-700">
                      {getPackageExample(
                        plan
                      )}
                    </p>

                  </div>

                  {/* Action */}

                  <button
                    type="button"
                    onClick={() =>
                      setEditingPlan({
                        ...plan,
                      })
                    }
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:border-[#D4AF37] hover:bg-[#D4AF37]/5"
                  >

                    <Edit2 size={16} />

                    Edit Package

                  </button>

                </div>

              </Card>

            ))}

          </div>

        )}

      </section>

      {/* =====================================================
          CALCULATOR
      ====================================================== */}

      <section>

        <div className="mb-4">

          <h2 className="text-xl font-bold text-gray-900">
            Pricing Calculator
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Test what a landlord would pay at any portfolio size.
          </p>

        </div>

        <Card className="overflow-hidden">

          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">

            {/* Input */}

            <div>

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D4AF37]/10">

                  <Calculator
                    size={20}
                    className="text-[#B8941F]"
                  />

                </div>

                <div>

                  <p className="font-semibold text-gray-900">
                    How many units?
                  </p>

                  <p className="text-sm text-gray-500">
                    Enter a portfolio size to test the price.
                  </p>

                </div>

              </div>

              <div className="mt-6">

                <div className="relative">

                  <input
                    type="number"
                    min="1"
                    value={calculatorUnits}
                    onChange={(event) =>
                      setCalculatorUnits(
                        event.target.value
                      )
                    }
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-2xl font-bold text-gray-900 outline-none transition focus:border-[#D4AF37] focus:bg-white focus:ring-4 focus:ring-[#D4AF37]/10"
                  />

                  <span className="absolute right-5 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400">
                    units
                  </span>

                </div>

              </div>

              <div className="mt-4 flex flex-wrap gap-2">

                {[10, 20, 21, 50, 100, 101, 150]
                  .map((value) => (

                    <button
                      key={value}
                      type="button"
                      onClick={() =>
                        setCalculatorUnits(
                          String(value)
                        )
                      }
                      className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 transition hover:border-[#D4AF37] hover:bg-[#D4AF37]/5"
                    >
                      {value}
                    </button>

                  ))}

              </div>

            </div>

            {/* Result */}

            <div className="rounded-2xl bg-[#111111] p-6 text-white">

              {calculator ? (

                <>

                  <div className="flex items-start justify-between gap-4">

                    <div>

                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                        Monthly charge
                      </p>

                      <p className="mt-2 text-4xl font-bold tracking-tight">
                        {formatMoney(
                          calculator.amount
                        )}
                      </p>

                    </div>

                    <span className="rounded-full bg-[#D4AF37]/15 px-3 py-1.5 text-xs font-semibold text-[#E6C75A]">
                      {calculator.packageName}
                    </span>

                  </div>

                  <div className="mt-6 space-y-2">

                    {calculator.basicAmount >
                      0 && (

                      <div className="flex justify-between text-sm">

                        <span className="text-gray-400">
                          First 20 units
                        </span>

                        <span className="font-semibold">
                          {formatMoney(
                            calculator.basicAmount
                          )}
                        </span>

                      </div>

                    )}

                    {calculator.growthAmount >
                      0 && (

                      <div className="flex justify-between text-sm">

                        <span className="text-gray-400">
                          Units 21–100
                        </span>

                        <span className="font-semibold">
                          {formatMoney(
                            calculator.growthAmount
                          )}
                        </span>

                      </div>

                    )}

                    {calculator.professionalAmount >
                      0 && (

                      <div className="flex justify-between text-sm">

                        <span className="text-gray-400">
                          Units 101+
                        </span>

                        <span className="font-semibold">
                          {formatMoney(
                            calculator.professionalAmount
                          )}
                        </span>

                      </div>

                    )}

                  </div>

                  <div className="mt-5 border-t border-white/10 pt-4">

                    <div className="flex items-center justify-between">

                      <span className="text-sm text-gray-400">
                        {calculator.units} units
                      </span>

                      <span className="text-lg font-bold">
                        {formatMoney(
                          calculator.amount
                        )}
                      </span>

                    </div>

                  </div>

                </>

              ) : (

                <div className="flex min-h-[180px] items-center justify-center text-center">

                  <div>

                    <Calculator
                      size={28}
                      className="mx-auto text-gray-500"
                    />

                    <p className="mt-3 text-sm text-gray-400">
                      Enter a valid number of units to calculate pricing.
                    </p>

                  </div>

                </div>

              )}

            </div>

          </div>

        </Card>

      </section>

      {/* =====================================================
          PRICING RULES
      ====================================================== */}

      <Card>

        <div className="flex items-start gap-4">

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50">

            <ShieldCheck
              size={21}
              className="text-green-600"
            />

          </div>

          <div>

            <h2 className="font-bold text-gray-900">
              Pricing Rules
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              These rules define how Ruby Rental pricing works.
            </p>

          </div>

        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2">

          {[
            "The first 20 units are charged at KSh 50 each.",
            "Units 21–100 are charged at KSh 40 each.",
            "Units above 100 are charged at KSh 30 each.",
            "Adding a unit can never reduce the monthly bill.",
            "Packages cannot be deleted once they are in use.",
            "Inactive packages are unavailable for new subscriptions.",
          ].map((rule) => (

            <div
              key={rule}
              className="flex items-start gap-3 rounded-xl bg-gray-50 px-4 py-3"
            >

              <Check
                size={17}
                className="mt-0.5 shrink-0 text-green-600"
              />

              <span className="text-sm leading-5 text-gray-600">
                {rule}
              </span>

            </div>

          ))}

        </div>

      </Card>

      {/* =====================================================
          EDIT MODAL
      ====================================================== */}

      {editingPlan && (

        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">

          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">

            {/* Modal header */}

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-5">

              <div>

                <h2 className="text-lg font-bold text-gray-900">
                  Edit {editingPlan.name}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Update this pricing band.
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setEditingPlan(null)
                }
                className="rounded-xl p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              >

                <X size={20} />

              </button>

            </div>

            <div className="space-y-5 p-6">

              {/* Name */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Package name
                </label>

                <input
                  value={editingPlan.name}
                  onChange={(event) =>
                    setEditingPlan({
                      ...editingPlan,
                      name: event.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10"
                />

              </div>

              {/* Description */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Description
                </label>

                <textarea
                  value={
                    editingPlan.description ??
                    ""
                  }
                  onChange={(event) =>
                    setEditingPlan({
                      ...editingPlan,
                      description:
                        event.target.value,
                    })
                  }
                  rows={3}
                  className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10"
                />

              </div>

              {/* Unit range */}

              <div className="grid grid-cols-2 gap-4">

                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Minimum units
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={
                      editingPlan.min_units
                    }
                    onChange={(event) =>
                      setEditingPlan({
                        ...editingPlan,
                        min_units:
                          Number(
                            event.target.value
                          ),
                      })
                    }
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10"
                  />

                </div>

                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Maximum units
                  </label>

                  <input
                    type="number"
                    min="1"
                    placeholder="Unlimited"
                    value={
                      editingPlan.max_units ??
                      ""
                    }
                    onChange={(event) =>
                      setEditingPlan({
                        ...editingPlan,
                        max_units:
                          event.target.value ===
                          ""
                            ? null
                            : Number(
                                event.target
                                  .value
                              ),
                      })
                    }
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10"
                  />

                </div>

              </div>

              {/* Rate */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Rate per unit
                </label>

                <div className="relative">

                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400">
                    KSh
                  </span>

                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={
                      editingPlan.price_per_unit
                    }
                    onChange={(event) =>
                      setEditingPlan({
                        ...editingPlan,
                        price_per_unit:
                          Number(
                            event.target.value
                          ),
                      })
                    }
                    className="w-full rounded-xl border border-gray-200 py-3 pl-14 pr-4 text-sm outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10"
                  />

                </div>

                <p className="mt-2 text-xs leading-5 text-gray-400">
                  This rate applies only to the units belonging to this pricing band.
                </p>

              </div>

              {/* Active */}

              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 p-4">

                <div>

                  <p className="text-sm font-semibold text-gray-900">
                    Package active
                  </p>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Inactive packages cannot be used for new subscriptions.
                  </p>

                </div>

                <input
                  type="checkbox"
                  checked={
                    editingPlan.is_active
                  }
                  onChange={(event) =>
                    setEditingPlan({
                      ...editingPlan,
                      is_active:
                        event.target.checked,
                    })
                  }
                  className="h-5 w-5 accent-[#D4AF37]"
                />

              </label>

            </div>

            {/* Modal footer */}

            <div className="sticky bottom-0 flex gap-3 border-t border-gray-200 bg-white px-6 py-5">

              <button
                type="button"
                onClick={() =>
                  setEditingPlan(null)
                }
                disabled={saving}
                className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={savePlan}
                disabled={saving}
                className="flex-1 rounded-xl bg-[#111111] px-4 py-3 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
              >

                {saving ? (
                  <span className="inline-flex items-center gap-2">

                    <RefreshCw
                      size={16}
                      className="animate-spin"
                    />

                    Saving...

                  </span>
                ) : (
                  "Save Changes"
                )}

              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}