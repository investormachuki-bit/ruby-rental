"use client";

import AppShell from "@/components/layout/AppShell";
import Breadcrumb from "@/components/common/Breadcrumb";
import PageContainer from "@/components/ui/PageContainer";
import PageHeader from "@/components/ui/PageHeader";

import ManualInvoicePage from "@/components/invoices/ManualInvoicePage";

export default function Page() {
  return (
    <AppShell>
      <PageContainer>

        <Breadcrumb
          items={[
            {
              label: "Dashboard",
              href: "/",
            },
            {
              label: "Invoices",
              href: "/invoices",
            },
            {
              label: "Generate Invoice",
            },
          ]}
        />

        <PageHeader
          title="Generate Invoice"
          description="Generate an invoice for a single active lease."
        />

        <ManualInvoicePage />

      </PageContainer>
    </AppShell>
  );
}
