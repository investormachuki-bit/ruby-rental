"use client";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

import { exportPdf } from "@/services/reports/pdf/exportPdf";
import { exportExcel } from "@/services/reports/excel/exportExcel";

export type OutstandingBalanceRow = {
  invoice_number: string;
  tenant: string;
  property: string;
  unit: string;
  billing_period: string;
  due_date: string;
  amount: number;
  amount_paid: number;
  balance: number;
  status: string;
};

type Props = {
  rows: OutstandingBalanceRow[];
};

function money(value: number) {
  return `KES ${Number(value ?? 0).toLocaleString("en-KE")}`;
}

export default function OutstandingBalancesCard({ rows }: Props) {
  const totalOutstanding = rows.reduce(
    (sum, row) => sum + Number(row.balance ?? 0),
    0
  );

  async function handlePdf() {
    await exportPdf({
      title: "Outstanding Balances",
      subtitle: "Outstanding tenant invoices and receivables",
      rows: rows.map((row) => ({
        Invoice: row.invoice_number,
        Tenant: row.tenant,
        Property: row.property,
        Unit: row.unit,
        "Billing Period": row.billing_period,
        "Due Date": row.due_date,
        Amount: money(row.amount),
        Paid: money(row.amount_paid),
        Balance: money(row.balance),
        Status: row.status,
      })),
      totals: {
        "Total Outstanding": totalOutstanding,
      },
    });
  }

  async function handleExcel() {
    await exportExcel({
      fileName: "Ruby_Rental_Outstanding_Balances",
      rows: rows.map((row) => ({
        Invoice: row.invoice_number,
        Tenant: row.tenant,
        Property: row.property,
        Unit: row.unit,
        "Billing Period": row.billing_period,
        "Due Date": row.due_date,
        Amount: row.amount,
        Paid: row.amount_paid,
        Balance: row.balance,
        Status: row.status,
      })),
    });
  }

  return (
    <Card>
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-bold">
            Outstanding Balances
          </h2>

          <p className="text-sm text-gray-500">
            Tenant receivables requiring collection
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={handlePdf}
          >
            Export PDF
          </Button>

          <Button
            variant="secondary"
            onClick={handleExcel}
          >
            Export Excel
          </Button>
        </div>
      </div>

      <div className="mb-5 rounded-2xl border border-[#D4AF37]/30 bg-[#D4AF37]/5 p-5">
        <p className="text-sm text-gray-500">
          Total Outstanding
        </p>

        <p className="mt-1 text-2xl font-bold">
          {money(totalOutstanding)}
        </p>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-xl border p-8 text-center text-gray-500">
          No outstanding balances.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr className="border-b text-left text-gray-500">
                <th className="px-3 py-3">Invoice</th>
                <th className="px-3 py-3">Tenant</th>
                <th className="px-3 py-3">Property</th>
                <th className="px-3 py-3">Unit</th>
                <th className="px-3 py-3">Due Date</th>
                <th className="px-3 py-3 text-right">
                  Amount
                </th>
                <th className="px-3 py-3 text-right">
                  Paid
                </th>
                <th className="px-3 py-3 text-right">
                  Balance
                </th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.invoice_number}
                  className="border-b last:border-0"
                >
                  <td className="px-3 py-3 font-semibold">
                    {row.invoice_number}
                  </td>

                  <td className="px-3 py-3">
                    {row.tenant}
                  </td>

                  <td className="px-3 py-3">
                    {row.property}
                  </td>

                  <td className="px-3 py-3">
                    {row.unit}
                  </td>

                  <td className="px-3 py-3">
                    {row.due_date || "-"}
                  </td>

                  <td className="px-3 py-3 text-right">
                    {money(row.amount)}
                  </td>

                  <td className="px-3 py-3 text-right">
                    {money(row.amount_paid)}
                  </td>

                  <td className="px-3 py-3 text-right font-bold">
                    {money(row.balance)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
