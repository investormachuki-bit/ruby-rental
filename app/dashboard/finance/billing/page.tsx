"use client";

import AppShell from "@/components/layout/AppShell";
import Breadcrumb from "@/components/common/Breadcrumb";
import PageContainer from "@/components/ui/PageContainer";
import PageHeader from "@/components/ui/PageHeader";
import Section from "@/components/ui/Section";

import BillingManager from "@/components/finance/billing/BillingManager";

export default function FinanceBillingPage() {
  return (
    <AppShell>
      <PageContainer>
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "/" },
            { label: "Billing" },
          ]}
        />

        <PageHeader
          title="Monthly Billing"
          description="Generate monthly rent and recurring utility invoices."
        />

        <Section>
          <BillingManager />
        </Section>
      </PageContainer>
    </AppShell>
  );
}
