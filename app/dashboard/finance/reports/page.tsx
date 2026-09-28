"use client";

import AppShell from "@/components/layout/AppShell";
import Breadcrumb from "@/components/common/Breadcrumb";
import PageContainer from "@/components/ui/PageContainer";
import PageHeader from "@/components/ui/PageHeader";
import Section from "@/components/ui/Section";

import FinanceReportsDashboard from "@/components/finance/FinanceReportsDashboard";

export default function FinanceReportsPage() {
  return (
    <AppShell>
      <PageContainer>
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "/" },
            { label: "Reports" },
          ]}
        />

        <PageHeader
          title="Finance Reports"
          description="Revenue, collections, outstanding balances and financial analysis."
        />

        <Section>
          <FinanceReportsDashboard />
        </Section>
      </PageContainer>
    </AppShell>
  );
}
