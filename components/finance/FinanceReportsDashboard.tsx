"use client";

import { useEffect, useState } from "react";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Loading from "@/components/ui/Loading";

import { getFinanceReports } from "@/services/reports/getFinanceReports";
import { exportPdf } from "@/services/reports/pdf/exportPdf";
import { exportExcel } from "@/services/reports/excel/exportExcel";

import PropertyRentRollCard from "./reports/PropertyRentRollCard";
import PropertyPerformanceCard from "./reports/PropertyPerformanceCard";
import OutstandingBalancesCard from "./reports/OutstandingBalancesCard";

type ReportData = Awaited<ReturnType<typeof getFinanceReports>>;

function money(value: number) {
  return `KES ${Number(value ?? 0).toLocaleString("en-KE")}`;
}

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
      console.error(error);
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
        <div className="p-8 text-center text-gray-500">
          Unable to load finance reports.
        </div>
      </Card>
    );
  }

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

  const revenueRows = data.revenueTrend.map((item) => ({
    Month: item.month,
    Revenue: item.revenue,
  }));

  async function exportAgingPdf() {
    await exportPdf({
      title: "Receivables Aging Report",
      subtitle: "Outstanding balances grouped by age",
      rows: agingRows.map((row) => ({
        Bucket: row.Bucket,
        Amount: money(row.Amount),
      })),
      totals: {
        "Total Receivables":
          agingRows.reduce(
            (sum, row) => sum + Number(row.Amount ?? 0),
            0
          ),
      },
    });
  }

  async function exportAgingExcel() {
    await exportExcel({
      fileName: "Ruby_Rental_Receivables_Aging",
      rows: agingRows,
    });
  }

  async function exportCashFlowPdf() {
    await exportPdf({
      title: "Cash Flow Report",
      subtitle: "Income, expenses and net cash position",
      rows: cashFlowRows.map((row) => ({
        Metric: row.Metric,
        Amount: money(row.Amount),
      })),
      totals: {
        "Net Cash Flow": data?.cashFlow?.netCashFlow ?? 0,
      },
    });
  }

  async function exportCashFlowExcel() {
    await exportExcel({
      fileName: "Ruby_Rental_Cash_Flow",
      rows: cashFlowRows,
    });
  }

  async function exportRevenuePdf() {
    await exportPdf({
      title: "Revenue Trend Report",
      subtitle: "Actual collections over the last 12 months",
      rows: revenueRows.map((row) => ({
        Month: row.Month,
        Revenue: money(row.Revenue),
      })),
      totals: {
        "12-Month Revenue": revenueRows.reduce(
          (sum, row) => sum + Number(row.Revenue ?? 0),
          0
        ),
      },
    });
  }

  async function exportRevenueExcel() {
    await exportExcel({
      fileName: "Ruby_Rental_Revenue_Trend",
      rows: revenueRows,
    });
  }

  return (
    <div className="space-y-8">

      {/* KPI SUMMARY */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {[
          {
            title: "Revenue This Month",
            value: money(data.revenue),
          },
          {
            title: "Outstanding Rent",
            value: money(data.outstanding),
          },
          {
            title: "Collections Today",
            value: money(data.collections),
          },
          {
            title: "Collection Rate",
            value: `${data.collectionRate ?? 0}%`,
          },
          {
            title: "Recent Payments",
            value: data.recentPayments?.length ?? 0,
          },
          {
            title: "Outstanding Invoices",
            value: data.outstandingInvoices?.length ?? 0,
          },
        ].map((metric) => (
          <Card key={metric.title}>
            <p className="text-sm text-gray-500">
              {metric.title}
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              {metric.value}
            </h2>
          </Card>
        ))}
      </div>

      {/* PROPERTY REPORTS */}
      <div className="space-y-6">
        <PropertyRentRollCard
          rows={data.rentRoll ?? []}
        />

        <PropertyPerformanceCard
          rows={data.propertyPerformance ?? []}
        />
      </div>

      {/* OUTSTANDING BALANCES */}
      <OutstandingBalancesCard
        rows={data.outstandingBalances ?? []}
      />

      {/* RECEIVABLES AGING */}
      <Card>
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-xl font-bold">
              Receivables Aging
            </h2>

            <p className="text-sm text-gray-500">
              Outstanding balances grouped by age
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={exportAgingPdf}
            >
              Export PDF
            </Button>

            <Button
              variant="secondary"
              onClick={exportAgingExcel}
            >
              Export Excel
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-gray-500">
                <th className="px-3 py-3">Bucket</th>
                <th className="px-3 py-3 text-right">
                  Amount
                </th>
              </tr>
            </thead>

            <tbody>
              {agingRows.map((row) => (
                <tr
                  key={row.Bucket}
                  className="border-b last:border-0"
                >
                  <td className="px-3 py-3 font-medium">
                    {row.Bucket}
                  </td>

                  <td className="px-3 py-3 text-right font-semibold">
                    {money(row.Amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* CASH FLOW */}
      <Card>
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-xl font-bold">
              Cash Flow
            </h2>

            <p className="text-sm text-gray-500">
              Income, expenses and net cash position
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={exportCashFlowPdf}
            >
              Export PDF
            </Button>

            <Button
              variant="secondary"
              onClick={exportCashFlowExcel}
            >
              Export Excel
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-gray-500">
                <th className="px-3 py-3">Metric</th>
                <th className="px-3 py-3 text-right">
                  Amount
                </th>
              </tr>
            </thead>

            <tbody>
              {cashFlowRows.map((row) => (
                <tr
                  key={row.Metric}
                  className="border-b last:border-0"
                >
                  <td className="px-3 py-3 font-medium">
                    {row.Metric}
                  </td>

                  <td className="px-3 py-3 text-right font-semibold">
                    {money(row.Amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* REVENUE TREND */}
      <Card>
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-xl font-bold">
              Revenue Trend
            </h2>

            <p className="text-sm text-gray-500">
              Actual collections over the last 12 months
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={exportRevenuePdf}
            >
              Export PDF
            </Button>

            <Button
              variant="secondary"
              onClick={exportRevenueExcel}
            >
              Export Excel
            </Button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
          {data.revenueTrend.map((item) => (
            <div
              key={item.month}
              className="rounded-xl border p-4"
            >
              <p className="text-xs text-gray-500">
                {item.month}
              </p>

              <p className="mt-2 font-bold">
                {money(item.revenue)}
              </p>
            </div>
          ))}
        </div>
      </Card>

    </div>
  );
}
