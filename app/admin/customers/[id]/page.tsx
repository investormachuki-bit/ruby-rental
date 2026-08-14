"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  CreditCard,
  Mail,
  Phone,
  RefreshCw,
  Save,
  UserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";

import Card from "@/components/ui/Card";
import { supabase } from "@/lib/supabase";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

type Customer = {
  id: string;
  name: string;
  brand_name: string | null;
  email: string | null;
  phone: string | null;
  is_active: boolean;
  created_at: string;
};

type Plan = {
  id: string;
  name: string;
  min_units: number;
  max_units: number | null;
  price_per_unit: number;
  currency: string;
  is_active: boolean;
};

type Subscription = {
  id: string;
  workspace_id: string;
  plan_id: string;
  subscribed_units: number;
  rate_per_unit: number;
  monthly_amount: number;
  currency: string;
  status: string;
  start_date: string;
  next_billing_date: string | null;
};

type BillingBreakdown = {
  label: string;
  units: number;
  rate: number;
  amount: number;
};

export default function AdminCustomerDetailsPage({
  params,
}: Props) {
  const router = useRouter();

  const [customerId, setCustomerId] =
    useState<string | null>(null);

  const [customer, setCustomer] =
    useState<Customer | null>(null);

  const [subscription, setSubscription] =
    useState<Subscription | null>(null);

  const [plans, setPlans] =
    useState<Plan[]>([]);

  const [units, setUnits] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [changingStatus, setChangingStatus] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [success, setSuccess] =
    useState<string | null>(null);

  /*
   * Resolve the dynamic route parameter.
   */
  useEffect(() => {
    params.then((value) => {
      setCustomerId(value.id);
    });
  }, [params]);

  /*
   * Load customer, plans and subscription.
   *
   * IMPORTANT:
   * We deliberately query subscribed_units.
   * There is NO subscriptions.unit_limit column.
   */
  async function loadData(id: string) {
    setLoading(true);
    setError(null);

    const [
      customerResult,
      plansResult,
      subscriptionResult,
    ] = await Promise.all([
      supabase
        .from("workspaces")
        .select(`
          id,
          name,
          brand_name,
          email,
          phone,
          is_active,
          created_at
        `)
        .eq("id", id)
        .single(),

      supabase
        .from("subscription_plans")
        .select(`
          id,
          name,
          min_units,
          max_units,
          price_per_unit,
          currency,
          is_active
        `)
        .eq("is_active", true)
        .order("min_units", {
          ascending: true,
        }),

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
          next_billing_date
        `)
        .eq("workspace_id", id)
        .order("created_at", {
          ascending: false,
        })
        .limit(1)
        .maybeSingle(),
    ]);

    if (customerResult.error) {
      setError(
        customerResult.error.message
      );
    }

    if (plansResult.error) {
      setError(
        plansResult.error.message
      );
    }

    if (subscriptionResult.error) {
      setError(
        subscriptionResult.error.message
      );
    }

    setCustomer(
      customerResult.data ?? null
    );

    setPlans(
      (plansResult.data ?? []).map(
        (plan) => ({
          ...plan,
          min_units:
            Number(plan.min_units),

          max_units:
            plan.max_units === null
              ? null
              : Number(plan.max_units),

          price_per_unit:
            Number(plan.price_per_unit),
        })
      )
    );

    if (subscriptionResult.data) {
      const loadedSubscription =
        {
          ...subscriptionResult.data,
          subscribed_units:
            Number(
              subscriptionResult.data
                .subscribed_units
            ),
          rate_per_unit:
            Number(
              subscriptionResult.data
                .rate_per_unit
            ),
          monthly_amount:
            Number(
              subscriptionResult.data
                .monthly_amount
            ),
        };

      setSubscription(
        loadedSubscription
      );

      setUnits(
        String(
          loadedSubscription
            .subscribed_units
        )
      );
    } else {
      setSubscription(null);
      setUnits("");
    }

    setLoading(false);
  }

  useEffect(() => {
    if (customerId) {
      loadData(customerId);
    }
  }, [customerId]);

  /*
   * Current number of units.
   */
  const unitNumber = Math.max(
    0,
    Number(units) || 0
  );

  /*
   * Find the package/band that the
   * portfolio currently falls into.
   */
  const selectedPlan = useMemo(() => {
    if (unitNumber < 1) {
      return null;
    }

    return (
      plans.find((plan) => {
        const aboveMinimum =
          unitNumber >= plan.min_units;

        const belowMaximum =
          plan.max_units === null ||
          unitNumber <= plan.max_units;

        return (
          aboveMinimum &&
          belowMaximum
        );
      }) ?? null
    );
  }, [unitNumber, plans]);

  /*
   * Progressive pricing.
   *
   * 1–20   = KSh 50 each
   * 21–100 = KSh 40 each
   * 101+   = KSh 30 each
   *
   * The calculation is progressive:
   *
   * 50 units =
   * 20 × 50
   * + 30 × 40
   * = KSh 2,200
   */
  const billing = useMemo(() => {
    const breakdown: BillingBreakdown[] =
      [];

    let remaining = unitNumber;
    let monthlyAmount = 0;

    const sortedPlans = [...plans].sort(
      (a, b) =>
        a.min_units - b.min_units
    );

    for (
      let index = 0;
      index < sortedPlans.length;
      index++
    ) {
      const plan =
        sortedPlans[index];

      if (remaining <= 0) {
        break;
      }

      const nextPlan =
        sortedPlans[index + 1];

      let bandUnits = 0;

      if (nextPlan) {
        bandUnits = Math.min(
          remaining,
          Math.max(
            0,
            nextPlan.min_units -
              plan.min_units
          )
        );
      } else {
        bandUnits = remaining;
      }

      if (bandUnits <= 0) {
        continue;
      }

      const amount =
        bandUnits *
        Number(plan.price_per_unit);

      monthlyAmount += amount;
      remaining -= bandUnits;

      let label = "";

      if (plan.max_units === null) {
        label = `Units ${plan.min_units}+`;
      } else if (
        plan.min_units === 1
      ) {
        label = `First ${plan.max_units} units`;
      } else {
        label = `Units ${plan.min_units}-${plan.max_units}`;
      }

      breakdown.push({
        label,
        units: bandUnits,
        rate: Number(
          plan.price_per_unit
        ),
        amount,
      });
    }

    return {
      monthlyAmount,
      breakdown,
      plan: selectedPlan,
    };
  }, [
    unitNumber,
    plans,
    selectedPlan,
  ]);

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

  function getStatusClass(
    status?: string
  ) {
    switch (status) {
      case "Active":
        return "bg-green-50 text-green-700";

      case "Trial":
        return "bg-blue-50 text-blue-700";

      case "Past Due":
        return "bg-amber-50 text-amber-700";

      case "Suspended":
        return "bg-red-50 text-red-700";

      case "Cancelled":
        return "bg-gray-100 text-gray-600";

      default:
        return "bg-gray-100 text-gray-600";
    }
  }

  /*
   * Create or update subscription.
   */
  async function handleSave() {
    if (!customerId) {
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    if (
      unitNumber < 1 ||
      !selectedPlan
    ) {
      setError(
        "Please enter a valid number of units."
      );

      setSaving(false);
      return;
    }

    const subscriptionData = {
      workspace_id: customerId,
      plan_id: selectedPlan.id,
      subscribed_units: unitNumber,
      rate_per_unit:
        selectedPlan.price_per_unit,
      monthly_amount:
        billing.monthlyAmount,
      currency:
        selectedPlan.currency || "KES",
    };

    let result;

    if (subscription) {
      result = await supabase
        .from("subscriptions")
        .update({
          plan_id:
            subscriptionData.plan_id,

          subscribed_units:
            subscriptionData.subscribed_units,

          rate_per_unit:
            subscriptionData.rate_per_unit,

          monthly_amount:
            subscriptionData.monthly_amount,

          currency:
            subscriptionData.currency,
        })
        .eq(
          "id",
          subscription.id
        )
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
          next_billing_date
        `)
        .single();
    } else {
      result = await supabase
        .from("subscriptions")
        .insert({
          workspace_id:
            subscriptionData.workspace_id,

          plan_id:
            subscriptionData.plan_id,

          subscribed_units:
            subscriptionData.subscribed_units,

          rate_per_unit:
            subscriptionData.rate_per_unit,

          monthly_amount:
            subscriptionData.monthly_amount,

          currency:
            subscriptionData.currency,

          status: "Active",

          start_date:
            new Date()
              .toISOString()
              .split("T")[0],

          next_billing_date:
            new Date(
              new Date().setMonth(
                new Date().getMonth() +
                  1
              )
            )
              .toISOString()
              .split("T")[0],
        })
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
          next_billing_date
        `)
        .single();
    }

    if (result.error) {
      setError(
        result.error.message
      );

      setSaving(false);
      return;
    }

    const savedSubscription: Subscription =
      {
        ...result.data,
        subscribed_units:
          Number(
            result.data.subscribed_units
          ),
        rate_per_unit:
          Number(
            result.data.rate_per_unit
          ),
        monthly_amount:
          Number(
            result.data.monthly_amount
          ),
      };

    setSubscription(
      savedSubscription
    );

    setUnits(
      String(
        savedSubscription
          .subscribed_units
      )
    );

    setSuccess(
      subscription
        ? "Subscription updated successfully."
        : "Subscription started successfully."
    );

    setSaving(false);
  }

  /*
   * Change subscription status.
   */
  async function handleStatusChange(
    status: string
  ) {
    if (!subscription) {
      return;
    }

    setChangingStatus(true);
    setError(null);
    setSuccess(null);

    const { data, error } =
      await supabase
        .from("subscriptions")
        .update({
          status,
        })
        .eq(
          "id",
          subscription.id
        )
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
          next_billing_date
        `)
        .single();

    if (error) {
      setError(
        error.message
      );

      setChangingStatus(false);
      return;
    }

    setSubscription({
      ...data,
      subscribed_units:
        Number(
          data.subscribed_units
        ),
      rate_per_unit:
        Number(
          data.rate_per_unit
        ),
      monthly_amount:
        Number(
          data.monthly_amount
        ),
    });

    setSuccess(
      `Subscription ${status.toLowerCase()}.`
    );

    setChangingStatus(false);
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">

          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#D4AF37]" />

          <p className="mt-3 text-sm text-gray-500">
            Loading customer...
          </p>

        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="space-y-6">

        <button
          type="button"
          onClick={() =>
            router.push(
              "/admin/customers"
            )
          }
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={17} />
          Back to customers
        </button>

        <Card>

          <div className="py-12 text-center">

            <Building2
              size={30}
              className="mx-auto text-gray-300"
            />

            <h2 className="mt-4 font-semibold text-gray-900">
              Customer not found
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              The requested workspace
              could not be found.
            </p>

          </div>

        </Card>

      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <button
            type="button"
            onClick={() =>
              router.push(
                "/admin/customers"
              )
            }
            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-gray-900"
          >
            <ArrowLeft size={17} />
            Back to customers
          </button>

          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-xl font-bold text-gray-600">

              {(
                customer.brand_name ||
                customer.name ||
                "R"
              )
                .charAt(0)
                .toUpperCase()}

            </div>

            <div>

              <div className="mb-1 flex items-center gap-2">

                <Building2
                  size={16}
                  className="text-[#B8941F]"
                />

                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                  Customer
                </span>

              </div>

              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                {customer.brand_name ||
                  customer.name}
              </h1>

              {customer.brand_name &&
                customer.name && (
                  <p className="mt-1 text-sm text-gray-500">
                    {customer.name}
                  </p>
                )}

            </div>

          </div>

        </div>

        <button
          type="button"
          onClick={() =>
            customerId &&
            loadData(customerId)
          }
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
        >

          <RefreshCw size={17} />

          Refresh

        </button>

      </div>

      {/* =====================================================
          MESSAGES
      ====================================================== */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">

          <CheckCircle2 size={17} />

          {success}

        </div>
      )}

      {/* =====================================================
          CUSTOMER DETAILS + SUBSCRIPTION SUMMARY
      ====================================================== */}

      <div className="grid gap-6 lg:grid-cols-3">

        {/* Customer details */}

        <Card>

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4AF37]/10">

              <UserRound
                size={19}
                className="text-[#B8941F]"
              />

            </div>

            <div>

              <h2 className="font-semibold text-gray-900">
                Customer Details
              </h2>

              <p className="text-xs text-gray-400">
                Workspace information
              </p>

            </div>

          </div>

          <div className="mt-6 space-y-5">

            <div>

              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Business
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                {customer.brand_name ||
                  customer.name}
              </p>

            </div>

            {customer.email && (
              <div>

                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Email
                </p>

                <div className="mt-1 flex items-center gap-2 text-sm text-gray-700">

                  <Mail
                    size={15}
                    className="text-gray-400"
                  />

                  <span className="break-all">
                    {customer.email}
                  </span>

                </div>

              </div>
            )}

            {customer.phone && (
              <div>

                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Phone
                </p>

                <div className="mt-1 flex items-center gap-2 text-sm text-gray-700">

                  <Phone
                    size={15}
                    className="text-gray-400"
                  />

                  {customer.phone}

                </div>

              </div>
            )}

            <div>

              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Account
              </p>

              <span
                className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                  customer.is_active
                    ? "bg-green-50 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {customer.is_active
                  ? "Active"
                  : "Inactive"}
              </span>

            </div>

          </div>

        </Card>

        {/* Subscription summary */}

        <Card className="lg:col-span-2">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4AF37]/10">

                <CreditCard
                  size={19}
                  className="text-[#B8941F]"
                />

              </div>

              <div>

                <h2 className="font-semibold text-gray-900">
                  Subscription
                </h2>

                <p className="text-xs text-gray-400">
                  Current billing arrangement
                </p>

              </div>

            </div>

            {subscription && (
              <span
                className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                  subscription.status
                )}`}
              >
                {subscription.status}
              </span>
            )}

          </div>

          {subscription ? (
            <div className="mt-6 grid gap-4 sm:grid-cols-3">

              <div className="rounded-xl bg-gray-50 p-4">

                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Package
                </p>

                <p className="mt-2 font-bold text-gray-900">
                  {selectedPlan?.name ||
                    "Unknown"}
                </p>

              </div>

              <div className="rounded-xl bg-gray-50 p-4">

                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Units
                </p>

                <p className="mt-2 font-bold text-gray-900">
                  {subscription.subscribed_units.toLocaleString()}
                </p>

              </div>

              <div className="rounded-xl bg-gray-50 p-4">

                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Monthly
                </p>

                <p className="mt-2 font-bold text-gray-900">
                  {formatMoney(
                    subscription.monthly_amount,
                    subscription.currency
                  )}
                </p>

              </div>

            </div>
          ) : (
            <div className="mt-6 rounded-xl border border-dashed border-gray-200 bg-gray-50 px-6 py-8 text-center">

              <CreditCard
                size={25}
                className="mx-auto text-gray-300"
              />

              <h3 className="mt-3 font-semibold text-gray-900">
                No subscription
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Start a subscription below.
              </p>

            </div>
          )}

        </Card>

      </div>

      {/* =====================================================
          SUBSCRIPTION EDITOR
      ====================================================== */}

      <Card>

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4AF37]/10">

            <CreditCard
              size={19}
              className="text-[#B8941F]"
            />

          </div>

          <div>

            <h2 className="font-semibold text-gray-900">
              {subscription
                ? "Change Subscription"
                : "Start Subscription"}
            </h2>

            <p className="text-sm text-gray-500">
              Set the customer's total
              number of rental units.
            </p>

          </div>

        </div>

        <div className="mt-6">

          <label className="text-sm font-semibold text-gray-700">
            Number of Units
          </label>

          <input
            type="number"
            min="1"
            value={units}
            onChange={(event) =>
              setUnits(
                event.target.value
              )
            }
            placeholder="e.g. 25"
            className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10"
          />

          <p className="mt-2 text-xs text-gray-400">
            The applicable package is
            determined automatically from
            the number of units.
          </p>

        </div>

        {/* Package bands */}

        <div className="mt-6">

          <p className="text-sm font-semibold text-gray-700">
            Pricing Bands
          </p>

          <div className="mt-3 grid gap-3 md:grid-cols-3">

            {plans.map((plan) => {

              const active =
                selectedPlan?.id ===
                plan.id;

              return (
                <div
                  key={plan.id}
                  className={`rounded-2xl border p-4 transition ${
                    active
                      ? "border-[#D4AF37] bg-[#D4AF37]/5"
                      : "border-gray-200 bg-white"
                  }`}
                >

                  <div className="flex items-start justify-between gap-3">

                    <div>

                      <p className="font-semibold text-gray-900">
                        {plan.name}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        {plan.min_units}
                        {" – "}
                        {plan.max_units ??
                          "Unlimited"}{" "}
                        units
                      </p>

                    </div>

                    {active && (
                      <span className="rounded-full bg-[#D4AF37]/15 px-2 py-1 text-[10px] font-bold text-[#8A6D16]">
                        CURRENT
                      </span>
                    )}

                  </div>

                  <p className="mt-5 text-xl font-bold text-gray-900">
                    {formatMoney(
                      plan.price_per_unit,
                      plan.currency
                    )}
                  </p>

                  <p className="text-xs text-gray-400">
                    per additional unit
                  </p>

                </div>
              );
            })}

          </div>

        </div>

        {/* =================================================
            BILLING PREVIEW
        ================================================== */}

        <div className="mt-8 rounded-2xl bg-[#111111] p-5 text-white sm:p-6">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                Monthly Billing Preview
              </p>

              <h3 className="mt-2 text-3xl font-bold">
                {formatMoney(
                  billing.monthlyAmount
                )}
              </h3>

              <p className="mt-1 text-sm text-gray-400">
                {unitNumber > 0
                  ? `${unitNumber.toLocaleString()} rental units`
                  : "Enter the number of units"}
              </p>

            </div>

            {selectedPlan && (
              <span className="rounded-full bg-[#D4AF37]/15 px-3 py-1.5 text-xs font-bold text-[#E3C85A]">
                {selectedPlan.name}
              </span>
            )}

          </div>

          {billing.breakdown.length >
            0 && (
            <div className="mt-6 divide-y divide-white/10">

              {billing.breakdown.map(
                (item, index) => (
                  <div
                    key={`${item.label}-${index}`}
                    className="flex items-center justify-between gap-4 py-3"
                  >

                    <div>

                      <p className="text-sm font-medium text-gray-200">
                        {item.label}
                      </p>

                      <p className="mt-0.5 text-xs text-gray-500">
                        {item.units} units ×{" "}
                        {formatMoney(
                          item.rate
                        )}
                      </p>

                    </div>

                    <p className="font-semibold text-white">
                      {formatMoney(
                        item.amount
                      )}
                    </p>

                  </div>
                )
              )}

            </div>
          )}

        </div>

        {/* Save */}

        <div className="mt-6 flex justify-end">

          <button
            type="button"
            onClick={handleSave}
            disabled={
              saving ||
              unitNumber < 1 ||
              !selectedPlan
            }
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#B8941F] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >

            <Save size={17} />

            {saving
              ? "Saving..."
              : subscription
              ? "Save Changes"
              : "Start Subscription"}

          </button>

        </div>

      </Card>

      {/* =====================================================
          SUBSCRIPTION CONTROLS
      ====================================================== */}

      {subscription && (
        <Card>

          <h2 className="font-semibold text-gray-900">
            Subscription Controls
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Control the customer's
            subscription status.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">

            {subscription.status !==
              "Active" && (
              <button
                type="button"
                disabled={
                  changingStatus
                }
                onClick={() =>
                  handleStatusChange(
                    "Active"
                  )
                }
                className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
              >

                <CheckCircle2
                  size={16}
                />

                Activate

              </button>
            )}

            {subscription.status !==
              "Suspended" && (
              <button
                type="button"
                disabled={
                  changingStatus
                }
                onClick={() =>
                  handleStatusChange(
                    "Suspended"
                  )
                }
                className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50"
              >
                Suspend
              </button>
            )}

            {subscription.status !==
              "Cancelled" && (
              <button
                type="button"
                disabled={
                  changingStatus
                }
                onClick={() =>
                  handleStatusChange(
                    "Cancelled"
                  )
                }
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel Subscription
              </button>
            )}

          </div>

          <div className="mt-6 grid gap-4 border-t border-gray-100 pt-6 sm:grid-cols-3">

            <div>

              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Started
              </p>

              <p className="mt-1 text-sm font-medium text-gray-700">
                {subscription.start_date
                  ? new Date(
                      subscription.start_date
                    ).toLocaleDateString(
                      "en-KE",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }
                    )
                  : "—"}
              </p>

            </div>

            <div>

              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Next Billing
              </p>

              <p className="mt-1 text-sm font-medium text-gray-700">
                {subscription.next_billing_date
                  ? new Date(
                      subscription.next_billing_date
                    ).toLocaleDateString(
                      "en-KE",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }
                    )
                  : "—"}
              </p>

            </div>

            <div>

              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Subscription ID
              </p>

              <p className="mt-1 truncate font-mono text-xs text-gray-500">
                {subscription.id}
              </p>

            </div>

          </div>

        </Card>
      )}

    </div>
  );
}