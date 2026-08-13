"use client";

import { useEffect, useState } from "react";

import {
  Package,
  Plus,
  Edit2,
  Power,
} from "lucide-react";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

import { supabase } from "@/lib/supabase";

type SubscriptionPlan = {
  id: string;
  name: string;
  description: string | null;
  min_units: number;
  max_units: number | null;
  price_per_unit: number;
  currency: string;
  is_active: boolean;
};

export default function AdminPackagesPage() {

  const [plans, setPlans] =
    useState<SubscriptionPlan[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  async function loadPlans() {

    setLoading(true);
    setError(null);

    const {
      data,
      error,
    } = await supabase
      .from("subscription_plans")
      .select("*")
      .order("min_units", {
        ascending: true,
      });

    if (error) {

      console.error(
        "Failed to load subscription plans:",
        error
      );

      setError(
        "Unable to load subscription packages."
      );

      setPlans([]);

    } else {

      setPlans(
        (data ?? []) as SubscriptionPlan[]
      );

    }

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

  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

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
            Manage the unit-based pricing available to Ruby Rental customers.
          </p>

        </div>

        <Button
          onClick={() => {
            alert(
              "Package creation will be added after the package list is confirmed."
            );
          }}
        >
          <Plus
            size={18}
            className="mr-2"
          />

          New Package
        </Button>

      </div>

      {/* Error */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Pricing explanation */}

      <Card className="border-[#D4AF37]/20 bg-gradient-to-r from-white to-[#D4AF37]/5">

        <div className="grid gap-6 lg:grid-cols-3">

          <div>

            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#B8941F]">
              Basic
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
              KSh 50
            </p>

            <p className="text-sm text-gray-500">
              per subscribed unit / month
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
              per subscribed unit / month
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
              per subscribed unit / month
            </p>

          </div>

        </div>

      </Card>

      {/* Plans */}

      <div className="grid gap-5 lg:grid-cols-3">

        {loading ? (

          <Card className="lg:col-span-3">

            <div className="flex min-h-40 items-center justify-center">

              <p className="text-sm text-gray-500">
                Loading packages...
              </p>

            </div>

          </Card>

        ) : plans.length === 0 ? (

          <Card className="lg:col-span-3">

            <div className="flex min-h-40 items-center justify-center">

              <p className="text-sm text-gray-500">
                No subscription packages found.
              </p>

            </div>

          </Card>

        ) : (

          plans.map((plan) => (

            <Card
              key={plan.id}
              className="relative overflow-hidden"
            >

              <div
                className={`absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full ${
                  plan.is_active
                    ? "bg-[#D4AF37]/10"
                    : "bg-gray-100"
                }`}
              />

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

                <p className="mt-3 min-h-10 text-sm leading-5 text-gray-500">
                  {plan.description ||
                    "Unit-based Ruby Rental subscription."}
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
                      Rate
                    </p>

                    <p className="mt-1 text-2xl font-bold text-gray-900">
                      {plan.currency === "KES"
                        ? "KSh"
                        : plan.currency}{" "}
                      {Number(
                        plan.price_per_unit
                      ).toLocaleString()}
                    </p>

                    <p className="text-xs text-gray-500">
                      per unit / month
                    </p>

                  </div>

                </div>

                <div className="mt-5 flex gap-2">

                  <Button
                    variant="ghost"
                    className="flex-1"
                    onClick={() => {
                      alert(
                        "Package editing will be connected next."
                      );
                    }}
                  >
                    <Edit2
                      size={16}
                      className="mr-2"
                    />

                    Edit
                  </Button>

                  <Button
                    variant="ghost"
                    className="min-w-0 px-3"
                    onClick={() => {
                      alert(
                        "Package status management will be connected next."
                      );
                    }}
                    title={
                      plan.is_active
                        ? "Deactivate"
                        : "Activate"
                    }
                  >
                    <Power size={16} />
                  </Button>

                </div>

              </div>

            </Card>

          ))

        )}

      </div>

    </div>
  );
}