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

import {
  BillingBreakdown,
  CustomerPlan,
  CustomerSubscription,
  PlatformCustomer,
  calculateProgressiveBilling,
  createCustomerSubscription,
  getCustomerPlans,
  getCustomerSubscription,
  getPlatformCustomer,
  updateCustomerSubscription,
  updateSubscriptionStatus,
} from "@/services/platformCustomer";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default function AdminCustomerDetailsPage({
  params,
}: Props) {
  const router = useRouter();

  const [customerId, setCustomerId] =
    useState<string | null>(null);

  const [customer, setCustomer] =
    useState<PlatformCustomer | null>(null);

  const [subscription, setSubscription] =
    useState<CustomerSubscription | null>(null);

  const [plans, setPlans] =
    useState<CustomerPlan[]>([]);

  const [units, setUnits] =
    useState("");

  const [selectedPlanId, setSelectedPlanId] =
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

  useEffect(() => {
    params.then((value) => {
      setCustomerId(value.id);
    });
  }, [params]);

  async function loadData(id: string) {
    setLoading(true);
    setError(null);

    const [
      customerResult,
      subscriptionResult,
      plansResult,
    ] = await Promise.all([
      getPlatformCustomer(id),
      getCustomerSubscription(id),
      getCustomerPlans(),
    ]);

    if (customerResult.error) {
      setError(customerResult.error);
    }

    if (subscriptionResult.error) {
      setError(subscriptionResult.error);
    }

    if (plansResult.error) {
      setError(plansResult.error);
    }

    setCustomer(
      customerResult.data
    );

    setSubscription(
      subscriptionResult.data
    );

    setPlans(
      plansResult.data
    );

    if (subscriptionResult.data) {
      setUnits(
        String(
          subscriptionResult.data
            .subscribed_units
        )
      );

      setSelectedPlanId(
        subscriptionResult.data
          .plan_id
      );
    }

    setLoading(false);
  }

  useEffect(() => {
    if (customerId) {
      loadData(customerId);
    }
  }, [customerId]);

  const unitNumber =
    Math.max(
      0,
      Number(units) || 0
    );

  const billing = useMemo(() => {
    return calculateProgressiveBilling(
      unitNumber,
      plans
    );
  }, [unitNumber, plans]);

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

      default:
        return "bg-gray-100 text-gray-600";
    }
  }

  async function handleSave() {
    if (!customerId) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    if (!billing.plan) {
      setError(
        "Please enter a valid number of units."
      );
      setSaving(false);
      return;
    }

    if (
      billing.plan.id !==
      selectedPlanId
    ) {
      setSelectedPlanId(
        billing.plan.id
      );
    }

    let result;

    if (subscription) {
      result =
        await updateCustomerSubscription(
          subscription.id,
          billing.plan.id,
          unitNumber,
          plans
        );
    } else {
      result =
        await createCustomerSubscription(
          customerId,
          billing.plan.id,
          unitNumber,
          plans
        );
    }

    if (result.error) {
      setError(result.error);
      setSaving(false);
      return;
    }

    setSubscription(
      result.data
    );

    setSelectedPlanId(
      billing.plan.id
    );

    setSuccess(
      subscription
        ? "Subscription updated successfully."
        : "Subscription started successfully."
    );

    setSaving(false);
  }

  async function handleStatusChange(
    status: string
  ) {
    if (!subscription) return;

    setChangingStatus(true);
    setError(null);
    setSuccess(null);

    const result =
      await updateSubscriptionStatus(
        subscription.id,
        status
      );

    if (result.error) {
      setError(result.error);
      setChangingStatus(false);
      return;
    }

    setSubscription({
      ...subscription,
      status,
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
              The requested workspace could
              not be found.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Header */}

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
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
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

      {/* Messages */}

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

      {/* Customer information */}

      <div className="grid gap-6 lg:grid-cols-3">

        <Card className="lg:col-span-1">

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

                  {customer.email}
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

        {/* Subscription */}

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
                  Manage customer billing
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

          {subscription && (
            <div className="mt-6 grid gap-4 sm:grid-cols-3">

              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Package
                </p>

                <p className="mt-2 font-bold text-gray-900">
                  {subscription.plan?.name ||
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
                  Current Monthly
                </p>

                <p className="mt-2 font-bold text-gray-900">
                  {formatMoney(
                    subscription.monthly_amount,
                    subscription.currency
                  )}
                </p>
              </div>

            </div>
          )}

          {!subscription && (
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

      {/* Subscription editor */}

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
              Set the customer's number of
              rental units.
            </p>
          </div>

        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">

          {/* Units */}

          <div>

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
              Enter the total number of
              rental units managed by this
              customer.
            </p>

          </div>

          {/* Package */}

          <div>

            <label className="text-sm font-semibold text-gray-700">
              Package
            </label>

            <div className="mt-2 grid gap-2">

              {plans.map((plan) => {

                const isSelected =
                  billing.plan?.id ===
                  plan.id;

                return (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => {
                      setSelectedPlanId(
                        plan.id
                      );

                      if (
                        unitNumber <
                        plan.min_units
                      ) {
                        setUnits(
                          String(
                            plan.min_units
                          )
                        );
                      }
                    }}
                    className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left transition ${
                      isSelected
                        ? "border-[#D4AF37] bg-[#D4AF37]/5"
                        : "border-gray-200 bg-white hover:bg-gray-50"
                    }`}
                  >

                    <div>
                      <p className="font-semibold text-gray-900">
                        {plan.name}
                      </p>

                      <p className="text-xs text-gray-400">
                        {plan.min_units}
                        {" – "}
                        {plan.max_units ??
                          "Unlimited"}{" "}
                        units
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        {formatMoney(
                          plan.price_per_unit,
                          plan.currency
                        )}
                      </p>

                      <p className="text-xs text-gray-400">
                        / unit
                      </p>
                    </div>

                  </button>
                );
              })}

            </div>

          </div>

        </div>

        {/* Billing preview */}

        <div className="mt-8 rounded-2xl bg-gray-50 p-5">

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h3 className="font-semibold text-gray-900">
                Monthly Billing Preview
              </h3>

              <p className="text-sm text-gray-500">
                Progressive pricing based on
                the customer's units.
              </p>
            </div>

            <div className="text-left sm:text-right">

              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Total
              </p>

              <p className="text-2xl font-bold text-gray-900">
                {formatMoney(
                  billing.monthlyAmount
                )}
              </p>

            </div>

          </div>

          {billing.breakdown.length > 0 && (
            <div className="mt-5 divide-y divide-gray-200">

              {billing.breakdown.map(
                (
                  item: BillingBreakdown,
                  index
                ) => (
                  <div
                    key={`${item.label}-${index}`}
                    className="flex items-center justify-between py-3"
                  >

                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        {item.label}
                      </p>

                      <p className="text-xs text-gray-400">
                        {item.units} units ×{" "}
                        {formatMoney(
                          item.rate
                        )}
                      </p>
                    </div>

                    <p className="font-semibold text-gray-900">
                      {formatMoney(
                        item.amount
                      )}
                    </p>

                  </div>
                )
              )}

            </div>
          )}

          {unitNumber > 0 &&
            !billing.plan && (
              <p className="mt-4 text-sm text-red-600">
                No package covers this number
                of units.
              </p>
            )}

        </div>

        <div className="mt-6 flex justify-end">

          <button
            type="button"
            onClick={handleSave}
            disabled={
              saving ||
              unitNumber < 1 ||
              !billing.plan
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#B8941F] disabled:cursor-not-allowed disabled:opacity-50"
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

      {/* Subscription controls */}

      {subscription && (
        <Card>

          <h2 className="font-semibold text-gray-900">
            Subscription Controls
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Control the customer's billing
            status.
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
                {new Date(
                  subscription.start_date
                ).toLocaleDateString(
                  "en-KE",
                  {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }
                )}
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