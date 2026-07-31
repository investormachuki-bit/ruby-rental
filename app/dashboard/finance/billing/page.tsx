"use client";

import AppShell from "@/components/layout/AppShell";
import PageContainer from "@/components/ui/PageContainer";
import PageHeader from "@/components/ui/PageHeader";
import Section from "@/components/ui/Section";

import FinanceNavigation from "@/components/finance/FinanceNavigation";
import BillingManager from "@/components/finance/billing/BillingManager";

export default function FinanceBillingPage() {
  return (
    <AppShell>
      <PageContainer>

        <PageHeader
          title="Monthly Billing"
          description="Generate monthly rent and recurring utility invoices."
        />

        <FinanceNavigation />

        <Section>

          <BillingManager />

        </Section>

      </PageContainer>
    </AppShell>
  );
}
