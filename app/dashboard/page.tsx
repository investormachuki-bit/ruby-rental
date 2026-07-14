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

import AppShell from "@/components/layout/AppShell";

import Breadcrumb from "@/components/common/Breadcrumb";

import PageContainer from "@/components/ui/PageContainer";
import Section from "@/components/ui/Section";
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
      <AppShell>

        <PageContainer>

          <Loading
            title="Loading Dashboard"
            description="Preparing your workspace..."
          />

        </PageContainer>

      </AppShell>
    );
  }

  return (
    <AppShell>

      <PageContainer>

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
            variant="primary"
            onClick={loadDashboard}
          >
            Refresh
          </Button>
        </PageHeader>

        <Section>

          {/* KPI Cards */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">

            <StatCard
              title="Properties"
              value={stats.totalProperties}
              subtitle="Registered properties"
              icon={
                <Building2 className="h-6 w-6 text-[#D4AF37]" />
              }
            />

            <StatCard
              title="Units"
              value={stats.totalUnits}
              subtitle="Rental units"
              icon={
                <Home className="h-6 w-6 text-sky-600" />
              }
            />

            <StatCard
              title="Occupants"
              value={stats.totalOccupants}
              subtitle="Current occupants"
              icon={
                <Users className="h-6 w-6 text-violet-600" />
              }
            />

            <StatCard
              title="Expected Rent"
              value={`KSh ${stats.expectedMonthlyRent.toLocaleString()}`}
              subtitle="Monthly income"
              icon={
                <DollarSign className="h-6 w-6 text-[#D4AF37]" />
              }
              valueClassName="text-[#D4AF37]"
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
                <BarChart3 className="h-6 w-6 text-[#D4AF37]" />
              }
            />

          </div>

        </Section>

        {/* Executive Summary */}
                <Section
          title="Executive Summary"
          description="Overview of your rental portfolio."
        >

          <div className="grid gap-6 lg:grid-cols-2">

            <Card>

              <h3 className="text-xl font-semibold text-gray-900">
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

                  <strong className="text-lg text-[#D4AF37]">
                    KSh{" "}
                    {stats.expectedMonthlyRent.toLocaleString()}
                  </strong>

                </div>

              </div>

            </Card>

            <Card>

              <h3 className="text-xl font-semibold text-gray-900">
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

        </Section>

        {/* Quick Actions */}
                <Section
          title="Quick Actions"
          description="Frequently used shortcuts."
        >

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

            <Link href="/properties">

              <Card className="cursor-pointer p-6 transition-all duration-200 hover:-translate-y-1 hover:border-[#D4AF37] hover:shadow-lg">

                <Building2 className="h-10 w-10 text-[#D4AF37]" />

                <h4 className="mt-5 text-lg font-semibold">
                  Properties
                </h4>

                <p className="mt-2 text-sm text-gray-500">
                  Manage all your rental properties.
                </p>

              </Card>

            </Link>

            <Link href="/units">

              <Card className="cursor-pointer p-6 transition-all duration-200 hover:-translate-y-1 hover:border-[#D4AF37] hover:shadow-lg">

                <Home className="h-10 w-10 text-sky-600" />

                <h4 className="mt-5 text-lg font-semibold">
                  Units
                </h4>

                <p className="mt-2 text-sm text-gray-500">
                  View and manage rental units.
                </p>

              </Card>

            </Link>

            <Link href="/occupants">

              <Card className="cursor-pointer p-6 transition-all duration-200 hover:-translate-y-1 hover:border-[#D4AF37] hover:shadow-lg">

                <Users className="h-10 w-10 text-violet-600" />

                <h4 className="mt-5 text-lg font-semibold">
                  Occupants
                </h4>

                <p className="mt-2 text-sm text-gray-500">
                  Manage tenants and occupants.
                </p>

              </Card>

            </Link>

            <Link href="/reports">

              <Card className="cursor-pointer p-6 transition-all duration-200 hover:-translate-y-1 hover:border-[#D4AF37] hover:shadow-lg">

                <BarChart3 className="h-10 w-10 text-[#D4AF37]" />

                <h4 className="mt-5 text-lg font-semibold">
                  Reports
                </h4>

                <p className="mt-2 text-sm text-gray-500">
                  View portfolio reports and insights.
                </p>

              </Card>

            </Link>

          </div>

        </Section>

      </PageContainer>

    </AppShell>
  );
}
