"use client";

import { useEffect, useState } from "react";

import AppShell from "@/components/layout/AppShell";
import PageContainer from "@/components/ui/PageContainer";
import PageHeader from "@/components/ui/PageHeader";
import Section from "@/components/ui/Section";

import FinanceKPICards from "@/components/finance/FinanceKPICards";
import RevenueChartCard from "@/components/finance/RevenueChartCard";
import RecentPaymentsCard from "@/components/finance/RecentPaymentsCard";
import OutstandingInvoicesCard from "@/components/finance/OutstandingInvoicesCard";
import QuickActionsCard from "@/components/finance/QuickActionsCard";

import {
  getFinanceDashboard,
  type FinanceDashboardData,
} from "@/services/finance/getFinanceDashboard";

export default function FinanceDashboardPage() {
  const [dashboard, setDashboard] =
    useState<FinanceDashboardData | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);

      const data =
        await getFinanceDashboard();

      setDashboard(data);

    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>

      <PageContainer>

        <PageHeader
          title="Finance Dashboard"
          description="Monitor revenue, collections, invoices and overall financial performance."
        />

        <Section>

          <FinanceKPICards
            revenueThisMonth={
              dashboard?.revenueThisMonth ?? 0
            }
            outstandingRent={
              dashboard?.outstandingRent ?? 0
            }
            collectionsToday={
              dashboard?.collectionsToday ?? 0
            }
            collectionRate={
              dashboard?.collectionRate ?? 0
            }
          />

        </Section>

        <Section>

          <RevenueChartCard
            loading={loading}
            data={dashboard?.revenueTrend ?? []}
          />

        </Section>

        <Section>

          <div className="grid gap-6 lg:grid-cols-2">

            <RecentPaymentsCard
              loading={loading}
              payments={
                dashboard?.recentPayments ?? []
              }
            />

            <OutstandingInvoicesCard
              loading={loading}
              invoices={
                dashboard?.outstandingInvoices ?? []
              }
            />

          </div>

        </Section>

        <Section>

          <QuickActionsCard />

        </Section>

      </PageContainer>

    </AppShell>
  );
}
