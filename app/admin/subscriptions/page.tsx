"use client";

import { useEffect, useState } from "react";
import {
  CreditCard,
  RefreshCw,
  Search,
  Users,
} from "lucide-react";

import Card from "@/components/ui/Card";
import StatCard from "@/components/ui/StatCard";

import {
  getPlatformSubscriptions,
  getSubscriptionStats,
  PlatformSubscription,
  SubscriptionStats,
} from "@/services/platformSubscriptions";

export default function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] =
    useState<PlatformSubscription[]>([]);

  const [stats, setStats] =
    useState<SubscriptionStats>({
      active: 0,
      trial: 0,
      pastDue: 0,
      monthlyRevenue: 0,
    });

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function loadData() {
    setLoading(true);
    setError(null);

    const [
      subscriptionsResult,
      statsResult,
    ] = await Promise.all([
      getPlatformSubscriptions(),
      getSubscriptionStats(),
    ]);

    if (subscriptionsResult.error) {
      setError(subscriptionsResult.error);
    }

    if (statsResult.error) {
      setError(statsResult.error);
    }

    setSubscriptions(
      subscriptionsResult.data
    );

    setStats(statsResult.data);

    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  const filteredSubscriptions =
    subscriptions.filter((subscription) => {
      const workspaceName =
        subscription.workspace?.name ?? "";

      const brandName =
        subscription.workspace?.brand_name ?? "";

      const planName =
        subscription.plan?.name ?? "";

      const query =
        search.toLowerCase().trim();

      if (!query) return true;

      return (
        workspaceName
          .toLowerCase()
          .includes(query) ||
        brandName
          .toLowerCase()
          .includes(query) ||
        planName
          .toLowerCase()
          .includes(query)
      );
    });

  function formatMoney(
    amount: number,
    currency = "KES"
  ) {
    return `${currency === "KES" ? "KSh" : currency} ${amount.toLocaleString(
      "en-KE",
      {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }
    )}`;
  }

  function getStatusClass(status: string) {
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
      case "Expired":
        return "bg-gray-100 text-gray-600";

      default:
        return "bg-gray-100 text-gray-600";
    }
  }

  return (
    <div className="space-y-8">

      {/* Header */}

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
            Subscriptions
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage Ruby Rental customer subscriptions and billing status.
          </p>

        </div>

        <button
          type="button"
          onClick={loadData}
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

      {/* Statistics */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Active"
          value={stats.active}
          subtitle="Active subscriptions"
          icon={
            <CreditCard
              size={21}
              className="text-[#B8941F]"
            />
          }
        />

        <StatCard
          title="Trial"
          value={stats.trial}
          subtitle="Accounts on trial"
          icon={
            <Users
              size={21}
              className="text-[#B8941F]"
            />
          }
        />

        <StatCard
          title="Past Due"
          value={stats.pastDue}
          subtitle="Require attention"
          icon={
            <CreditCard
              size={21}
              className="text-[#B8941F]"
            />
          }
        />

        <StatCard
          title="Monthly Revenue"
          value={formatMoney(
            stats.monthlyRevenue
          )}
          subtitle="From active subscriptions"
          icon={
            <CreditCard
              size={21}
              className="text-[#B8941F]"
            />
          }
        />

      </div>

      {/* Error */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Subscription table */}

      <Card className="overflow-hidden p-0">

        <div className="border-b border-gray-200 p-5 sm:p-6">

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div>

              <h2 className="text-lg font-semibold text-gray-900">
                Customer Subscriptions
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {subscriptions.length} subscription
                {subscriptions.length === 1
                  ? ""
                  : "s"} registered
              </p>

            </div>

            <div className="relative w-full md:max-w-sm">

              <Search
                size={17}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search customer or plan..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none transition focus:border-[#D4AF37] focus:bg-white focus:ring-2 focus:ring-[#D4AF37]/10"
              />

            </div>

          </div>

        </div>

        {loading ? (

          <div className="flex min-h-56 items-center justify-center">

            <div className="text-center">

              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#D4AF37]" />

              <p className="mt-3 text-sm text-gray-500">
                Loading subscriptions...
              </p>

            </div>

          </div>

        ) : filteredSubscriptions.length === 0 ? (

          <div className="flex min-h-56 items-center justify-center px-6">

            <div className="text-center">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100">

                <CreditCard
                  size={21}
                  className="text-gray-400"
                />

              </div>

              <h3 className="mt-4 font-semibold text-gray-900">
                {search
                  ? "No matching subscriptions"
                  : "No subscriptions yet"}
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                {search
                  ? "Try a different search."
                  : "Customer subscriptions will appear here once created."}
              </p>

            </div>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full min-w-[900px]">

              <thead>

                <tr className="border-b border-gray-200 bg-gray-50/80">

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Customer
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Package
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Units
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Rate
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Monthly
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Status
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Next Billing
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-gray-100">

                {filteredSubscriptions.map(
                  (subscription) => {

                    const workspace =
                      subscription.workspace;

                    const plan =
                      subscription.plan;

                    return (
                      <tr
                        key={subscription.id}
                        className="transition hover:bg-gray-50/70"
                      >

                        {/* Customer */}

                        <td className="px-6 py-5">

                          <div>

                            <p className="font-semibold text-gray-900">
                              {workspace?.brand_name ||
                                workspace?.name ||
                                "Unnamed workspace"}
                            </p>

                            {workspace?.brand_name &&
                              workspace?.name && (
                                <p className="mt-1 text-xs text-gray-500">
                                  {workspace.name}
                                </p>
                              )}

                            {workspace?.email && (
                              <p className="mt-1 text-xs text-gray-400">
                                {workspace.email}
                              </p>
                            )}

                          </div>

                        </td>

                        {/* Package */}

                        <td className="px-6 py-5">

                          <span className="inline-flex rounded-lg bg-[#D4AF37]/10 px-3 py-1.5 text-sm font-semibold text-[#8A6D16]">
                            {plan?.name ||
                              "Unknown"}
                          </span>

                        </td>

                        {/* Units */}

                        <td className="px-6 py-5">

                          <p className="font-semibold text-gray-900">
                            {subscription.subscribed_units.toLocaleString()}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            units
                          </p>

                        </td>

                        {/* Rate */}

                        <td className="px-6 py-5">

                          <p className="font-medium text-gray-900">
                            {formatMoney(
                              Number(
                                subscription.rate_per_unit
                              ),
                              subscription.currency
                            )}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            per unit
                          </p>

                        </td>

                        {/* Monthly */}

                        <td className="px-6 py-5">

                          <p className="font-bold text-gray-900">
                            {formatMoney(
                              Number(
                                subscription.monthly_amount
                              ),
                              subscription.currency
                            )}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            per month
                          </p>

                        </td>

                        {/* Status */}

                        <td className="px-6 py-5">

                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                              subscription.status
                            )}`}
                          >
                            {subscription.status}
                          </span>

                        </td>

                        {/* Billing */}

                        <td className="px-6 py-5">

                          <p className="text-sm font-medium text-gray-700">
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

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        )}

      </Card>

    </div>
  );
}