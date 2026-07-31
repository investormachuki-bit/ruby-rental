"use client";

import AppShell from "@/components/layout/AppShell";
import PageContainer from "@/components/ui/PageContainer";
import PageHeader from "@/components/ui/PageHeader";
import FinanceNavigation from "@/components/finance/FinanceNavigation";

export default function FinanceReportsPage() {
  return (
    <AppShell>
      <PageContainer>
        <PageHeader
          title="Finance Reports"
          description="Financial analytics and reporting."
        />

        <FinanceNavigation />

      </PageContainer>
    </AppShell>
  );
}
