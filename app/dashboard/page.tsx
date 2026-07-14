"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  Building2,
  Home,
  Users,
  DollarSign,
  Percent,
  House,
  BarChart3,
} from "lucide-react";

import Breadcrumb from "@/components/common/Breadcrumb";

import Card from "@/components/ui/Card";
import Loading from "@/components/ui/Loading";
import PageHeader from "@/components/ui/PageHeader";
import StatCard from "@/components/ui/StatCard";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";

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

  if (loading) {
    return (
      <Loading
        title="Loading Dashboard"
        description="Preparing your workspace..."
      />
    );
  }

  return (
    <div className="space-y-8">

      <Breadcrumb
        items={[
          {
            label: "Dashboard",
          },
        ]}
      />

      <PageHeader
        title="Dashboard"
        description="Welcome back to Ruby Rental."
      >

        <Button
          onClick={() =>
            loadDashboard()
          }
        >
          Refresh
        </Button>

      </PageHeader>

            {/* KPI Cards */}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Properties"
          value={stats.totalProperties}
          subtitle="Registered properties"
          icon={
            <Building2 className="h-6 w-6 text-black" />
          }
        />

        <StatCard
          title="Units"
          value={stats.totalUnits}
          subtitle="Rental units"
          icon={
            <Home className="h-6 w-6 text-black" />
          }
        />

        <StatCard
          title="Occupants"
          value={stats.totalOccupants}
          subtitle="Current occupants"
          icon={
            <Users className="h-6 w-6 text-black" />
          }
        />

        <StatCard
          title="Expected Rent"
          value={`KSh ${stats.expectedMonthlyRent.toLocaleString()}`}
          subtitle="Monthly income"
          icon={
            <DollarSign className="h-6 w-6 text-black" />
          }
        />

        <StatCard
          title="Occupied Units"
          value={stats.occupiedUnits}
          subtitle={`${stats.occupancyRate}% occupancy`}
          icon={
            <House className="h-6 w-6 text-green-600" />
          }
          valueClassName="text-green-600"
        />

        <StatCard
          title="Vacant Units"
          value={stats.vacantUnits}
          subtitle="Available for leasing"
          icon={
            <Home className="h-6 w-6 text-amber-500" />
          }
          valueClassName="text-amber-500"
        />

        <StatCard
          title="Occupancy Rate"
          value={`${stats.occupancyRate}%`}
          subtitle="Portfolio occupancy"
          icon={
            <Percent className="h-6 w-6 text-blue-600" />
          }
          valueClassName="text-blue-600"
        />

        <StatCard
          title="Portfolio Health"
          value={
            stats.occupancyRate >= 90
              ? "Excellent"
              : stats.occupancyRate >= 75
              ? "Good"
              : "Needs Attention"
          }
          subtitle="Based on occupancy"
          icon={
            <BarChart3 className="h-6 w-6 text-black" />
          }
        />

      </div>

            {/* Executive Summary */}

      <div className="grid gap-6 lg:grid-cols-2">

        <Card>

          <h3 className="text-xl font-semibold">
            Portfolio Summary
          </h3>

          <div className="mt-6 space-y-5">

            <div className="flex items-center justify-between border-b border-gray-100 pb-3">

              <span className="text-gray-500">
                Properties
              </span>

              <strong className="text-lg">
                {stats.totalProperties}
              </strong>

            </div>

            <div className="flex items-center justify-between border-b border-gray-100 pb-3">

              <span className="text-gray-500">
                Units
              </span>

              <strong className="text-lg">
                {stats.totalUnits}
              </strong>

            </div>

            <div className="flex items-center justify-between border-b border-gray-100 pb-3">

              <span className="text-gray-500">
                Occupants
              </span>

              <strong className="text-lg">
                {stats.totalOccupants}
              </strong>

            </div>

            <div className="flex items-center justify-between border-b border-gray-100 pb-3">

              <span className="text-gray-500">
                Occupied Units
              </span>

              <strong className="text-lg text-green-600">
                {stats.occupiedUnits}
              </strong>

            </div>

            <div className="flex items-center justify-between border-b border-gray-100 pb-3">

              <span className="text-gray-500">
                Vacant Units
              </span>

              <strong className="text-lg text-amber-500">
                {stats.vacantUnits}
              </strong>

            </div>

            <div className="flex items-center justify-between">

              <span className="text-gray-500">
                Expected Monthly Rent
              </span>

              <strong className="text-lg">
                KSh{" "}
                {stats.expectedMonthlyRent.toLocaleString()}
              </strong>

            </div>

          </div>

        </Card>

        <Card>

          <h3 className="text-xl font-semibold">
            Recent Activity
          </h3>

          <div className="mt-6">

            <EmptyState
              title="No Recent Activity"
              description="Payments, leases, maintenance requests and utility readings will appear here as you continue using Ruby Rental."
            />

          </div>

        </Card>

      </div>

            {/* Quick Actions */}

      <Card>

        <div className="mb-6 flex items-center justify-between">

          <div>

            <h3 className="text-xl font-semibold">
              Quick Actions
            </h3>

            <p className="mt-1 text-gray-500">
              Jump to the most frequently used modules.
            </p>

          </div>

        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

          <Link href="/properties">

            <Card className="cursor-pointer p-5 hover:border-black hover:shadow-md">

              <Building2 className="h-10 w-10 text-black" />

              <h4 className="mt-5 text-lg font-semibold">
                Properties
              </h4>

              <p className="mt-2 text-sm text-gray-500">
                Manage all your rental properties.
              </p>

            </Card>

          </Link>

          <Link href="/units">

            <Card className="cursor-pointer p-5 hover:border-black hover:shadow-md">

              <Home className="h-10 w-10 text-black" />

              <h4 className="mt-5 text-lg font-semibold">
                Units
              </h4>

              <p className="mt-2 text-sm text-gray-500">
                View and manage rental units.
              </p>

            </Card>

          </Link>

          <Link href="/occupants">

            <Card className="cursor-pointer p-5 hover:border-black hover:shadow-md">

              <Users className="h-10 w-10 text-black" />

              <h4 className="mt-5 text-lg font-semibold">
                Occupants
              </h4>

              <p className="mt-2 text-sm text-gray-500">
                Manage tenants and occupants.
              </p>

            </Card>

          </Link>

          <Link href="/reports">

            <Card className="cursor-pointer p-5 hover:border-black hover:shadow-md">

              <BarChart3 className="h-10 w-10 text-black" />

              <h4 className="mt-5 text-lg font-semibold">
                Reports
              </h4>

              <p className="mt-2 text-sm text-gray-500">
                View portfolio reports and insights.
              </p>

            </Card>

          </Link>

        </div>

      </Card>

    </div>
  );
}
