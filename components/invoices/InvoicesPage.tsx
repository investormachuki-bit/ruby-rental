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
import { generateMonthlyInvoices } from "@/services/billing/generateMonthlyInvoices";
import MonthlyBillingModal from "@/components/invoices/MonthlyBillingModal";
import type { InvoiceRowData } from "@/components/invoices/InvoiceRow";
import type { MonthlyBillingSummary } from "@/services/billing/types";

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
  const [showBillingModal, setShowBillingModal] = useState(false);
  const [billingMonth, setBillingMonth] = useState(() => new Date().toISOString().slice(0, 7));
  const [billingLoading, setBillingLoading] = useState(false);
  const [billingProgress, setBillingProgress] = useState<string[]>([]);
  const [billingSummary, setBillingSummary] = useState<MonthlyBillingSummary | null>(null);

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

  const totalInvoices = sortedInvoices.length;
  const totalAmount = sortedInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const paid = sortedInvoices.filter((invoice) => invoice.status === "Paid").length;
  const outstanding = sortedInvoices.reduce((sum, invoice) => sum + invoice.balance, 0);
  const overdue = sortedInvoices.filter((invoice) => invoice.status === "Overdue").length;
  const draft = sortedInvoices.filter((invoice) => invoice.status === "Draft").length;
  const sent = sortedInvoices.filter((invoice) => invoice.status === "Sent").length;
  const partiallyPaid = sortedInvoices.filter((invoice) => invoice.status === "Partially Paid").length;

  return (
    <AppShell>
      <PageContainer>
        <Breadcrumb items={[{ label: "Dashboard", href: "/" }, { label: "Invoices" }]} />

        <PageHeader title="Invoices" description="Manage tenant billing, invoice generation, collections and statements.">
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setShowBillingModal(true)}>Generate Monthly</Button>
            <Button variant="primary">Generate Invoice</Button>
          </div>
        </PageHeader>

        <Section>
          <InvoiceSummaryCards
            totalInvoices={totalInvoices}
            totalAmount={totalAmount}
            paid={paid}
            outstanding={outstanding}
            overdue={overdue}
            draft={draft}
            sent={sent}
            partiallyPaid={partiallyPaid}
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
              onDownload={() => window.alert("PDF download is not available yet.")}
              onPrint={() => window.print()}
              onDuplicate={() => window.alert("Duplicate invoice is not available yet.")}
              onCancel={() => window.alert("Cancel invoice is not available yet.")}
            />
          </div>
        </Section>
      </PageContainer>
      <MonthlyBillingModal
        open={showBillingModal}
        onClose={() => setShowBillingModal(false)}
        billingMonth={billingMonth}
        onBillingMonthChange={setBillingMonth}
        onPreview={async () => {
          setBillingLoading(true);
          setBillingProgress(["Preparing billing preview..."]);
          try {
            const targetDate = new Date(`${billingMonth}-01T12:00:00`);
            const summary = await generateMonthlyInvoices(targetDate);
            setBillingSummary(summary);
            setBillingProgress([`Previewed ${summary.generated} invoices for ${summary.billing_period}.`]);
          } catch (error: any) {
            setBillingProgress([error?.message ?? "Unable to preview billing run."]);
          } finally {
            setBillingLoading(false);
          }
        }}
        onGenerate={async () => {
          setBillingLoading(true);
          setBillingProgress(["Starting monthly billing generation..."]);
          try {
            const targetDate = new Date(`${billingMonth}-01T12:00:00`);
            const summary = await generateMonthlyInvoices(targetDate);
            setBillingSummary(summary);
            setBillingProgress([
              `Generated ${summary.generated} invoices.`,
              `Skipped ${summary.skipped_units} units.`,
              `Encountered ${summary.failed_units} failures.`,
            ]);
            await loadInvoices();
          } catch (error: any) {
            setBillingProgress([error?.message ?? "Monthly billing generation failed."]);
          } finally {
            setBillingLoading(false);
          }
        }}
        loading={billingLoading}
        progress={billingProgress}
        summary={billingSummary}
      />
    </AppShell>
  );
}
