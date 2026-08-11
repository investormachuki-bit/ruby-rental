"use client";

import { useEffect, useState } from "react";

import Card from "@/components/ui/Card";
import Loading from "@/components/ui/Loading";

import { getFinanceReports } from "@/services/reports/getFinanceReports";
import PropertyRentRollCard from "./reports/PropertyRentRollCard";
import PropertyPerformanceCard from "./reports/PropertyPerformanceCard";

type ReportData = Awaited<ReturnType<typeof getFinanceReports>>;

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
        <div className="py-12 text-center text-gray-500">
          Unable to load finance reports.
        </div>
      </Card>
    );
  }

  const metrics = [
    {
      title: "Revenue This Month",
      value: `KES ${Number(data.revenue ?? 0).toLocaleString()}`,
    },
    {
      title: "Outstanding Rent",
      value: `KES ${Number(data.outstanding ?? 0).toLocaleString()}`,
    },
    {
      title: "Collections Today",
      value: `KES ${Number(data.collections ?? 0).toLocaleString()}`,
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

  return (
    <div className="space-y-6">
      {/* KPI CARDS */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {metrics.map((metric) => (
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

      {/* PROPERTY RENT ROLL */}
      <PropertyRentRollCard
        rows={data.rentRoll ?? []}
      />

      <PropertyPerformanceCard
        rows={data.propertyPerformance ?? []}
      />

      {/* AGING REPORT */}
      <Card>
        <div className="mb-5">
          <h2 className="text-xl font-bold">
            Receivables Aging
          </h2>

          <p className="text-sm text-gray-500">
            Outstanding balances grouped by age
          </p>
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
                    KES {Number(row.Amount ?? 0).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* CASH FLOW */}
      <Card>
        <div className="mb-5">
          <h2 className="text-xl font-bold">
            Cash Flow
          </h2>

          <p className="text-sm text-gray-500">
            Income, expenses and net cash position
          </p>
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
                    KES {Number(row.Amount ?? 0).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* REVENUE TREND */}
      <Card>
        <div className="mb-5">
          <h2 className="text-xl font-bold">
            Revenue Trend
          </h2>

          <p className="text-sm text-gray-500">
            Actual collections over the last 12 months
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
          {data.revenueTrend.map(
            (item: { month: string; revenue: number }) => (
              <div
                key={item.month}
                className="rounded-xl border p-4"
              >
                <p className="text-xs text-gray-500">
                  {item.month}
                </p>

                <p className="mt-2 font-bold">
                  KES{" "}
                  {Number(item.revenue ?? 0).toLocaleString()}
                </p>
              </div>
            )
          )}
        </div>
      </Card>
    </div>
  );
}
