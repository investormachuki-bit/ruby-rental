"use client";

type Props = {
  transactions: any[];
};

function statusClass(status: string) {
  return status === "Reconciled"
    ? "bg-green-100 text-green-700"
    : status === "Needs Review"
      ? "bg-amber-100 text-amber-700"
      : "bg-gray-100 text-gray-700";
}

export default function ImportedTransactionsTable({ transactions }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
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
                <td className="px-4 py-4 text-sm"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(transaction.status)}`}>{transaction.status}</span></td>
                <td className="px-4 py-4 text-sm text-gray-700">{transaction.confidence_score ?? 0}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile — invoice-style cards */}
      <div className="space-y-3 p-3 md:hidden">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="grid grid-cols-[1.05fr_0.9fr_auto] gap-3">
              <div className="min-w-0">
                <p className="text-xs text-gray-400">{transaction.transaction_date}</p>
                <p className="mt-1 truncate font-semibold text-gray-900">{transaction.reference_number ?? "No reference"}</p>
                <p className="mt-1 line-clamp-2 text-xs text-gray-500">{transaction.narration ?? "-"}</p>
              </div>
              <div className="min-w-0 text-right">
                <p className="text-[10px] uppercase tracking-wide text-gray-400">Amount</p>
                <p className="mt-1 font-semibold text-gray-900">KSh {Number(transaction.amount ?? 0).toLocaleString()}</p>
                <p className="mt-2 text-[10px] uppercase tracking-wide text-gray-400">Confidence</p>
                <p className="mt-1 text-xs font-medium text-gray-700">{transaction.confidence_score ?? 0}%</p>
              </div>
              <div className="flex min-w-[72px] items-start justify-end">
                <span className={`inline-flex rounded-full px-2 py-1 text-[10px] font-semibold ${statusClass(transaction.status)}`}>{transaction.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
