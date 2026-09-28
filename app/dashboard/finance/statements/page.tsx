"use client";

import AppShell from "@/components/layout/AppShell";
import Breadcrumb from "@/components/common/Breadcrumb";
import PageContainer from "@/components/ui/PageContainer";
import PageHeader from "@/components/ui/PageHeader";
import Section from "@/components/ui/Section";

import StatementsWorkspace from "@/components/finance/statements/StatementsWorkspace";

export default function StatementsPage() {
  return (
    <AppShell>
      <PageContainer>
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "/" },
            { label: "Statements" },
          ]}
        />

        <PageHeader
          title="Statements"
          description="Generate tenant, property and account statements."
        />

        <Section>
          <StatementsWorkspace />
        </Section>
      </PageContainer>
    </AppShell>
  );
}
