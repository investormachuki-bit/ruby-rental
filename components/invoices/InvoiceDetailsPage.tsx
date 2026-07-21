"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import Breadcrumb from "@/components/common/Breadcrumb";
import PageContainer from "@/components/ui/PageContainer";
import PageHeader from "@/components/ui/PageHeader";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import Loading from "@/components/ui/Loading";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";
import { getInvoiceById } from "@/services/invoices/getInvoiceById";
import { createPayment } from "@/services/payments/createPayment";
import { Receipt, FileText, DollarSign, Printer, Download, Wallet } from "lucide-react";

type InvoiceItem = {
  id: string;
  item_type: string;
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
};

type PaymentAllocation = {
  allocated_amount: number;
  allocated_at: string;
  payment: {
    id: string;
    receipt_number: string;
    amount: number;
    payment_method: string;
    payment_date: string;
  };
};

type InvoiceDetails = {
  id: string;
  invoice_number: string;
  billing_period: string;
  invoice_date: string;
  due_date: string;
  amount: number;
  amount_paid: number;
  balance: number;
  status: string;
  notes: string | null;
  tenant: {
    id?: string;
    full_name: string;
    phone?: string | null;
    email?: string | null;
  };
  property: {
    id?: string;
    name: string;
  };
  unit: {
    id?: string;
    unit_number: string;
  };
  lease: {
    id: string;
    lease_number: string;
    rent_amount: number;
  };
  invoice_items: InvoiceItem[];
  payment_allocations: PaymentAllocation[];
};

export default function InvoiceDetailsPage({ invoiceId }: { invoiceId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [invoice, setInvoice] = useState<InvoiceDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const action = searchParams.get("action");

  useEffect(() => {
    loadInvoice();
  }, [invoiceId]);

  async function loadInvoice() {
    try {
      setLoading(true);
      setError(null);
      const data = await getInvoiceById(invoiceId);
      setInvoice(data);
    } catch (err: any) {
      setError(err?.message ?? "Unable to load invoice.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRecordPayment() {
    if (!invoice) return;
    const amount = window.prompt("Enter payment amount", String(invoice.balance || invoice.amount));
    if (!amount) return;
    const parsed = Number(amount);
    if (!parsed || parsed <= 0) {
      window.alert("Please enter a valid payment amount.");
      return;
    }

    try {
      setPaymentLoading(true);
      await createPayment({
        lease_id: invoice.lease.id,
        property_id: invoice.property.id as unknown as string,
        unit_id: invoice.unit.id as unknown as string,
        tenant_id: invoice.tenant.id as unknown as string,
        payment_type: "Rent",
        payment_method: "M-Pesa",
        payment_date: new Date().toISOString().split("T")[0],
        amount: parsed,
        notes: `Payment for invoice ${invoice.invoice_number}`,
      });
      await loadInvoice();
    } catch (err: any) {
      window.alert(err?.message ?? "Payment could not be recorded.");
    } finally {
      setPaymentLoading(false);
    }
  }

  const subtotal = useMemo(() => (invoice?.invoice_items ?? []).reduce((sum, item) => sum + Number(item.amount ?? 0), 0), [invoice]);
  const tax = 0;
  const grandTotal = subtotal + tax;

  if (loading) {
    return (
      <AppShell>
        <PageContainer>
          <Loading title="Loading Invoice" description="Preparing invoice details..." />
        </PageContainer>
      </AppShell>
    );
  }

  if (error || !invoice) {
    return (
      <AppShell>
        <PageContainer>
          <EmptyState title="Invoice not found" description={error ?? "The invoice could not be loaded."} action={<Button onClick={() => router.back()}>Go Back</Button>} />
        </PageContainer>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageContainer>
        <Breadcrumb items={[{ label: "Dashboard", href: "/" }, { label: "Invoices", href: "/invoices" }, { label: invoice.invoice_number }]} />
        <PageHeader title={invoice.invoice_number} description="Invoice details and payment history">
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={() => window.print()}>
              <Printer size={16} className="mr-2" />
              Print
            </Button>
            <Button variant="secondary" onClick={() => window.alert("PDF download is not available yet.")}>
              <Download size={16} className="mr-2" />
              Download
            </Button>
            <Button variant="primary" onClick={handleRecordPayment} loading={paymentLoading}>
              <Wallet size={16} className="mr-2" />
              Record Payment
            </Button>
          </div>
        </PageHeader>

        <Section>
          <Card>
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-5">
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                  <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">Invoice Header</p>
                  <div className="mt-4 space-y-3 text-sm text-gray-700">
                    <div className="flex items-center justify-between"><span className="text-gray-500">Invoice Number</span><span className="font-semibold">{invoice.invoice_number}</span></div>
                    <div className="flex items-center justify-between"><span className="text-gray-500">Status</span><span className="font-semibold">{invoice.status}</span></div>
                    <div className="flex items-center justify-between"><span className="text-gray-500">Issue Date</span><span className="font-semibold">{invoice.invoice_date}</span></div>
                    <div className="flex items-center justify-between"><span className="text-gray-500">Due Date</span><span className="font-semibold">{invoice.due_date}</span></div>
                    <div className="flex items-center justify-between"><span className="text-gray-500">Billing Period</span><span className="font-semibold">{invoice.billing_period}</span></div>
                  </div>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white p-5">
                  <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">Party Details</p>
                  <div className="mt-4 space-y-3 text-sm text-gray-700">
                    <div className="flex items-center justify-between"><span className="text-gray-500">Tenant</span><span className="font-semibold">{invoice.tenant?.full_name ?? "-"}</span></div>
                    <div className="flex items-center justify-between"><span className="text-gray-500">Property</span><span className="font-semibold">{invoice.property?.name ?? "-"}</span></div>
                    <div className="flex items-center justify-between"><span className="text-gray-500">Unit</span><span className="font-semibold">{invoice.unit?.unit_number ?? "-"}</span></div>
                    <div className="flex items-center justify-between"><span className="text-gray-500">Lease</span><span className="font-semibold">{invoice.lease?.lease_number ?? "-"}</span></div>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-[#111111] p-6 text-white">
                <div className="flex items-center gap-2 text-[#D4AF37]"><Receipt className="h-5 w-5" /><span className="font-semibold">Invoice Summary</span></div>
                <div className="mt-6 space-y-4 text-sm">
                  <div className="flex items-center justify-between"><span className="text-gray-300">Subtotal</span><span className="font-semibold">KSh {subtotal.toLocaleString()}</span></div>
                  <div className="flex items-center justify-between"><span className="text-gray-300">Tax</span><span className="font-semibold">KSh {tax.toLocaleString()}</span></div>
                  <div className="flex items-center justify-between border-t border-white/20 pt-4 text-base"><span>Grand Total</span><span className="font-semibold text-[#D4AF37]">KSh {grandTotal.toLocaleString()}</span></div>
                  <div className="flex items-center justify-between"><span className="text-gray-300">Paid</span><span className="font-semibold">KSh {Number(invoice.amount_paid ?? 0).toLocaleString()}</span></div>
                  <div className="flex items-center justify-between"><span className="text-gray-300">Outstanding</span><span className="font-semibold text-[#D4AF37]">KSh {Number(invoice.balance ?? 0).toLocaleString()}</span></div>
                </div>
              </div>
            </div>
          </Card>
        </Section>

        <Section>
          <Card>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Invoice Items</h2>
                <p className="mt-2 text-gray-500">Line items included in this invoice.</p>
              </div>
            </div>
            {invoice.invoice_items?.length ? (
              <div className="overflow-x-auto rounded-2xl border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Item</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Description</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-600">Qty</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-600">Unit Price</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-600">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {invoice.invoice_items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-4 font-medium text-gray-900">{item.item_type}</td>
                        <td className="px-4 py-4">{item.description}</td>
                        <td className="px-4 py-4 text-right">{item.quantity}</td>
                        <td className="px-4 py-4 text-right">KSh {Number(item.unit_price ?? 0).toLocaleString()}</td>
                        <td className="px-4 py-4 text-right font-semibold">KSh {Number(item.amount ?? 0).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState title="No invoice items" description="This invoice does not currently contain any line items." />
            )}
          </Card>
        </Section>

        <Section>
          <Card>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Payments</h2>
                <p className="mt-2 text-gray-500">Payment history allocated to this invoice.</p>
              </div>
            </div>
            {invoice.payment_allocations?.length ? (
              <div className="overflow-x-auto rounded-2xl border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Receipt</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Method</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-600">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {invoice.payment_allocations.map((payment, index) => (
                      <tr key={`${payment.payment.id}-${index}`}>
                        <td className="px-4 py-4 font-medium text-gray-900">{payment.payment.receipt_number}</td>
                        <td className="px-4 py-4">{payment.payment.payment_date}</td>
                        <td className="px-4 py-4">{payment.payment.payment_method}</td>
                        <td className="px-4 py-4 text-right font-semibold">KSh {Number(payment.allocated_amount ?? 0).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState title="No payments yet" description="Payments will appear here once allocated to this invoice." />
            )}
          </Card>
        </Section>
      </PageContainer>
    </AppShell>
  );
}
