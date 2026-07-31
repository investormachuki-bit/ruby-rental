"use client";

import AppShell from "@/components/layout/AppShell";
import PageContainer from "@/components/ui/PageContainer";
import PageHeader from "@/components/ui/PageHeader";
import FinanceNavigation from "@/components/finance/FinanceNavigation";

export default function FinanceBillingPage() {
  return (
    <AppShell>
      <PageContainer>
        <PageHeader
          title="Monthly Billing"
          description="Generate monthly rent and utility invoices."
        />

        <FinanceNavigation />

      </PageContainer>
    </AppShell>
  );
}
