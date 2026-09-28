"use client";

import AppShell from "@/components/layout/AppShell";
import Breadcrumb from "@/components/common/Breadcrumb";
import PageContainer from "@/components/ui/PageContainer";
import PageHeader from "@/components/ui/PageHeader";
import Section from "@/components/ui/Section";

import ReconciliationWorkspace from "@/components/finance/reconciliation/ReconciliationWorkspace";

export default function FinanceReconciliationPage() {
  return (
    <AppShell>
      <PageContainer>
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "/" },
            { label: "Reconciliation" },
          ]}
        />

        <PageHeader
          title="Financial Reconciliation"
          description="Import statements, match transactions and reconcile payments."
        />

        <Section>
          <ReconciliationWorkspace />
        </Section>
      </PageContainer>
    </AppShell>
  );
}
