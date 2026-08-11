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
import Button from "@/components/ui/Button";

import { useBranding } from "@/contexts/BrandingContext";
import { getDashboardStats } from "@/services/dashboard/getDashboardStats";
import RubyAICard from "@/components/dashboard/RubyAICard";

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
  const {
    branding,
  } = useBranding();

  const whiteLabelEnabled =
    branding?.enable_white_label === true;

  const accentColor =
    whiteLabelEnabled &&
    branding?.accent_color
      ? branding.accent_color
      : "#D4AF37";

  const primaryColor =
    whiteLabelEnabled &&
    branding?.primary_color
      ? branding.primary_color
      : "#0F0F10";

  const companyName =
    whiteLabelEnabled &&
    branding?.company_name
      ? branding.company_name
      : "Ruby Rental";

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

  const health =
    stats.occupancyRate >= 90
      ? "Excellent"
      : stats.occupancyRate >= 75
      ? "Good"
      : "Needs Attention";

  const brandVariable = {
    "--brand-accent": accentColor,
  } as React.CSSProperties;

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
          description={`Welcome back to ${companyName}.`}
        >
          <Button
            variant="primary"
            onClick={loadDashboard}
          >
            Refresh
          </Button>
        </PageHeader>

        <RubyAICard />

        <Section>
          {/* KPI Cards */}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">

            <StatCard
              title="Properties"
              value={stats.totalProperties}
              subtitle="Registered properties"
              icon={
                <Building2
                  className="h-6 w-6"
                  style={{
                    color: accentColor,
                  }}
                />
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
                <DollarSign
                  className="h-6 w-6"
                  style={{
                    color: accentColor,
                  }}
                />
              }
              valueClassName="text-[var(--brand-accent)]"
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
              value={health}
              subtitle="Based on occupancy"
              icon={
                <BarChart3
                  className="h-6 w-6"
                  style={{
                    color: accentColor,
                  }}
                />
              }
            />

          </div>
        </Section>

        {/* Quick Actions */}

        <Section
          title="Quick Actions"
          description="Frequently used shortcuts."
        >
          
         <div
  className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4"
  style={brandVariable}
>
  <Link href="/properties">
    <Card className="cursor-pointer p-6 transition-all duration-200 hover:-translate-y-1 hover:border-[var(--brand-accent)] hover:shadow-lg">
      <Building2
        className="h-10 w-10"
        style={{
          color: accentColor,
        }}
      />

      <h4 className="mt-5 text-lg font-semibold">
        Properties
      </h4>

      <p className="mt-2 text-sm text-gray-500">
        Manage all your rental properties.
      </p>
    </Card>
  </Link>

  <Link href="/units">
    <Card className="cursor-pointer p-6 transition-all duration-200 hover:-translate-y-1 hover:border-[var(--brand-accent)] hover:shadow-lg">
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
    <Card className="cursor-pointer p-6 transition-all duration-200 hover:-translate-y-1 hover:border-[var(--brand-accent)] hover:shadow-lg">
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
    <Card className="cursor-pointer p-6 transition-all duration-200 hover:-translate-y-1 hover:border-[var(--brand-accent)] hover:shadow-lg">
      <BarChart3
        className="h-10 w-10"
        style={{
          color: accentColor,
        }}
      />

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