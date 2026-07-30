"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import AppShell from "@/components/layout/AppShell";
import Breadcrumb from "@/components/common/Breadcrumb";

import PageContainer from "@/components/ui/PageContainer";
import PageHeader from "@/components/ui/PageHeader";
import Section from "@/components/ui/Section";
import Loading from "@/components/ui/Loading";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";

import InvoiceActionBar
  from "@/components/invoices/details/InvoiceActionBar";

import InvoiceKpiCards
  from "@/components/invoices/details/InvoiceKpiCards";

import InvoicePartyCard
  from "@/components/invoices/details/InvoicePartyCard";

import InvoiceItemsTable
  from "@/components/invoices/details/InvoiceItemsTable";

import InvoicePaymentsTable
  from "@/components/invoices/details/InvoicePaymentsTable";

import InvoiceTimeline
  from "@/components/invoices/details/InvoiceTimeline";

import { getInvoiceById }
  from "@/services/invoices/getInvoiceById";

import { createPayment }
  from "@/services/payments/createPayment";

import { getBranding }
  from "@/services/branding/getBranding";

import { downloadInvoicePdf }
  from "@/services/invoices/pdf/downloadInvoicePdf";

import { printInvoice }
  from "@/services/invoices/pdf/printInvoice";

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

    address?: string | null;

  };

  unit: {

    id?: string;

    unit_number: string;

  };

  lease: {

    id: string;

    lease_number: string;

    rent_amount: number;

    start_date?: string;

    end_date?: string;

  };

  invoice_items: InvoiceItem[];

  payment_allocations: PaymentAllocation[];

};

export default function InvoiceDetailsPage({

  invoiceId,

}: {

  invoiceId: string;

}) {

  const router = useRouter();

  const searchParams =
    useSearchParams();

  const [invoice, setInvoice] =
    useState<InvoiceDetails | null>(null);

  const [branding, setBranding] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  const [paymentLoading, setPaymentLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const action =
    searchParams.get("action");

  useEffect(() => {

    loadInvoice();

  }, [invoiceId]);

  useEffect(() => {

    if (

      action === "payment" &&

      invoice

    ) {

      handleRecordPayment();

    }

  }, [action, invoice]);
    async function loadInvoice() {

    try {

      setLoading(true);

      setError(null);

      const [

        invoiceData,

        brandingData,

      ] = await Promise.all([

        getInvoiceById(
          invoiceId
        ),

        getBranding(),

      ]);

      setInvoice(
        invoiceData
      );

      setBranding(
        brandingData
      );

    } catch (err: any) {

      console.error(err);

      setError(

        err?.message ??

        "Unable to load invoice."

      );

    } finally {

      setLoading(false);

    }

  }

  async function handleRecordPayment() {

    if (!invoice) return;

    const amount = window.prompt(

      "Enter payment amount",

      String(

        invoice.balance ||

        invoice.amount

      )

    );

    if (!amount) return;

    const parsed =
      Number(amount);

    if (

      Number.isNaN(parsed) ||

      parsed <= 0

    ) {

      window.alert(

        "Please enter a valid payment amount."

      );

      return;

    }

    try {

      setPaymentLoading(true);

      await createPayment({

        lease_id:
          invoice.lease.id,

        property_id:
          invoice.property.id as string,

        unit_id:
          invoice.unit.id as string,

        tenant_id:
          invoice.tenant.id as string,

        payment_type:
          "Rent",

        payment_method:
          "M-Pesa",

        payment_date:
          new Date()
            .toISOString()
            .split("T")[0],

        amount:
          parsed,

        notes:
          `Payment for invoice ${invoice.invoice_number}`,

      });

      await loadInvoice();

    } catch (err: any) {

      window.alert(

        err?.message ??

        "Payment could not be recorded."

      );

    } finally {

      setPaymentLoading(false);

    }

  }

  async function handleDownloadPdf() {

    if (!invoice) return;

    try {

      await downloadInvoicePdf(
        invoice.id
      );

    } catch (err: any) {

      console.error(err);

      window.alert(

        err?.message ??

        "Unable to download invoice."

      );

    }

  }

  async function handlePrintInvoice() {

    if (!invoice) return;

    try {

      await printInvoice(
        invoice.id
      );

    } catch (err: any) {

      console.error(err);

      window.alert(

        err?.message ??

        "Unable to print invoice."

      );

    }

  }

  function handleEmailInvoice() {

    window.alert(

      "Email integration will be connected in the Communications module."

    );

  }

  function handleWhatsAppInvoice() {

    window.alert(

      "WhatsApp integration will be connected in the Communications module."

    );

  }

  function handleDuplicateInvoice() {

    window.alert(

      "Invoice duplication will be added in the next Finance update."

    );

  }

  function handleCancelInvoice() {

    window.alert(

      "Invoice cancellation workflow will be connected next."

    );

  }

  const totalItems = useMemo(() => {

    return (

      invoice?.invoice_items ??

      []

    ).reduce(

      (

        sum,

        item

      ) =>

        sum +

        Number(item.amount),

      0

    );

  }, [invoice]);

  if (loading) {

    return (

      <AppShell>

        <PageContainer>

          <Loading

            title="Loading Invoice"

            description="Preparing invoice details..."

          />

        </PageContainer>

      </AppShell>

    );

  }

  if (

    error ||

    !invoice

  ) {

    return (

      <AppShell>

        <PageContainer>

          <EmptyState

            title="Invoice not found"

            description={
              error ??
              "The invoice could not be loaded."
            }

            action={

              <Button

                onClick={() =>
                  router.back()
                }

              >

                Go Back

              </Button>

            }

          />

        </PageContainer>

      </AppShell>

    );

  }

  return (

    <AppShell>

      <PageContainer>

        <Breadcrumb

          items={[

            {

              label:
                "Dashboard",

              href: "/",

            },

            {

              label:
                "Invoices",

              href:
                "/invoices",

            },

            {

              label:
                invoice.invoice_number,

            },

          ]}

        />

        <PageHeader

          title={
            invoice.invoice_number
          }

          description={
            branding?.companyName ??
            "Invoice Details"
          }

        >
                    <InvoiceActionBar

            loading={paymentLoading}

            onBack={() =>
              router.push("/invoices")
            }

            onDownload={
              handleDownloadPdf
            }

            onPrint={
              handlePrintInvoice
            }

            onPayment={
              handleRecordPayment
            }

            onEmail={
              handleEmailInvoice
            }

            onWhatsApp={
              handleWhatsAppInvoice
            }

            onDuplicate={
              handleDuplicateInvoice
            }

            onCancel={
              handleCancelInvoice
            }

          />

        </PageHeader>

        <Section>

          <InvoiceKpiCards

            amount={
              Number(
                invoice.amount ?? 0
              )
            }

            amountPaid={
              Number(
                invoice.amount_paid ?? 0
              )
            }

            balance={
              Number(
                invoice.balance ?? 0
              )
            }

            dueDate={
              invoice.due_date
            }

            status={
              invoice.status
            }

          />

        </Section>

        <Section>

          <InvoicePartyCard

            branding={{

              companyName:
                branding?.companyName ??
                "Ruby Rental",

              address:
                branding?.address,

              phone:
                branding?.phone,

              email:
                branding?.email,

              website:
                branding?.website,

            }}

            invoice={{

              invoice_number:
                invoice.invoice_number,

              billing_period:
                invoice.billing_period,

              invoice_date:
                invoice.invoice_date,

              due_date:
                invoice.due_date,

            }}

            tenant={{

              full_name:
                invoice.tenant.full_name,

              phone:
                invoice.tenant.phone,

              email:
                invoice.tenant.email,

            }}

            property={{

              name:
                invoice.property.name,

              address:
                invoice.property.address,

            }}

            unit={{

              unit_number:
                invoice.unit.unit_number,

            }}

            lease={{

              lease_number:
                invoice.lease.lease_number,

              rent_amount:
                invoice.lease.rent_amount,

              start_date:
                invoice.lease.start_date,

              end_date:
                invoice.lease.end_date,

            }}

            currency={
              branding?.currency ??
              "KES"
            }

          />

        </Section>

        <Section>
                    <InvoiceItemsTable

            items={

              invoice.invoice_items.map(

                (item) => ({

                  id: item.id,

                  item_type:
                    item.item_type,

                  description:
                    item.description,

                  quantity:
                    item.quantity,

                  unit_price:
                    item.unit_price,

                  amount:
                    item.amount,

                })

              )

            }

            currency={
              branding?.currency ??
              "KES"
            }

          />

        </Section>

        <Section>

          <InvoicePaymentsTable

            payments={

              invoice.payment_allocations.map(

                (allocation) => ({

                  id:
                    allocation.payment.id,

                  receipt_number:
                    allocation.payment
                      .receipt_number,

                  payment_date:
                    allocation.payment
                      .payment_date,

                  payment_method:
                    allocation.payment
                      .payment_method,

                  reference_number:
                    "",

                  amount:
                    allocation
                      .allocated_amount,

                })

              )

            }

            invoiceAmount={
              Number(
                invoice.amount ?? 0
              )
            }

            amountPaid={
              Number(
                invoice.amount_paid ?? 0
              )
            }

            balance={
              Number(
                invoice.balance ?? 0
              )
            }

            currency={
              branding?.currency ??
              "KES"
            }

          />

        </Section>

        <Section>

          <InvoiceTimeline

            timeline={[

              {

                id:
                  "created",

                event:
                  "Invoice Created",

                description:
                  `Invoice ${invoice.invoice_number} was generated.`,

                created_at:
                  invoice.invoice_date,

              },

              {

                id:
                  "issued",

                event:
                  "Invoice Issued",

                description:
                  `Status: ${invoice.status}`,

                created_at:
                  invoice.invoice_date,

              },

              ...invoice.payment_allocations.map(

                (

                  payment,

                  index

                ) => ({

                  id:
                    `payment-${index}`,

                  event:
                    "Payment Recorded",

                  description:
                    `Receipt ${payment.payment.receipt_number} • ${payment.payment.payment_method}`,

                  created_at:
                    payment.payment.payment_date,

                })

              ),

            ]}

          />

        </Section>

        {invoice.notes && (

          <Section>

            <Card>

              <h2 className="mb-4 text-xl font-bold">

                Notes

              </h2>

              <p className="whitespace-pre-wrap text-gray-700">

                {invoice.notes}

              </p>

            </Card>

          </Section>

        )}

      </PageContainer>

    </AppShell>

  );

}
