"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  Mail,
  Phone,
  RefreshCw,
  Search,
  Users,
} from "lucide-react";

import Card from "@/components/ui/Card";
import StatCard from "@/components/ui/StatCard";
import { supabase } from "@/lib/supabase";

type Customer = {
  id: string;
  name: string;
  brand_name: string | null;
  email: string | null;
  phone: string | null;
  is_active: boolean;
  created_at: string;
};

type Subscription = {
  id: string;
  workspace_id: string;
  plan_id: string;
  subscribed_units: number;
  monthly_amount: number;
  currency: string;
  status: string;
  next_billing_date: string | null;
  plan: {
    name: string;
  } | null;
};

type CustomerRow = Customer & {
  subscription?: Subscription;
};

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<
    CustomerRow[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [error, setError] =
    useState<string | null>(null);

  async function loadCustomers() {
    setLoading(true);
    setError(null);

    const [
      customersResult,
      subscriptionsResult,
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
        .order("created_at", {
          ascending: false,
        }),

      supabase
        .from("subscriptions")
        .select(`
          id,
          workspace_id,
          plan_id,
          subscribed_units,
          monthly_amount,
          currency,
          status,
          next_billing_date,
          plan:subscription_plans (
            name
          )
        `),
    ]);

    if (customersResult.error) {
      console.error(
        "Failed to load customers:",
        customersResult.error
      );

      setError(
        customersResult.error.message
      );

      setCustomers([]);
      setLoading(false);

      return;
    }

    if (subscriptionsResult.error) {
      console.error(
        "Failed to load subscriptions:",
        subscriptionsResult.error
      );

      setError(
        subscriptionsResult.error.message
      );
    }

    const subscriptionMap =
      new Map<string, Subscription>();

    for (
      const subscription of
        subscriptionsResult.data ?? []
    ) {
      /*
       * Supabase can return the related
       * subscription plan as an array.
       * Normalize it to a single object.
       */

      const rawPlan =
        subscription.plan;

      const plan = Array.isArray(rawPlan)
        ? rawPlan[0]
        : rawPlan;

      subscriptionMap.set(
        subscription.workspace_id,
        {
          id: subscription.id,

          workspace_id:
            subscription.workspace_id,

          plan_id:
            subscription.plan_id,

          subscribed_units:
            Number(
              subscription.subscribed_units
            ),

          monthly_amount:
            Number(
              subscription.monthly_amount
            ),

          currency:
            subscription.currency,

          status:
            subscription.status,

          next_billing_date:
            subscription.next_billing_date,

          plan: plan
            ? {
                name: plan.name,
              }
            : null,
        }
      );
    }

    const rows: CustomerRow[] =
      (customersResult.data ?? []).map(
        (customer) => ({
          ...customer,

          subscription:
            subscriptionMap.get(
              customer.id
            ),
        })
      );

    setCustomers(rows);
    setLoading(false);
  }

  useEffect(() => {
    loadCustomers();
  }, []);

  const filteredCustomers =
    useMemo(() => {
      const query =
        search.trim().toLowerCase();

      if (!query) {
        return customers;
      }

      return customers.filter(
        (customer) => {
          const values = [
            customer.name,
            customer.brand_name ?? "",
            customer.email ?? "",
            customer.phone ?? "",
            customer.subscription?.plan
              ?.name ?? "",
          ];

          return values.some(
            (value) =>
              value
                .toLowerCase()
                .includes(query)
          );
        }
      );
    }, [customers, search]);

  const activeCustomers =
    customers.filter(
      (customer) =>
        customer.is_active
    ).length;

  const customersWithoutSubscription =
    customers.filter(
      (customer) =>
        !customer.subscription
    ).length;

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

  function statusClass(
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
      case "Expired":
        return "bg-gray-100 text-gray-600";

      default:
        return "bg-gray-100 text-gray-500";
    }
  }

  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <div className="mb-2 flex items-center gap-2">

            <Users
              size={17}
              className="text-[#B8941F]"
            />

            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
              Platform
            </span>

          </div>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Customers
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            View Ruby Rental workspaces and their subscription status.
          </p>

        </div>

        <button
          type="button"
          onClick={loadCustomers}
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

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">

        <StatCard
          title="Total Customers"
          value={customers.length}
          subtitle="Registered workspaces"
          icon={
            <Building2
              size={21}
              className="text-[#B8941F]"
            />
          }
        />

        <StatCard
          title="Active Customers"
          value={activeCustomers}
          subtitle="Active workspaces"
          icon={
            <Users
              size={21}
              className="text-[#B8941F]"
            />
          }
        />

        <StatCard
          title="Without Subscription"
          value={
            customersWithoutSubscription
          }
          subtitle="Awaiting subscription"
          icon={
            <Building2
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

      {/* Customer table */}

      <Card className="overflow-hidden p-0">

        <div className="border-b border-gray-200 p-5 sm:p-6">

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div>

              <h2 className="text-lg font-semibold text-gray-900">
                Ruby Rental Customers
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {filteredCustomers.length}{" "}
                customer
                {filteredCustomers.length ===
                1
                  ? ""
                  : "s"}{" "}
                shown
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
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search customers..."
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
                Loading customers...
              </p>

            </div>

          </div>

        ) : filteredCustomers.length ===
          0 ? (

          <div className="flex min-h-56 items-center justify-center px-6">

            <div className="text-center">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100">

                <Users
                  size={21}
                  className="text-gray-400"
                />

              </div>

              <h3 className="mt-4 font-semibold text-gray-900">
                {search
                  ? "No matching customers"
                  : "No customers yet"}
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                {search
                  ? "Try a different search."
                  : "Registered workspaces will appear here."}
              </p>

            </div>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full min-w-[950px]">

              <thead>

                <tr className="border-b border-gray-200 bg-gray-50/80">

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Customer
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Contact
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Package
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Units
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Monthly
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Status
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-gray-100">

                {filteredCustomers.map(
                  (customer) => {
                    const subscription =
                      customer.subscription;

                    return (
                      <tr
                        key={customer.id}
                        className="transition hover:bg-gray-50/70"
                      >

                        {/* Customer */}

                        <td className="px-6 py-5">

                          <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-sm font-bold text-gray-600">
                              {(
                                customer.brand_name ||
                                customer.name ||
                                "R"
                              )
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div className="min-w-0">

                              <p className="truncate font-semibold text-gray-900">
                                {customer.brand_name ||
                                  customer.name}
                              </p>

                              {customer.brand_name &&
                                customer.name && (
                                  <p className="truncate text-xs text-gray-400">
                                    {customer.name}
                                  </p>
                                )}

                            </div>

                          </div>

                        </td>

                        {/* Contact */}

                        <td className="px-6 py-5">

                          <div className="space-y-1">

                            {customer.email ? (
                              <div className="flex items-center gap-2 text-sm text-gray-600">

                                <Mail
                                  size={14}
                                  className="text-gray-400"
                                />

                                {customer.email}

                              </div>
                            ) : (
                              <span className="text-sm text-gray-400">
                                No email
                              </span>
                            )}

                            {customer.phone && (
                              <div className="flex items-center gap-2 text-xs text-gray-400">

                                <Phone
                                  size={13}
                                />

                                {customer.phone}

                              </div>
                            )}

                          </div>

                        </td>

                        {/* Package */}

                        <td className="px-6 py-5">

                          {subscription ? (
                            <span className="inline-flex rounded-lg bg-[#D4AF37]/10 px-3 py-1.5 text-sm font-semibold text-[#8A6D16]">
                              {subscription.plan
                                ?.name ||
                                "Unknown"}
                            </span>
                          ) : (
                            <span className="text-sm text-gray-400">
                              No subscription
                            </span>
                          )}

                        </td>

                        {/* Units */}

                        <td className="px-6 py-5">

                          {subscription ? (
                            <>
                              <p className="font-semibold text-gray-900">
                                {subscription.subscribed_units.toLocaleString()}
                              </p>

                              <p className="mt-1 text-xs text-gray-400">
                                subscribed units
                              </p>
                            </>
                          ) : (
                            <span className="text-sm text-gray-400">
                              —
                            </span>
                          )}

                        </td>

                        {/* Monthly */}

                        <td className="px-6 py-5">

                          {subscription ? (
                            <p className="font-bold text-gray-900">
                              {formatMoney(
                                Number(
                                  subscription.monthly_amount
                                ),
                                subscription.currency
                              )}
                            </p>
                          ) : (
                            <span className="text-sm text-gray-400">
                              —
                            </span>
                          )}

                        </td>

                        {/* Status */}

                        <td className="px-6 py-5">

                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                              subscription
                                ? statusClass(
                                    subscription.status
                                  )
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {subscription?.status ||
                              "No subscription"}
                          </span>

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