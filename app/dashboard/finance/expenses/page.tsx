"use client";

import AppShell from "@/components/layout/AppShell";
import PageContainer from "@/components/ui/PageContainer";
import PageHeader from "@/components/ui/PageHeader";
import Section from "@/components/ui/Section";

import FinanceNavigation from "@/components/finance/FinanceNavigation";

import ExpensesContent from "@/components/expenses/content/ExpensesContent";

export default function FinanceExpensesPage() {
  return (
    <AppShell>
      <PageContainer>

        <PageHeader
          title="Expenses"
          description="Track operational expenses and business spending."
        />

        <FinanceNavigation />

        <Section>

          <ExpensesContent />

        </Section>

      </PageContainer>
    </AppShell>
  );
}
