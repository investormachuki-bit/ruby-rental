"use client";

import AppShell from "@/components/layout/AppShell";
import PageContainer from "@/components/ui/PageContainer";
import PageHeader from "@/components/ui/PageHeader";
import Section from "@/components/ui/Section";

import FinanceNavigation from "@/components/finance/FinanceNavigation";
import FinanceReportsDashboard from "@/components/finance/FinanceReportsDashboard";

export default function FinanceReportsPage() {
  return (
    <AppShell>
      <PageContainer>

        <PageHeader
          title="Finance Reports"
          description="Revenue, collections, outstanding balances and financial analysis."
        />

        <FinanceNavigation />

        <Section>
          <FinanceReportsDashboard />
        </Section>

      </PageContainer>
    </AppShell>
  );
}
