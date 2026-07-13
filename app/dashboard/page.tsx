"use client";

import { useEffect, useState } from "react";

import AppShell from "@/components/layout/AppShell";
import Breadcrumb from "@/components/common/Breadcrumb";

import { getDashboardStats } from "@/services/dashboard/getDashboardStats";

type DashboardStats = {
  totalProperties: number;
  totalUnits: number;
  occupiedUnits: number;
  vacantUnits: number;
  totalOccupants: number;
  expectedMonthlyRent: number;
  occupancyRate: number;
};

export default function DashboardPage() {
  const [loading, setLoading] =
    useState(true);

  const [stats, setStats] =
    useState<DashboardStats>({
      totalProperties: 0,
      totalUnits: 0,
      occupiedUnits: 0,
      vacantUnits: 0,
      totalOccupants: 0,
      expectedMonthlyRent: 0,
      occupancyRate: 0,
    });

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);

      const data =
        await getDashboardStats();

      setStats(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>

      <main className="space-y-8">

        <Breadcrumb
          items={[
            {
              label: "Dashboard",
            },
          ]}
        />

        <div>

          <h1 className="text-4xl font-bold">
            Dashboard
          </h1>

          <p className="mt-2 text-gray-500">
            Welcome back to Ruby Rental.
          </p>

        </div>
                {loading ? (

          <div className="rounded-2xl border bg-white p-10 text-center shadow-sm">

            <p className="text-gray-500">
              Loading dashboard...
            </p>

          </div>

        ) : (

          <>

            {/* KPI Cards */}

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">

              <div className="rounded-2xl border bg-white p-5 shadow-sm">

                <p className="text-sm text-gray-500">
                  Properties
                </p>

                <h2 className="mt-2 text-3xl font-bold">
                  {stats.totalProperties}
                </h2>

              </div>

              <div className="rounded-2xl border bg-white p-5 shadow-sm">

                <p className="text-sm text-gray-500">
                  Units
                </p>

                <h2 className="mt-2 text-3xl font-bold">
                  {stats.totalUnits}
                </h2>

              </div>

              <div className="rounded-2xl border bg-white p-5 shadow-sm">

                <p className="text-sm text-gray-500">
                  Occupants
                </p>

                <h2 className="mt-2 text-3xl font-bold">
                  {stats.totalOccupants}
                </h2>

              </div>

              <div className="rounded-2xl border bg-white p-5 shadow-sm">

                <p className="text-sm text-gray-500">
                  Expected Monthly Rent
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  KSh{" "}
                  {stats.expectedMonthlyRent.toLocaleString()}
                </h2>

              </div>

              <div className="rounded-2xl border bg-white p-5 shadow-sm">

                <p className="text-sm text-gray-500">
                  Vacant Units
                </p>

                <h2 className="mt-2 text-3xl font-bold text-orange-500">
                  {stats.vacantUnits}
                </h2>

              </div>

              <div className="rounded-2xl border bg-white p-5 shadow-sm">

                <div className="flex items-center justify-between">

                  <p className="text-sm text-gray-500">
                    Occupancy
                  </p>

                  <span className="font-semibold">
                    {stats.occupancyRate}%
                  </span>

                </div>

                <div className="mt-4 h-3 overflow-hidden rounded-full bg-gray-200">

                  <div
                    className="h-full rounded-full bg-green-600 transition-all"
                    style={{
                      width: `${stats.occupancyRate}%`,
                    }}
                  />

                </div>

                <p className="mt-3 text-sm text-gray-500">
                  {stats.occupiedUnits} of{" "}
                  {stats.totalUnits} units occupied
                </p>

              </div>

            </div>

            {/* Executive Summary */}

            <div className="grid gap-6 lg:grid-cols-2">

              <div className="rounded-2xl border bg-white p-6 shadow-sm">

                <h3 className="text-xl font-semibold">
                  Portfolio Summary
                </h3>

                <div className="mt-6 space-y-4">

                  <div className="flex items-center justify-between">

                    <span className="text-gray-500">
                      Properties
                    </span>

                    <strong>
                      {stats.totalProperties}
                    </strong>

                  </div>

                  <div className="flex items-center justify-between">

                    <span className="text-gray-500">
                      Units
                    </span>

                    <strong>
                      {stats.totalUnits}
                    </strong>

                  </div>

                  <div className="flex items-center justify-between">

                    <span className="text-gray-500">
                      Occupants
                    </span>

                    <strong>
                      {stats.totalOccupants}
                    </strong>

                  </div>

                  <div className="flex items-center justify-between">

                    <span className="text-gray-500">
                      Expected Monthly Rent
                    </span>

                    <strong>
                      KSh{" "}
                      {stats.expectedMonthlyRent.toLocaleString()}
                    </strong>

                  </div>

                </div>

              </div>
                            <div className="rounded-2xl border bg-white p-6 shadow-sm">

                <h3 className="text-xl font-semibold">
                  Recent Activity
                </h3>

                <div className="mt-6 rounded-xl border border-dashed p-10 text-center">

                  <p className="text-gray-500">
                    Recent payments, leases,
                    maintenance requests and
                    utility readings will appear
                    here.
                  </p>

                </div>

              </div>

            </div>

            {/* Quick Actions */}

            <div className="rounded-2xl border bg-white p-6 shadow-sm">

              <h3 className="mb-6 text-xl font-semibold">
                Quick Actions
              </h3>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                <a
                  href="/properties"
                  className="rounded-xl border p-5 transition hover:border-black hover:bg-gray-50"
                >

                  <h4 className="font-semibold">
                    🏢 Properties
                  </h4>

                  <p className="mt-2 text-sm text-gray-500">
                    Manage your properties.
                  </p>

                </a>

                <a
                  href="/units"
                  className="rounded-xl border p-5 transition hover:border-black hover:bg-gray-50"
                >

                  <h4 className="font-semibold">
                    🏠 Units
                  </h4>

                  <p className="mt-2 text-sm text-gray-500">
                    View all rental units.
                  </p>

                </a>

                <a
                  href="/occupants"
                  className="rounded-xl border p-5 transition hover:border-black hover:bg-gray-50"
                >

                  <h4 className="font-semibold">
                    👥 Occupants
                  </h4>

                  <p className="mt-2 text-sm text-gray-500">
                    Manage tenants and occupants.
                  </p>

                </a>

                <a
                  href="/reports"
                  className="rounded-xl border p-5 transition hover:border-black hover:bg-gray-50"
                >

                  <h4 className="font-semibold">
                    📊 Reports
                  </h4>

                  <p className="mt-2 text-sm text-gray-500">
                    View business reports.
                  </p>

                </a>

              </div>

            </div>

          </>

        )}

      </main>

    </AppShell>
  );
}
