"use client";

import { useEffect, useState } from "react";

import Card from "@/components/ui/Card";
import Loading from "@/components/ui/Loading";
import Button from "@/components/ui/Button";

import { getFinanceReports } from "@/services/reports/getFinanceReports";
import { exportPdf } from "@/services/reports/pdf/exportPdf";
import { exportExcel } from "@/services/reports/excel/exportExcel";

type ReportData = {
  revenue: number;
  outstanding: number;
  collections: number;
  collectionRate: number;

  revenueTrend: {
    month: string;
    revenue: number;
  }[];

  recentPayments: any[];
  outstandingInvoices: any[];
  aging: {
    current: number;
    days30: number;
    days60: number;
    days90: number;
    over90: number;
  };
  cashFlow: {
    totalIncome: number;
    totalExpenses: number;
    netCashFlow: number;
    payments: number;
    expenses: number;
  };
};

const money = (value: number) =>
  `KES ${Number(value ?? 0).toLocaleString()}`;

export default function FinanceReportsDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ReportData | null>(null);

  useEffect(() => {
    loadReports();
  }, []);

  async function loadReports() {
    try {
      const result = await getFinanceReports();
      setData(result);
    } catch (error) {
      console.error("REPORTS ERROR:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <Loading title="Loading finance reports..." />;
  }

  if (!data) {
    return (
      <Card>
        <div className="py-10 text-center text-gray-500">
          Unable to load finance reports.
        </div>
      </Card>
    );
  }

  const revenueRows = [
    {
      Metric: "Revenue This Month",
      Amount: data.revenue,
    },
    {
      Metric: "Collections Today",
      Amount: data.collections,
    },
    {
      Metric: "Collection Rate",
      Amount: `${data.collectionRate}%`,
    },
  ];

  const agingRows = [
    { Bucket: "Current", Amount: data.aging.current },
    { Bucket: "1–30 Days", Amount: data.aging.days30 },
    { Bucket: "31–60 Days", Amount: data.aging.days60 },
    { Bucket: "61–90 Days", Amount: data.aging.days90 },
    { Bucket: "Over 90 Days", Amount: data.aging.over90 },
  ];

  const cashFlowRows = [
    {
      Metric: "Total Income",
      Amount: data.cashFlow.totalIncome,
    },
    {
      Metric: "Total Expenses",
      Amount: data.cashFlow.totalExpenses,
    },
    {
      Metric: "Net Cash Flow",
      Amount: data.cashFlow.netCashFlow,
    },
  ];

  async function exportRevenuePdf() {
    await exportPdf({
      title: "Revenue & Collections Report",
      rows: revenueRows,
    });
  }

  async function exportRevenueExcel() {
    await exportExcel({
      fileName: "Revenue_and_Collections_Report",
      rows: revenueRows,
    });
  }

  async function exportAgingPdf() {
    await exportPdf({
      title: "Accounts Receivable Aging Report",
      rows: agingRows,
    });
  }

  async function exportAgingExcel() {
    await exportExcel({
      fileName: "Accounts_Receivable_Aging_Report",
      rows: agingRows,
    });
  }

  async function exportCashFlowPdf() {
    await exportPdf({
      title: "Cash Flow Report",
      rows: cashFlowRows,
    });
  }

  async function exportCashFlowExcel() {
    await exportExcel({
      fileName: "Cash_Flow_Report",
      rows: cashFlowRows,
    });
  }

  return (
    <div className="space-y-6">

      {/* SUMMARY */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

        <Card>
          <p className="text-sm text-gray-500">
            Revenue This Month
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            {money(data.revenue)}
          </h2>
        </Card>

        <Card>
          <p className="text-sm text-gray-500">
            Outstanding Rent
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            {money(data.outstanding)}
          </h2>
        </Card>

        <Card>
          <p className="text-sm text-gray-500">
            Collections Today
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            {money(data.collections)}
          </h2>
        </Card>

        <Card>
          <p className="text-sm text-gray-500">
            Collection Rate
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            {data.collectionRate}%
          </h2>
        </Card>

      </div>

      {/* REVENUE */}
      <Card>
        <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-xl font-bold">
              Revenue & Collections
            </h2>
            <p className="text-sm text-gray-500">
              Current rental income and collection performance.
            </p>
          </div>

          <div className="flex gap-2">
            <Button onClick={exportRevenuePdf}>
              Export PDF
            </Button>

            <Button
              variant="secondary"
              onClick={exportRevenueExcel}
            >
              Excel
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border p-4">
            <p className="text-sm text-gray-500">
              Revenue This Month
            </p>
            <p className="mt-2 text-xl font-bold">
              {money(data.revenue)}
            </p>
          </div>

          <div className="rounded-xl border p-4">
            <p className="text-sm text-gray-500">
              Collections Today
            </p>
            <p className="mt-2 text-xl font-bold">
              {money(data.collections)}
            </p>
          </div>

          <div className="rounded-xl border p-4">
            <p className="text-sm text-gray-500">
              Collection Rate
            </p>
            <p className="mt-2 text-xl font-bold">
              {data.collectionRate}%
            </p>
          </div>
        </div>
      </Card>

      {/* REVENUE TREND */}
      <Card>
        <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-xl font-bold">
              Revenue Trend
            </h2>
            <p className="text-sm text-gray-500">
              Rental collections over the last 12 months.
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={async () => {
                await exportPdf({
                  title: "12 Month Revenue Trend",
                  rows: data.revenueTrend.map((item) => ({
                    Month: item.month,
                    Revenue: Number(item.revenue ?? 0),
                  })),
                });
              }}
            >
              Export PDF
            </Button>

            <Button
              variant="secondary"
              onClick={async () => {
                await exportExcel({
                  fileName: "12_Month_Revenue_Trend",
                  rows: data.revenueTrend.map((item) => ({
                    Month: item.month,
                    Revenue: Number(item.revenue ?? 0),
                  })),
                });
              }}
            >
              Excel
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {data.revenueTrend.map((item) => (
            <div
              key={item.month}
              className="flex items-center gap-4"
            >
              <div className="w-14 text-sm font-medium">
                {item.month}
              </div>

              <div className="flex-1">
                <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-[#D4AF37]"
                    style={{
                      width: `${
                        data.revenueTrend.length
                          ? Math.min(
                              100,
                              (item.revenue /
                                Math.max(
                                  ...data.revenueTrend.map(
                                    (x) => x.revenue
                                  ),
                                  1
                                )) *
                                100
                            )
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div className="w-32 text-right text-sm font-semibold">
                {money(item.revenue)}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* AGING */}
      <Card>
        <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-xl font-bold">
              Accounts Receivable Aging
            </h2>
            <p className="text-sm text-gray-500">
              Outstanding tenant balances by age.
            </p>
          </div>

          <div className="flex gap-2">
            <Button onClick={exportAgingPdf}>
              Export PDF
            </Button>

            <Button
              variant="secondary"
              onClick={exportAgingExcel}
            >
              Excel
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-5">

          <div className="rounded-xl border p-4">
            <p className="text-sm text-gray-500">Current</p>
            <p className="mt-2 font-bold">
              {money(data.aging.current)}
            </p>
          </div>

          <div className="rounded-xl border p-4">
            <p className="text-sm text-gray-500">1–30 Days</p>
            <p className="mt-2 font-bold">
              {money(data.aging.days30)}
            </p>
          </div>

          <div className="rounded-xl border p-4">
            <p className="text-sm text-gray-500">31–60 Days</p>
            <p className="mt-2 font-bold">
              {money(data.aging.days60)}
            </p>
          </div>

          <div className="rounded-xl border p-4">
            <p className="text-sm text-gray-500">61–90 Days</p>
            <p className="mt-2 font-bold">
              {money(data.aging.days90)}
            </p>
          </div>

          <div className="rounded-xl border p-4">
            <p className="text-sm text-gray-500">90+ Days</p>
            <p className="mt-2 font-bold">
              {money(data.aging.over90)}
            </p>
          </div>

        </div>
      </Card>

      {/* CASH FLOW */}
      <Card>
        <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-xl font-bold">
              Cash Flow
            </h2>
            <p className="text-sm text-gray-500">
              Income, expenses and net cash position.
            </p>
          </div>

          <div className="flex gap-2">
            <Button onClick={exportCashFlowPdf}>
              Export PDF
            </Button>

            <Button
              variant="secondary"
              onClick={exportCashFlowExcel}
            >
              Excel
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">

          <div className="rounded-xl border p-4">
            <p className="text-sm text-gray-500">
              Total Income
            </p>
            <p className="mt-2 text-xl font-bold">
              {money(data.cashFlow.totalIncome)}
            </p>
          </div>

          <div className="rounded-xl border p-4">
            <p className="text-sm text-gray-500">
              Total Expenses
            </p>
            <p className="mt-2 text-xl font-bold">
              {money(data.cashFlow.totalExpenses)}
            </p>
          </div>

          <div className="rounded-xl border p-4">
            <p className="text-sm text-gray-500">
              Net Cash Flow
            </p>
            <p className="mt-2 text-xl font-bold">
              {money(data.cashFlow.netCashFlow)}
            </p>
          </div>

        </div>
      </Card>

      {/* OUTSTANDING */}
      <Card>
        <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-xl font-bold">
              Outstanding Invoices
            </h2>

            <p className="text-sm text-gray-500">
              Invoices currently carrying an outstanding balance.
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={async () => {
                await exportPdf({
                  title: "Outstanding Invoices Report",
                  rows: data.outstandingInvoices.map((invoice) => ({
                    Invoice: invoice.invoice_number,
                    Tenant: invoice.tenant_name,
                    Property: invoice.property_name,
                    Unit: invoice.unit_number,
                    "Due Date": invoice.due_date
                      ? new Date(invoice.due_date).toLocaleDateString()
                      : "-",
                    Balance: Number(invoice.balance ?? 0),
                  })),
                });
              }}
            >
              Export PDF
            </Button>

            <Button
              variant="secondary"
              onClick={async () => {
                await exportExcel({
                  fileName: "Outstanding_Invoices_Report",
                  rows: data.outstandingInvoices.map((invoice) => ({
                    Invoice: invoice.invoice_number,
                    Tenant: invoice.tenant_name,
                    Property: invoice.property_name,
                    Unit: invoice.unit_number,
                    "Due Date": invoice.due_date
                      ? new Date(invoice.due_date).toLocaleDateString()
                      : "-",
                    Balance: Number(invoice.balance ?? 0),
                  })),
                });
              }}
            >
              Excel
            </Button>
          </div>
        </div>

        {data.outstandingInvoices.length === 0 ? (
          <p className="py-8 text-center text-gray-400">
            No outstanding invoices.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b">
                  <th className="p-3">Invoice</th>
                  <th className="p-3">Tenant</th>
                  <th className="p-3">Property</th>
                  <th className="p-3">Due Date</th>
                  <th className="p-3 text-right">Balance</th>
                </tr>
              </thead>

              <tbody>
                {data.outstandingInvoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="border-b last:border-0"
                  >
                    <td className="p-3 font-medium">
                      {invoice.invoice_number}
                    </td>

                    <td className="p-3">
                      {invoice.tenant_name}
                    </td>

                    <td className="p-3">
                      {invoice.property_name}
                    </td>

                    <td className="p-3">
                      {invoice.due_date
                        ? new Date(
                            invoice.due_date
                          ).toLocaleDateString()
                        : "-"}
                    </td>

                    <td className="p-3 text-right font-semibold">
                      {money(invoice.balance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

    </div>
  );
}
