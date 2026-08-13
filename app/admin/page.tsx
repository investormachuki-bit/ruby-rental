"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  AlertCircle,
  CreditCard,
  Package,
  RefreshCw,
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

export default function PlatformAdminDashboard() {
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
  const [error, setError] =
    useState<string | null>(null);

  async function loadDashboard() {
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
      setError(
        subscriptionsResult.error
      );
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
    loadDashboard();
  }, []);

  function formatMoney(
    amount: number,
    currency = "KES"
  ) {
    return `${
      currency === "KES"
        ? "KSh"
        : currency
    } ${amount.toLocaleString("en-KE", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;
  }

  function statusClass(status: string) {
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

  const recentSubscriptions =
    subscriptions.slice(0, 5);

  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

        <div>

          <div className="mb-2 flex items-center gap-2">

            <span className="h-2 w-2 rounded-full bg-[#D4AF37]" />

            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
              Ruby Rental
            </span>

          </div>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Platform Administration
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-gray-500 sm:text-base">
            Monitor subscriptions, packages and the Ruby Rental customer base.
          </p>

        </div>

        <button
          type="button"
          onClick={loadDashboard}
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

      {/* Error */}

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

          <AlertCircle size={18} />

          <span>{error}</span>

        </div>
      )}

      {/* Subscription overview */}

      <section>

        <div className="mb-4">

          <h2 className="text-lg font-semibold text-gray-900">
            Subscription Overview
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            The numbers that matter for the Ruby Rental subscription business.
          </p>

        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <StatCard
            title="Active Subscriptions"
            value={stats.active}
            subtitle="Currently active"
            icon={
              <CreditCard
                size={22}
                className="text-[#B8941F]"
              />
            }
          />

          <StatCard
            title="Trial Accounts"
            value={stats.trial}
            subtitle="Currently on trial"
            icon={
              <Users
                size={22}
                className="text-[#B8941F]"
              />
            }
          />

          <StatCard
            title="Past Due"
            value={stats.pastDue}
            subtitle="Require attention"
            icon={
              <AlertCircle
                size={22}
                className="text-[#B8941F]"
              />
            }
          />

          <StatCard
            title="Monthly Revenue"
            value={formatMoney(
              stats.monthlyRevenue
            )}
            subtitle="Active subscriptions"
            icon={
              <CreditCard
                size={22}
                className="text-[#B8941F]"
              />
            }
          />

        </div>

      </section>

      {/* Main content */}

      <div className="grid gap-6 xl:grid-cols-3">

        {/* Recent subscriptions */}

        <Card className="overflow-hidden p-0 xl:col-span-2">

          <div className="flex items-center justify-between border-b border-gray-200 px-5 py-5 sm:px-6">

            <div>

              <h2 className="font-semibold text-gray-900">
                Recent Subscriptions
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Latest customer subscriptions.
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                window.location.href =
                  "/admin/subscriptions"
              }
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#9A7818] hover:text-[#7C6010]"
            >
              View all
              <ArrowRight size={15} />
            </button>

          </div>

          {loading ? (

            <div className="flex min-h-52 items-center justify-center">

              <div className="text-center">

                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#D4AF37]" />

                <p className="mt-3 text-sm text-gray-500">
                  Loading subscriptions...
                </p>

              </div>

            </div>

          ) : recentSubscriptions.length === 0 ? (

            <div className="flex min-h-52 items-center justify-center px-6">

              <div className="text-center">

                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100">

                  <CreditCard
                    size={20}
                    className="text-gray-400"
                  />

                </div>

                <p className="mt-3 font-semibold text-gray-900">
                  No subscriptions yet
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Customer subscriptions will appear here.
                </p>

              </div>

            </div>

          ) : (

            <div className="divide-y divide-gray-100">

              {recentSubscriptions.map(
                (subscription) => {

                  const workspace =
                    subscription.workspace;

                  const plan =
                    subscription.plan;

                  return (
                    <div
                      key={subscription.id}
                      className="flex flex-col gap-4 px-5 py-5 transition hover:bg-gray-50/70 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                    >

                      <div className="flex min-w-0 items-center gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-sm font-bold text-gray-600">
                          {(
                            workspace?.brand_name ||
                            workspace?.name ||
                            "R"
                          )
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div className="min-w-0">

                          <p className="truncate font-semibold text-gray-900">
                            {workspace?.brand_name ||
                              workspace?.name ||
                              "Unnamed workspace"}
                          </p>

                          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-400">

                            <span>
                              {plan?.name ||
                                "Unknown plan"}
                            </span>

                            <span>•</span>

                            <span>
                              {subscription.subscribed_units.toLocaleString()}{" "}
                              units
                            </span>

                          </div>

                        </div>

                      </div>

                      <div className="flex items-center justify-between gap-5 sm:justify-end">

                        <div className="text-left sm:text-right">

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

                        </div>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(
                            subscription.status
                          )}`}
                        >
                          {subscription.status}
                        </span>

                      </div>

                    </div>
                  );
                }
              )}

            </div>

          )}

        </Card>

        {/* Packages summary */}

        <Card>

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D4AF37]/10">

              <Package
                size={21}
                className="text-[#B8941F]"
              />

            </div>

            <div>

              <h2 className="font-semibold text-gray-900">
                Pricing Packages
              </h2>

              <p className="text-sm text-gray-500">
                Current monthly rates
              </p>

            </div>

          </div>

          <div className="mt-6 space-y-3">

            <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">

              <div>

                <p className="text-sm font-semibold text-gray-900">
                  Basic
                </p>

                <p className="text-xs text-gray-400">
                  1–20 units
                </p>

              </div>

              <p className="font-bold text-gray-900">
                KSh 50
              </p>

            </div>

            <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">

              <div>

                <p className="text-sm font-semibold text-gray-900">
                  Growth
                </p>

                <p className="text-xs text-gray-400">
                  21–100 units
                </p>

              </div>

              <p className="font-bold text-gray-900">
                KSh 40
              </p>

            </div>

            <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">

              <div>

                <p className="text-sm font-semibold text-gray-900">
                  Professional
                </p>

                <p className="text-xs text-gray-400">
                  101+ units
                </p>

              </div>

              <p className="font-bold text-gray-900">
                KSh 30
              </p>

            </div>

          </div>

          <button
            type="button"
            onClick={() =>
              window.location.href =
                "/admin/packages"
            }
            className="mt-5 flex w-full items-center justify-between rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:border-[#D4AF37] hover:bg-gray-50"
          >
            Manage packages

            <ArrowRight size={16} />

          </button>

        </Card>

      </div>

      {/* Business model */}

      <Card className="border-[#D4AF37]/20 bg-gradient-to-r from-white to-[#D4AF37]/5">

        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#B8941F]">
              Ruby Rental
            </p>

            <h2 className="mt-2 text-xl font-bold text-gray-900">
              Simple unit-based monthly pricing
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              Customers subscribe according to the number of units they need to manage. The applicable rate is determined automatically by their subscription package.
            </p>

          </div>

          <div className="flex shrink-0 items-center gap-3">

            <div className="rounded-xl bg-white px-4 py-3 text-center shadow-sm">

              <p className="text-lg font-bold text-gray-900">
                50
              </p>

              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                Basic
              </p>

            </div>

            <div className="rounded-xl bg-white px-4 py-3 text-center shadow-sm">

              <p className="text-lg font-bold text-gray-900">
                40
              </p>

              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                Growth
              </p>

            </div>

            <div className="rounded-xl bg-white px-4 py-3 text-center shadow-sm">

              <p className="text-lg font-bold text-gray-900">
                30
              </p>

              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                Professional
              </p>

            </div>

          </div>

        </div>

      </Card>

    </div>
  );
}