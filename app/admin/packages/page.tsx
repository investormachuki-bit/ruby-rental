"use client";

import { useEffect, useState } from "react";
import {
  Edit2,
  Package,
  RefreshCw,
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

  function formatUnits(
    plan: SubscriptionPlan
  ) {
    if (plan.max_units === null) {
      return `${plan.min_units}+ units`;
    }

    return `${plan.min_units}–${plan.max_units} units`;
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

      {/* Header */}

      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

        <div>

          <div className="mb-2 flex items-center gap-2">

            <Package
              size={17}
              className="text-[#B8941F]"
            />

            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
              Platform
            </span>

          </div>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Subscription Packages
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage Ruby Rental's unit-based monthly pricing.
          </p>

        </div>

        <button
          type="button"
          onClick={loadPlans}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:opacity-50"
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
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Pricing explanation */}

      <Card className="border-[#D4AF37]/20 bg-gradient-to-r from-white to-[#D4AF37]/5">

        <div className="grid gap-6 sm:grid-cols-3">

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#B8941F]">
              Basic
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
              KSh 50
            </p>

            <p className="text-sm text-gray-500">
              1–20 units
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#B8941F]">
              Growth
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
              KSh 40
            </p>

            <p className="text-sm text-gray-500">
              21–100 units
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#B8941F]">
              Professional
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
              KSh 30
            </p>

            <p className="text-sm text-gray-500">
              101+ units
            </p>
          </div>

        </div>

      </Card>

      {/* Packages */}

      {loading ? (

        <Card>

          <div className="flex min-h-48 items-center justify-center">

            <div className="text-center">

              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#D4AF37]" />

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
              className="relative overflow-hidden"
            >

              <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-[#D4AF37]/10" />

              <div className="relative">

                <div className="flex items-start justify-between">

                  <div>

                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">
                      Package
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-gray-900">
                      {plan.name}
                    </h2>

                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
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

                <p className="mt-3 min-h-10 text-sm text-gray-500">
                  {plan.description ||
                    "Unit-based monthly subscription."}
                </p>

                <div className="mt-6 rounded-2xl bg-gray-50 p-5">

                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Unit range
                  </p>

                  <p className="mt-1 text-lg font-bold text-gray-900">
                    {formatUnits(plan)}
                  </p>

                  <div className="mt-4 border-t border-gray-200 pt-4">

                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Rate per unit
                    </p>

                    <p className="mt-1 text-2xl font-bold text-gray-900">
                      KSh{" "}
                      {Number(
                        plan.price_per_unit
                      ).toLocaleString()}
                    </p>

                    <p className="text-xs text-gray-500">
                      per unit / month
                    </p>

                  </div>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    setEditingPlan({
                      ...plan,
                    })
                  }
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:border-[#D4AF37] hover:bg-gray-50"
                >
                  <Edit2 size={16} />

                  Edit Package
                </button>

              </div>

            </Card>

          ))}

        </div>

      )}

      {/* Edit modal */}

      {editingPlan && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">

          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">

              <div>

                <h2 className="text-lg font-bold text-gray-900">
                  Edit Package
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Update the package pricing and limits.
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setEditingPlan(null)
                }
                className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                <X size={20} />
              </button>

            </div>

            <div className="space-y-5 p-6">

              {/* Name */}

              <div>

                <label className="mb-2 block text-sm font-medium text-gray-700">
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

                <label className="mb-2 block text-sm font-medium text-gray-700">
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

              {/* Units */}

              <div className="grid grid-cols-2 gap-4">

                <div>

                  <label className="mb-2 block text-sm font-medium text-gray-700">
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

                  <label className="mb-2 block text-sm font-medium text-gray-700">
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

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Price per unit / month
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

              </div>

              {/* Active */}

              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 p-4">

                <div>

                  <p className="text-sm font-semibold text-gray-900">
                    Package active
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Inactive packages cannot be selected for new subscriptions.
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

            {/* Footer */}

            <div className="flex gap-3 border-t border-gray-200 px-6 py-5">

              <button
                type="button"
                onClick={() =>
                  setEditingPlan(null)
                }
                disabled={saving}
                className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={savePlan}
                disabled={saving}
                className="flex-1 rounded-xl bg-[#111111] px-4 py-3 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}