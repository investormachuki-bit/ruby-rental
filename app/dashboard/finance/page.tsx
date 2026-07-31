"use client";

import AppShell from "@/components/layout/AppShell";
import PageContainer from "@/components/ui/PageContainer";
import PageHeader from "@/components/ui/PageHeader";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

import {
  ArrowUpRight,
  CreditCard,
  ReceiptText,
  TrendingUp,
  Wallet,
  AlertTriangle,
  BarChart3,
  FileText,
} from "lucide-react";

export default function FinanceDashboardPage() {
  return (
    <AppShell>
      <PageContainer>

        <PageHeader
          title="Finance Dashboard"
          description="Monitor revenue, collections, invoices and financial performance."
        />

        {/* KPI CARDS */}

        <Section>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

            <Card>

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-gray-500">
                    Revenue This Month
                  </p>

                  <h2 className="mt-2 text-3xl font-bold">
                    KES 0
                  </h2>

                  <p className="mt-2 text-sm text-green-600">
                    +0% vs last month
                  </p>

                </div>

                <Wallet
                  size={40}
                  className="text-[#D4AF37]"
                />

              </div>

            </Card>

            <Card>

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-gray-500">
                    Outstanding Rent
                  </p>

                  <h2 className="mt-2 text-3xl font-bold">
                    KES 0
                  </h2>

                  <p className="mt-2 text-sm text-red-500">
                    Amount pending collection
                  </p>

                </div>

                <AlertTriangle
                  size={40}
                  className="text-red-500"
                />

              </div>

            </Card>

            <Card>

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-gray-500">
                    Collections Today
                  </p>

                  <h2 className="mt-2 text-3xl font-bold">
                    KES 0
                  </h2>

                  <p className="mt-2 text-sm text-gray-500">
                    Today's receipts
                  </p>

                </div>

                <CreditCard
                  size={40}
                  className="text-[#D4AF37]"
                />

              </div>

            </Card>

            <Card>

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-gray-500">
                    Collection Rate
                  </p>

                  <h2 className="mt-2 text-3xl font-bold">
                    0%
                  </h2>

                  <p className="mt-2 text-sm text-gray-500">
                    Current month
                  </p>

                </div>

                <TrendingUp
                  size={40}
                  className="text-green-600"
                />

              </div>

            </Card>

          </div>

        </Section>

        {/* MAIN GRID */}

        <Section>

          <div className="grid gap-6 xl:grid-cols-3">

            <div className="xl:col-span-2">

              <Card>

                <div className="mb-6 flex items-center justify-between">

                  <h2 className="text-xl font-bold">
                    Revenue Trend
                  </h2>

                  <BarChart3 className="text-[#D4AF37]" />

                </div>

                <div className="flex h-72 items-center justify-center rounded-xl border-2 border-dashed border-gray-300">

                  Revenue Chart Coming Soon

                </div>

              </Card>

            </div>

            <div>

              <Card>

                <h2 className="mb-6 text-xl font-bold">
                  Quick Actions
                </h2>

                <div className="space-y-3">

                  <Button className="w-full justify-between">

                    Receive Payment

                    <ArrowUpRight size={18} />

                  </Button>

                  <Button className="w-full justify-between">

                    Generate Billing

                    <ArrowUpRight size={18} />

                  </Button>

                  <Button className="w-full justify-between">

                    View Invoices

                    <ReceiptText size={18} />

                  </Button>

                  <Button className="w-full justify-between">

                    Financial Reports

                    <FileText size={18} />

                  </Button>

                </div>

              </Card>

            </div>

          </div>

        </Section>

        {/* TABLES */}

        <Section>

          <div className="grid gap-6 lg:grid-cols-2">

            <Card>

              <h2 className="mb-5 text-xl font-bold">
                Recent Payments
              </h2>

              <div className="flex h-64 items-center justify-center rounded-xl border-2 border-dashed border-gray-300">

                Recent Payments Table

              </div>

            </Card>

            <Card>

              <h2 className="mb-5 text-xl font-bold">
                Outstanding Invoices
              </h2>

              <div className="flex h-64 items-center justify-center rounded-xl border-2 border-dashed border-gray-300">

                Outstanding Invoice Table

              </div>

            </Card>

          </div>

        </Section>

      </PageContainer>
    </AppShell>
  );
}
