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

type Props = { rows: OutstandingBalanceRow[] };

function money(value: number) {
  return `KES ${Number(value ?? 0).toLocaleString("en-KE")}`;
}

function formatDate(value: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export default function OutstandingBalancesCard({ rows }: Props) {
  const totalOutstanding = rows.reduce((sum, row) => sum + Number(row.balance ?? 0), 0);

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
      totals: { "Total Outstanding": totalOutstanding },
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
          <h2 className="text-xl font-bold">Outstanding Balances</h2>
          <p className="text-sm text-gray-500">Tenant receivables requiring collection</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handlePdf}>Export PDF</Button>
          <Button variant="secondary" onClick={handleExcel}>Export Excel</Button>
        </div>
      </div>

      <div className="mb-5 rounded-2xl border border-[#D4AF37]/30 bg-[#D4AF37]/5 p-5">
        <p className="text-sm text-gray-500">Total Outstanding</p>
        <p className="mt-1 text-2xl font-bold">{money(totalOutstanding)}</p>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-xl border p-8 text-center text-gray-500">No outstanding balances.</div>
      ) : (
        <>
          {/* Desktop */}
          <div className="hidden md:block overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <table className="w-full table-fixed text-sm">
              <thead className="bg-gray-50/80">
                <tr>
                  <th className="w-[32%] px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Invoice / Tenant</th>
                  <th className="w-[18%] px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Due</th>
                  <th className="w-[32%] px-3 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">Financial</th>
                  <th className="w-[18%] px-3 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.invoice_number} className="border-b border-gray-100 last:border-0 transition hover:bg-gray-50">
                    <td className="px-3 py-4 align-middle">
                      <p className="font-semibold text-gray-900">{row.invoice_number}</p>
                      <p className="mt-1 truncate text-gray-700">{row.tenant}</p>
                      <p className="mt-1 truncate text-xs text-gray-400">{row.property} · Unit {row.unit}</p>
                    </td>
                    <td className="px-3 py-4 align-middle">
                      <p className="font-medium text-gray-800">{formatDate(row.due_date)}</p>
                      <p className="mt-1 text-xs text-gray-400">{row.billing_period}</p>
                    </td>
                    <td className="px-3 py-4 text-right align-middle">
                      <p className="font-semibold text-gray-900">{money(row.amount)}</p>
                      <p className="mt-1 text-xs text-gray-400">Paid {money(row.amount_paid)}</p>
                      <p className={`mt-1 text-sm font-bold ${row.balance > 0 ? "text-gray-900" : "text-green-600"}`}>Balance {money(row.balance)}</p>
                    </td>
                    <td className="px-3 py-4 text-center align-middle">
                      <span className="inline-flex max-w-full rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">{row.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile — invoice-style cards */}
          <div className="space-y-3 md:hidden">
            {rows.map((row) => (
              <div key={row.invoice_number} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="grid grid-cols-[1.1fr_0.9fr_1fr_auto] gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-gray-900">{row.invoice_number}</p>
                    <p className="mt-1 truncate text-sm text-gray-700">{row.tenant}</p>
                    <p className="mt-1 truncate text-xs text-gray-400">{row.property} · Unit {row.unit}</p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-wide text-gray-400">Due</p>
                    <p className="mt-1 text-xs font-medium text-gray-800">{formatDate(row.due_date)}</p>
                    <p className="mt-1 text-[10px] text-gray-400">{row.billing_period}</p>
                  </div>
                  <div className="min-w-0 text-right">
                    <p className="text-[10px] uppercase tracking-wide text-gray-400">Financial</p>
                    <p className="mt-1 text-xs font-semibold text-gray-900">{money(row.amount)}</p>
                    <p className="mt-1 text-[10px] text-gray-400">Paid {money(row.amount_paid)}</p>
                    <p className={`mt-1 text-xs font-bold ${row.balance > 0 ? "text-gray-900" : "text-green-600"}`}>{money(row.balance)} due</p>
                  </div>
                  <div className="flex min-w-[58px] items-start justify-end">
                    <span className="inline-flex rounded-full bg-gray-100 px-2 py-1 text-[10px] font-medium text-gray-700">{row.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </Card>
  );
}
