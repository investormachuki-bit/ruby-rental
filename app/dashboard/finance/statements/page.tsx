"use client";

import AppShell from "@/components/layout/AppShell";
import PageContainer from "@/components/ui/PageContainer";
import PageHeader from "@/components/ui/PageHeader";
import Section from "@/components/ui/Section";

import FinanceNavigation from "@/components/finance/FinanceNavigation";
import StatementsDashboard from "@/components/finance/StatementsDashboard";

export default function StatementsPage() {
  return (
    <AppShell>
      <PageContainer>

        <PageHeader
          title="Statements"
          description="Generate tenant, property and account statements."
        />

        <FinanceNavigation />

        <Section>
          <StatementsDashboard />
        </Section>

      </PageContainer>
    </AppShell>
  );
}
