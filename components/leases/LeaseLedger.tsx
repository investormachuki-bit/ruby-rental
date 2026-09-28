"use client";

import { useEffect, useState } from "react";
import { getLeaseLedger, type LeaseLedgerEntry } from "@/services/leases/getLeaseLedger";

type Props = { leaseId: string };

export default function LeaseLedger({ leaseId }: Props) {
  const [ledger, setLedger] = useState<LeaseLedgerEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadLedger(); }, []);

  async function loadLedger() {
    try { setLoading(true); setLedger(await getLeaseLedger(leaseId)); }
    catch (error) { console.error(error); }
    finally { setLoading(false); }
  }

  const totalDebits = ledger.reduce((sum, item) => sum + item.debit, 0);
  const totalCredits = ledger.reduce((sum, item) => sum + item.credit, 0);
  const closingBalance = ledger.length > 0 ? ledger[ledger.length - 1].balance : 0;

  if (loading) return <div className="rounded-2xl border bg-white p-12 text-center">Loading ledger...</div>;
  if (ledger.length === 0) return <div className="rounded-2xl border bg-white p-12 text-center text-gray-500">No financial transactions found for this lease.</div>;

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b p-5 sm:p-6">
        <h2 className="text-xl font-bold">Lease Ledger</h2>
        <p className="mt-1 text-sm text-gray-500">Complete financial history for this lease.</p>
      </div>

      <table className="w-full table-fixed">
        <thead className="bg-gray-50/80">
          <tr>
            <th className="w-[20%] px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 sm:px-4">Date / Type</th>
            <th className="w-[34%] px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 sm:px-4">Reference / Description</th>
            <th className="w-[26%] px-3 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500 sm:px-4">Movement</th>
            <th className="w-[20%] px-3 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500 sm:px-4">Balance</th>
          </tr>
        </thead>
        <tbody>
          {ledger.map((entry) => (
            <tr key={`${entry.type}-${entry.id}`} className="border-b border-gray-100 last:border-0 transition hover:bg-gray-50">
              <td className="px-3 py-4 align-middle sm:px-4">
                <p className="font-medium text-gray-800">{entry.date}</p>
                <span className={`mt-1 inline-flex rounded-full px-2 py-1 text-xs font-semibold ${entry.type === "Invoice" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>{entry.type}</span>
              </td>
              <td className="px-3 py-4 align-middle sm:px-4">
                <p className="font-semibold text-gray-900">{entry.reference}</p>
                <p className="mt-1 line-clamp-2 text-xs text-gray-500">{entry.description}</p>
              </td>
              <td className="px-3 py-4 text-right align-middle sm:px-4">
                {entry.debit > 0 && <p className="font-semibold text-gray-900">Debit KSh {entry.debit.toLocaleString()}</p>}
                {entry.credit > 0 && <p className="mt-1 font-semibold text-green-700">Credit KSh {entry.credit.toLocaleString()}</p>}
                {entry.debit === 0 && entry.credit === 0 && <p className="text-gray-400">—</p>}
              </td>
              <td className={`px-3 py-4 text-right align-middle font-bold sm:px-4 ${entry.balance > 0 ? "text-red-600" : "text-green-600"}`}>
                KSh {entry.balance.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot className="border-t bg-gray-50">
          <tr>
            <td colSpan={2} className="px-3 py-4 text-right font-bold sm:px-4">Totals</td>
            <td className="px-3 py-4 text-right sm:px-4">
              <p className="font-bold">KSh {totalDebits.toLocaleString()}</p>
              <p className="mt-1 font-bold text-green-700">KSh {totalCredits.toLocaleString()}</p>
            </td>
            <td className={`px-3 py-4 text-right text-lg font-bold sm:px-4 ${closingBalance > 0 ? "text-red-600" : "text-green-600"}`}>KSh {closingBalance.toLocaleString()}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
