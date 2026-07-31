"use client";

import AppShell from "@/components/layout/AppShell";
import PageContainer from "@/components/ui/PageContainer";
import PageHeader from "@/components/ui/PageHeader";
import Section from "@/components/ui/Section";

import FinanceNavigation from "@/components/finance/FinanceNavigation";
import ReconciliationWorkspace from "@/components/finance/reconciliation/ReconciliationWorkspace";

export default function FinanceReconciliationPage() {
  return (
    <AppShell>
      <PageContainer>

        <PageHeader
          title="Financial Reconciliation"
          description="Import statements, match transactions and reconcile payments."
        />

        <FinanceNavigation />

        <Section>

          <ReconciliationWorkspace />

        </Section>

      </PageContainer>
    </AppShell>
  );
}
