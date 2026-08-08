"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import AppShell from "@/components/layout/AppShell";
import Breadcrumb from "@/components/common/Breadcrumb";
import PageContainer from "@/components/ui/PageContainer";
import PageHeader from "@/components/ui/PageHeader";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import InvoiceFilters from "@/components/invoices/InvoiceFilters";
import InvoiceSummaryCards from "@/components/invoices/InvoiceSummaryCards";
import InvoicesList from "@/components/invoices/InvoicesList";
import { getInvoices } from "@/services/invoices/getInvoices";
import { downloadInvoicePdf } from "@/services/invoices/pdf/downloadInvoicePdf";
import { printInvoice } from "@/services/invoices/pdf/printInvoice";
import { cancelInvoice } from "@/services/invoices/cancelInvoice";
import type { InvoiceRowData } from "@/components/invoices/InvoiceRow";

type InvoiceSortField = "invoice_date" | "due_date" | "amount" | "balance";
type InvoiceSortDirection = "asc" | "desc";

export default function InvoicesPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<InvoiceRowData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [property, setProperty] = useState("All");
  const [tenant, setTenant] = useState("All");
  const [billingPeriod, setBillingPeriod] = useState("");
  const [page, setPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ field: InvoiceSortField; direction: InvoiceSortDirection }>({
    field: "due_date",
    direction: "asc",
  });

  async function loadInvoices() {
    try {
      setLoading(true);
      const data = await getInvoices();
      setInvoices(data as InvoiceRowData[]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadInvoices();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, status, property, tenant, billingPeriod]);

  
async function handleCancelInvoice(invoiceId: string) {
  const invoice = invoices.find(
    (item) => item.id === invoiceId
  );

  if (!invoice) {
    window.alert("Invoice not found.");
    return;
  }

  const normalizedStatus =
    String(invoice.status ?? "").trim().toLowerCase();

  if (normalizedStatus === "paid") {
    window.alert(
      "A paid invoice cannot be cancelled. Reverse the payment first."
    );
    return;
  }

  if (normalizedStatus === "cancelled") {
    window.alert("This invoice is already cancelled.");
    return;
  }

  if (Number(invoice.amount_paid ?? 0) > 0) {
    window.alert(
      "This invoice has payments allocated to it. Reverse or remove the payment allocation before cancelling the invoice."
    );
    return;
  }

  const confirmed = window.confirm(
    `Cancel invoice ${invoice.invoice_number}?\n\nThe invoice will remain in the system for audit purposes.`
  );

  if (!confirmed) return;

  const reason = window.prompt(
    "Enter the reason for cancelling this invoice:"
  );

  if (!reason?.trim()) {
    window.alert(
      "Cancellation cancelled. A reason is required."
    );
    return;
  }

  try {
    setLoading(true);

    await cancelInvoice(
      invoiceId,
      reason
    );

    window.alert(
      `Invoice ${invoice.invoice_number} has been cancelled successfully.`
    );

    await loadInvoices();
  } catch (error: any) {
    console.error(
      "CANCEL INVOICE ERROR",
      error
    );

    window.alert(
      error?.message ??
        "Failed to cancel invoice."
    );
  } finally {
    setLoading(false);
  }
}

const filteredInvoices = useMemo(() => {
    const keyword = search.toLowerCase();

    return invoices.filter((invoice) => {
      const matchesSearch =
        invoice.invoice_number.toLowerCase().includes(keyword) ||
        invoice.tenant_name.toLowerCase().includes(keyword) ||
        invoice.property_name.toLowerCase().includes(keyword) ||
        invoice.unit_number.toLowerCase().includes(keyword);

      const matchesStatus = status === "All" || invoice.status === status;
      const matchesProperty = property === "All" || invoice.property_name === property;
      const matchesTenant = tenant === "All" || invoice.tenant_name === tenant;
      const matchesBillingPeriod = !billingPeriod || invoice.billing_period === billingPeriod;

      return matchesSearch && matchesStatus && matchesProperty && matchesTenant && matchesBillingPeriod;
    });
  }, [invoices, search, status, property, tenant, billingPeriod]);

  const sortedInvoices = useMemo(() => {
    const list = [...filteredInvoices];
    list.sort((a, b) => {
      const getValue = (invoice: InvoiceRowData) => {
        switch (sortConfig.field) {
          case "invoice_date":
            return invoice.invoice_date || "";
          case "due_date":
            return invoice.due_date || "";
          case "amount":
            return invoice.amount;
          case "balance":
            return invoice.balance;
          default:
            return invoice.due_date || "";
        }
      };

      const left = getValue(a);
      const right = getValue(b);

      if (typeof left === "number" && typeof right === "number") {
        return sortConfig.direction === "asc" ? left - right : right - left;
      }

      const comparison = String(left).localeCompare(String(right));
      return sortConfig.direction === "asc" ? comparison : -comparison;
    });

    return list;
  }, [filteredInvoices, sortConfig]);

  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(sortedInvoices.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginatedInvoices = sortedInvoices.slice((safePage - 1) * pageSize, safePage * pageSize);

  const properties = useMemo(() => [...new Set(invoices.map((invoice) => invoice.property_name).filter(Boolean))], [invoices]);
  const tenants = useMemo(() => [...new Set(invoices.map((invoice) => invoice.tenant_name).filter(Boolean))], [invoices]);

  const totalAmount = sortedInvoices.reduce(
    (sum, invoice) => sum + Number(invoice.amount ?? 0),
    0
  );

  const paidAmount = sortedInvoices.reduce(
    (sum, invoice) => sum + Number(invoice.amount_paid ?? 0),
    0
  );

  const outstanding = sortedInvoices.reduce(
    (sum, invoice) => sum + Number(invoice.balance ?? 0),
    0
  );

  const overdueInvoices = sortedInvoices.filter(
    (invoice) => invoice.status === "Overdue"
  );

  const overdue = overdueInvoices.length;

  const overdueAmount = overdueInvoices.reduce(
    (sum, invoice) => sum + Number(invoice.balance ?? 0),
    0
  );

  return (
    <AppShell>
      <PageContainer>
        <Breadcrumb items={[{ label: "Dashboard", href: "/" }, { label: "Invoices" }]} />

        <PageHeader title="Invoices" description="Manage tenant billing, invoice generation, collections and statements.">
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => router.push("/dashboard/finance/billing")}>Monthly Billing</Button>
            <Button
  variant="primary"
  onClick={() =>
    router.push("/invoices/new")
  }
>
  Generate Invoice
</Button>
          </div>
        </PageHeader>

        <Section>
          <InvoiceSummaryCards
            totalAmount={totalAmount}
            paidAmount={paidAmount}
            outstanding={outstanding}
            overdue={overdue}
            overdueAmount={overdueAmount}
          />
        </Section>

        <Section>
          <div className="space-y-6">
            <InvoiceFilters
              search={search}
              status={status}
              property={property}
              tenant={tenant}
              billingPeriod={billingPeriod}
              properties={properties}
              tenants={tenants}
              onSearchChange={setSearch}
              onStatusChange={setStatus}
              onPropertyChange={setProperty}
              onTenantChange={setTenant}
              onBillingPeriodChange={setBillingPeriod}
              onReset={() => {
                setSearch("");
                setStatus("All");
                setProperty("All");
                setTenant("All");
                setBillingPeriod("");
              }}
            />

            <InvoicesList
              invoices={paginatedInvoices}
              loading={loading}
              sortConfig={sortConfig}
              onSortChange={(field) => setSortConfig((current) => ({ field, direction: current.field === field && current.direction === "asc" ? "desc" : "asc" }))}
              page={safePage}
              pageSize={pageSize}
              totalItems={sortedInvoices.length}
              totalPages={totalPages}
              onPageChange={setPage}
              onView={(invoiceId) => router.push(`/invoices/${invoiceId}`)}
              onRecordPayment={(invoiceId) => router.push(`/invoices/${invoiceId}?action=payment`)}
              onDownload={downloadInvoicePdf}
              onPrint={printInvoice}
              onDuplicate={() => window.alert("Duplicate invoice is not available yet.")}
              onCancel={handleCancelInvoice}
            />
          </div>
        </Section>
      </PageContainer>
    </AppShell>
  );
}
