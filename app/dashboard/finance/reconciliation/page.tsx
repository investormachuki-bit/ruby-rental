"use client";

import AppShell from "@/components/layout/AppShell";
import PageContainer from "@/components/ui/PageContainer";
import PageHeader from "@/components/ui/PageHeader";
import FinanceNavigation from "@/components/finance/FinanceNavigation";

export default function FinanceReconciliationPage() {
  return (
    <AppShell>
      <PageContainer>
        <PageHeader
          title="Reconciliation"
          description="Review invoice and payment allocations."
        />

        <FinanceNavigation />

      </PageContainer>
    </AppShell>
  );
}
