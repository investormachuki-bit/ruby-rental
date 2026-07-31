"use client";

import AppShell from "@/components/layout/AppShell";
import PageContainer from "@/components/ui/PageContainer";
import PageHeader from "@/components/ui/PageHeader";
import Section from "@/components/ui/Section";

import FinanceNavigation from "@/components/finance/FinanceNavigation";
import ExpensesDashboard from "@/components/finance/ExpensesDashboard";

export default function ExpensesPage() {
  return (
    <AppShell>
      <PageContainer>

        <PageHeader
          title="Expenses"
          description="Track operational expenses, suppliers and recurring costs."
        />

        <FinanceNavigation />

        <Section>
          <ExpensesDashboard />
        </Section>

      </PageContainer>
    </AppShell>
  );
}
