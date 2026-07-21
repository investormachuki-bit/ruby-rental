"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import AppShell from "@/components/layout/AppShell";

import Breadcrumb from "@/components/common/Breadcrumb";

import PageContainer from "@/components/ui/PageContainer";
import PageHeader from "@/components/ui/PageHeader";
import Section from "@/components/ui/Section";
import StatCard from "@/components/ui/StatCard";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

import {
  FileText,
  Clock3,
  CheckCircle2,
  AlertTriangle,
  Wallet,
  Receipt,
} from "lucide-react";

type Invoice = {
  id: string;

  invoice_number: string;

  tenant_name: string;

  property_name: string;

  unit_number: string;

  billing_period: string;

  due_date: string;

  amount: number;

  amount_paid: number;

  balance: number;

  status: string;
};

export default function InvoicesPage() {

  // Data will come from Supabase in Part 2
  const [invoices] = useState<Invoice[]>([]);

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("All");

  const filteredInvoices =
    useMemo(() => {

      const keyword =
        search.toLowerCase();

      return invoices.filter(
        (invoice) => {

          const matchesSearch =

            invoice.invoice_number
              .toLowerCase()
              .includes(keyword) ||

            invoice.tenant_name
              .toLowerCase()
              .includes(keyword) ||

            invoice.property_name
              .toLowerCase()
              .includes(keyword) ||

            invoice.unit_number
              .toLowerCase()
              .includes(keyword);

          const matchesStatus =

            status === "All" ||

            invoice.status === status;

          return (
            matchesSearch &&
            matchesStatus
          );

        }
      );

    }, [
      invoices,
      search,
      status,
    ]);

  const totalInvoices =
    filteredInvoices.length;

  const unpaid =
    filteredInvoices.filter(
      (i) =>
        i.status === "Unpaid"
    ).length;

  const partial =
    filteredInvoices.filter(
      (i) =>
        i.status ===
        "Partially Paid"
    ).length;

  const paid =
    filteredInvoices.filter(
      (i) =>
        i.status === "Paid"
    ).length;

  const overdue =
    filteredInvoices.filter(
      (i) =>
        i.status ===
        "Overdue"
    ).length;

  const outstanding =
    filteredInvoices.reduce(
      (sum, invoice) =>
        sum + Number(invoice.balance),
      0
    );

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
            },
          ]}
        />

        <PageHeader
          title="Invoices"
          description="Manage tenant billing, invoice generation, collections and statements."
        >

          <div className="flex gap-3">

            <Button
              variant="secondary"
            >
              Generate Monthly
            </Button>

            <Button
              variant="primary"
            >
              Generate Invoice
            </Button>

          </div>

        </PageHeader>

        <Section>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-6">

            <StatCard
              title="Invoices"
              value={totalInvoices}
              subtitle="Total invoices"
              icon={
                <FileText className="h-6 w-6 text-[#D4AF37]" />
              }
            />

            <StatCard
              title="Unpaid"
              value={unpaid}
              subtitle="Awaiting payment"
              icon={
                <Clock3 className="h-6 w-6 text-amber-500" />
              }
            />

            <StatCard
              title="Partial"
              value={partial}
              subtitle="Partially paid"
              icon={
                <Wallet className="h-6 w-6 text-blue-600" />
              }
            />

            <StatCard
              title="Paid"
              value={paid}
              subtitle="Fully settled"
              icon={
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              }
            />

            <StatCard
              title="Overdue"
              value={overdue}
              subtitle="Past due date"
              icon={
                <AlertTriangle className="h-6 w-6 text-red-600" />
              }
            />

            <StatCard
              title="Outstanding"
              value={`KSh ${outstanding.toLocaleString()}`}
              subtitle="Amount due"
              valueClassName="text-[#D4AF37]"
              icon={
                <Receipt className="h-6 w-6 text-[#D4AF37]" />
              }
            />

          </div>

        </Section>

        <Section>

          <Card>

            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

              <div>

                <h2 className="text-2xl font-bold text-gray-900">

                  Invoice Dashboard

                </h2>

                <p className="mt-2 text-gray-500">

                  Manage invoices, balances and tenant billing.

                </p>

              </div>

              <div className="flex flex-col gap-3 md:flex-row">

                <input
                  type="text"
                  placeholder="Search invoice, tenant, property..."
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                  className="rounded-xl border px-4 py-2"
                />

                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(
                      e.target.value
                    )
                  }
                  className="rounded-xl border px-4 py-2"
                >
                  <option>All</option>
                  <option>Unpaid</option>
                  <option>Partially Paid</option>
                  <option>Paid</option>
                  <option>Overdue</option>
                  <option>Cancelled</option>
                </select>

              </div>

            </div>

            <div className="rounded-2xl border border-dashed p-12 text-center">

              <FileText className="mx-auto mb-4 h-14 w-14 text-gray-400" />

              <h3 className="text-xl font-semibold">

                Invoice List Coming Next

              </h3>

              <p className="mt-2 text-gray-500">

                Part 2 will connect the database and display
                the complete invoice table with actions.

              </p>

            </div>

          </Card>

        </Section>

      </PageContainer>

    </AppShell>

  );

}
