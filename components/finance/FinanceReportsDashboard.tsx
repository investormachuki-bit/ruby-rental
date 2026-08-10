"use client";

import { useEffect, useState } from "react";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Loading from "@/components/ui/Loading";

import { getFinanceReports } from "@/services/reports/getFinanceReports";
import { exportPdf } from "@/services/reports/pdf/exportPdf";
import { exportExcel } from "@/services/reports/excel/exportExcel";

type FinanceReports = Awaited<
  ReturnType<typeof getFinanceReports>
>;

function money(value: number) {
  return `KES ${Number(value ?? 0).toLocaleString()}`;
}

function date(value?: string | null) {
  if (!value) return "-";

  return new Date(value).toLocaleDateString();
}

export default function FinanceReportsDashboard() {
  const [data, setData] =
    useState<FinanceReports | null>(null);

  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    loadReports();
  }, []);

  async function loadReports() {
    try {
      setLoading(true);

      const result =
        await getFinanceReports();

      setData(result);
    } catch (error) {
      console.error(
        "FINANCE REPORTS ERROR",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  async function exportSummaryPdf() {
    if (!data) return;

    try {
      setExporting(true);

      await exportPdf({
        title: "Ruby Rental Finance Report",
        subtitle:
          "Financial performance and outstanding balances",
        rows: [
          {
            Report: "Revenue This Month",
            Value: money(data.revenue),
          },
          {
            Report: "Outstanding Rent",
            Value: money(data.outstanding),
          },
          {
            Report: "Collections Today",
            Value: money(data.collections),
          },
          {
            Report: "Collection Rate",
            Value: `${data.collectionRate}%`,
          },
          {
            Report: "Total Cash Income",
            Value: money(data.cashFlow.totalIncome),
          },
          {
            Report: "Total Expenses",
            Value: money(data.cashFlow.totalExpenses),
          },
          {
            Report: "Net Cash Flow",
            Value: money(data.cashFlow.netCashFlow),
          },
        ],
      });
    } finally {
      setExporting(false);
    }
  }

  async function exportSummaryExcel() {
    if (!data) return;

    try {
      setExporting(true);

      await exportExcel({
        fileName:
          "Ruby_Rental_Finance_Report",
        rows: [
          {
            Report: "Revenue This Month",
            Value: data.revenue,
          },
          {
            Report: "Outstanding Rent",
            Value: data.outstanding,
          },
          {
            Report: "Collections Today",
            Value: data.collections,
          },
          {
            Report: "Collection Rate",
            Value: data.collectionRate,
          },
          {
            Report: "Total Cash Income",
            Value:
              data.cashFlow.totalIncome,
          },
          {
            Report: "Total Expenses",
            Value:
              data.cashFlow.totalExpenses,
          },
          {
            Report: "Net Cash Flow",
            Value:
              data.cashFlow.netCashFlow,
          },
        ],
      });
    } finally {
      setExporting(false);
    }
  }

  if (loading) {
    return (
      <Loading
        title="Loading finance reports..."
        description="Preparing your financial reports."
      />
    );
  }

  if (!data) {
    return (
      <Card>
        <div className="py-12 text-center">
          <h2 className="text-lg font-semibold">
            Unable to load reports
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            There was a problem loading your
            financial reports.
          </p>

          <div className="mt-5">
            <Button onClick={loadReports}>
              Try Again
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  const agingTotal =
    data.aging.current +
    data.aging.days30 +
    data.aging.days60 +
    data.aging.days90 +
    data.aging.over90;

  return (
    <div className="space-y-6">

      {/* Export actions */}

      <div className="flex flex-wrap items-center justify-between gap-3">

        <div>
          <h2 className="text-xl font-bold">
            Financial Reports
          </h2>

          <p className="text-sm text-gray-500">
            Monitor revenue, collections,
            receivables and cash flow.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={exportSummaryPdf}
            disabled={exporting}
          >
            Export PDF
          </Button>

          <Button
            variant="secondary"
            onClick={exportSummaryExcel}
            disabled={exporting}
          >
            Export Excel
          </Button>
        </div>

      </div>

      {/* Main KPIs */}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

        <Card>
          <p className="text-sm text-gray-500">
            Revenue This Month
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            {money(data.revenue)}
          </h2>

          <p className="mt-1 text-xs text-gray-400">
            Actual payments received
          </p>
        </Card>

        <Card>
          <p className="text-sm text-gray-500">
            Outstanding Rent
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            {money(data.outstanding)}
          </h2>

          <p className="mt-1 text-xs text-gray-400">
            Current tenant balances
          </p>
        </Card>

        <Card>
          <p className="text-sm text-gray-500">
            Collections Today
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            {money(data.collections)}
          </h2>

          <p className="mt-1 text-xs text-gray-400">
            Payments received today
          </p>
        </Card>

        <Card>
          <p className="text-sm text-gray-500">
            Collection Rate
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            {data.collectionRate}%
          </h2>

          <p className="mt-1 text-xs text-gray-400">
            Current billing cycle
          </p>
        </Card>

      </div>

      {/* Cash Flow */}

      <div className="grid gap-6 lg:grid-cols-3">

        <Card>
          <p className="text-sm text-gray-500">
            Total Income
          </p>

          <h2 className="mt-2 text-2xl font-bold text-green-600">
            {money(
              data.cashFlow.totalIncome
            )}
          </h2>

          <p className="mt-1 text-xs text-gray-400">
            {data.cashFlow.payments} payments
          </p>
        </Card>

        <Card>
          <p className="text-sm text-gray-500">
            Total Expenses
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            {money(
              data.cashFlow.totalExpenses
            )}
          </h2>

          <p className="mt-1 text-xs text-gray-400">
            {data.cashFlow.expenses} expenses
          </p>
        </Card>

        <Card>
          <p className="text-sm text-gray-500">
            Net Cash Flow
          </p>

          <h2
            className={`mt-2 text-2xl font-bold ${
              data.cashFlow.netCashFlow >= 0
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {money(
              data.cashFlow.netCashFlow
            )}
          </h2>

          <p className="mt-1 text-xs text-gray-400">
            Income less expenses
          </p>
        </Card>

      </div>

      {/* Aging Report */}

      <Card>

        <div className="mb-5 flex items-center justify-between">

          <div>
            <h2 className="text-lg font-bold">
              Receivables Aging
            </h2>

            <p className="text-sm text-gray-500">
              Outstanding balances by age
            </p>
          </div>

          <span className="font-semibold">
            {money(agingTotal)}
          </span>

        </div>

        <div className="grid gap-3 md:grid-cols-5">

          <AgingCard
            label="Current"
            value={data.aging.current}
          />

          <AgingCard
            label="1–30 Days"
            value={data.aging.days30}
          />

          <AgingCard
            label="31–60 Days"
            value={data.aging.days60}
          />

          <AgingCard
            label="61–90 Days"
            value={data.aging.days90}
          />

          <AgingCard
            label="90+ Days"
            value={data.aging.over90}
          />

        </div>

      </Card>

      {/* Revenue Trend */}

      <Card>

        <div className="mb-5">

          <h2 className="text-lg font-bold">
            Revenue Trend
          </h2>

          <p className="text-sm text-gray-500">
            Actual payments received over the
            last 12 months
          </p>

        </div>

        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-6">

          {data.revenueTrend.map((item) => (
            <div
              key={`${item.month}-${item.revenue}`}
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

      {/* Property Performance */}

      <Card>

        <div className="mb-5">

          <h2 className="text-lg font-bold">
            Property Performance
          </h2>

          <p className="text-sm text-gray-500">
            Occupancy, collections and outstanding
            balances by property.
          </p>

        </div>

        {data.propertyPerformance.length === 0 ? (

          <p className="py-8 text-center text-gray-400">
            No properties found.
          </p>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead>

                <tr className="border-b text-left text-gray-500">

                  <th className="px-3 py-3">
                    Property
                  </th>

                  <th className="px-3 py-3">
                    Units
                  </th>

                  <th className="px-3 py-3">
                    Occupied
                  </th>

                  <th className="px-3 py-3">
                    Vacant
                  </th>

                  <th className="px-3 py-3">
                    Occupancy
                  </th>

                  <th className="px-3 py-3 text-right">
                    Expected
                  </th>

                  <th className="px-3 py-3 text-right">
                    Collected
                  </th>

                  <th className="px-3 py-3 text-right">
                    Outstanding
                  </th>

                </tr>

              </thead>

              <tbody>

                {data.propertyPerformance.map(
                  (property) => (

                    <tr
                      key={property.id}
                      className="border-b last:border-0"
                    >

                      <td className="px-3 py-3 font-semibold">
                        {property.property}
                      </td>

                      <td className="px-3 py-3">
                        {property.totalUnits}
                      </td>

                      <td className="px-3 py-3">
                        {property.occupiedUnits}
                      </td>

                      <td className="px-3 py-3">
                        {property.vacantUnits}
                      </td>

                      <td className="px-3 py-3 font-semibold">
                        {property.occupancyRate}%
                      </td>

                      <td className="px-3 py-3 text-right">
                        {money(property.expectedRent)}
                      </td>

                      <td className="px-3 py-3 text-right font-semibold text-green-600">
                        {money(property.collectedRent)}
                      </td>

                      <td className="px-3 py-3 text-right font-semibold">
                        {money(property.outstandingRent)}
                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </Card>

      {/* Recent Payments */}

      <Card>

        <div className="mb-5">

          <h2 className="text-lg font-bold">
            Recent Payments
          </h2>

          <p className="text-sm text-gray-500">
            Latest payments received
          </p>

        </div>

        {data.recentPayments.length === 0 ? (
          <p className="py-8 text-center text-gray-400">
            No payments found.
          </p>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="px-3 py-3">
                    Date
                  </th>
                  <th className="px-3 py-3">
                    Tenant
                  </th>
                  <th className="px-3 py-3">
                    Reference
                  </th>
                  <th className="px-3 py-3">
                    Method
                  </th>
                  <th className="px-3 py-3 text-right">
                    Amount
                  </th>
                </tr>
              </thead>

              <tbody>

                {data.recentPayments.map(
                  (payment) => (
                    <tr
                      key={payment.id}
                      className="border-b last:border-0"
                    >
                      <td className="px-3 py-3">
                        {date(
                          payment.payment_date
                        )}
                      </td>

                      <td className="px-3 py-3 font-medium">
                        {payment.tenant_name}
                      </td>

                      <td className="px-3 py-3">
                        {payment.reference_number ??
                          payment.receipt_number ??
                          "-"}
                      </td>

                      <td className="px-3 py-3">
                        {payment.payment_method ??
                          "-"}
                      </td>

                      <td className="px-3 py-3 text-right font-semibold text-green-600">
                        {money(payment.amount)}
                      </td>
                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>
        )}

      </Card>

      {/* Outstanding Invoices */}

      <Card>

        <div className="mb-5 flex items-center justify-between">

          <div>
            <h2 className="text-lg font-bold">
              Outstanding Invoices
            </h2>

            <p className="text-sm text-gray-500">
              Invoices with unpaid balances
            </p>
          </div>

          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold">
            {data.outstandingInvoices.length}
          </span>

        </div>

        {data.outstandingInvoices.length === 0 ? (
          <p className="py-8 text-center text-gray-400">
            No outstanding invoices.
          </p>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="px-3 py-3">
                    Invoice
                  </th>
                  <th className="px-3 py-3">
                    Tenant
                  </th>
                  <th className="px-3 py-3">
                    Property
                  </th>
                  <th className="px-3 py-3">
                    Due
                  </th>
                  <th className="px-3 py-3 text-right">
                    Balance
                  </th>
                </tr>
              </thead>

              <tbody>

                {data.outstandingInvoices.map(
                  (invoice) => (
                    <tr
                      key={invoice.id}
                      className="border-b last:border-0"
                    >
                      <td className="px-3 py-3 font-medium">
                        {invoice.invoice_number}
                      </td>

                      <td className="px-3 py-3">
                        {invoice.tenant_name}
                      </td>

                      <td className="px-3 py-3">
                        {invoice.property_name}
                      </td>

                      <td className="px-3 py-3">
                        {date(invoice.due_date)}
                      </td>

                      <td className="px-3 py-3 text-right font-semibold">
                        {money(invoice.balance)}
                      </td>
                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>
        )}

      </Card>

    </div>
  );
}

function AgingCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border p-4">
      <p className="text-xs text-gray-500">
        {label}
      </p>

      <p className="mt-2 font-bold">
        {money(value)}
      </p>
    </div>
  );
}
