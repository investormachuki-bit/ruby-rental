"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";

type Props = {
  transactions: any[];
};

export default function ImportedTransactionsTable({ transactions }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Date</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Reference</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Narration</th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-600">Amount</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Status</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Confidence</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="hover:bg-gray-50">
              <td className="px-4 py-4 text-sm text-gray-700">{transaction.transaction_date}</td>
              <td className="px-4 py-4 text-sm font-medium text-gray-900">{transaction.reference_number ?? "-"}</td>
              <td className="px-4 py-4 text-sm text-gray-700">{transaction.narration ?? "-"}</td>
              <td className="px-4 py-4 text-right text-sm font-semibold">KSh {Number(transaction.amount ?? 0).toLocaleString()}</td>
              <td className="px-4 py-4 text-sm">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${transaction.status === "Reconciled" ? "bg-green-100 text-green-700" : transaction.status === "Needs Review" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-700"}`}>
                  {transaction.status}
                </span>
              </td>
              <td className="px-4 py-4 text-sm text-gray-700">{transaction.confidence_score ?? 0}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
