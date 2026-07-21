"use client";

import { useState } from "react";
import { Search, ArrowRight } from "lucide-react";
import { matchImportedTransaction } from "@/services/reconciliation/matchImportedTransaction";

type Props = {
  transactions: any[];
};

export default function ReviewQueue({ transactions }: Props) {
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [search, setSearch] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function handleMatch(transactionId: string) {
    try {
      setLoadingId(transactionId);
      await matchImportedTransaction({
        transactionId,
        leaseId: selected[transactionId],
        amount: undefined,
        paymentMethod: "M-Pesa",
        referenceNumber: undefined,
        notes: undefined,
      });
      window.alert("Reconciliation request submitted.");
    } catch (error: any) {
      window.alert(error?.message ?? "Unable to reconcile transaction.");
    } finally {
      setLoadingId(null);
    }
  }

  const filtered = transactions.filter((transaction) => {
    const keyword = search.toLowerCase();
    return [transaction.reference_number, transaction.narration, transaction.sender_name, transaction.phone_number]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(keyword);
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3">
        <Search className="h-4 w-4 text-gray-400" />
        <input value={search} onChange={(event) => setSearch(event.target.value)} className="w-full border-0 bg-transparent outline-none" placeholder="Search review queue" />
      </div>
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-6 text-sm text-gray-500">No transactions are currently awaiting review.</div>
      ) : (
        filtered.map((transaction) => (
          <div key={transaction.id} className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm text-gray-500">{transaction.transaction_date}</p>
                <p className="text-lg font-semibold text-gray-900">{transaction.reference_number ?? transaction.narration ?? "Imported transaction"}</p>
                <p className="mt-2 text-sm text-gray-600">{transaction.narration ?? "No narration provided"}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full bg-gray-100 px-3 py-1">{transaction.phone_number ?? "-"}</span>
                  <span className="rounded-full bg-gray-100 px-3 py-1">{transaction.sender_name ?? "-"}</span>
                </div>
              </div>
              <div className="w-full max-w-sm">
                <label className="mb-2 block text-sm font-semibold">Lease ID</label>
                <input value={selected[transaction.id] ?? ""} onChange={(event) => setSelected((prev) => ({ ...prev, [transaction.id]: event.target.value }))} className="w-full rounded-2xl border border-gray-300 px-4 py-3" placeholder="Enter lease ID" />
                <button onClick={() => void handleMatch(transaction.id)} disabled={loadingId === transaction.id} className="mt-3 inline-flex items-center rounded-2xl bg-black px-4 py-3 text-sm font-semibold text-white">
                  {loadingId === transaction.id ? "Processing..." : "Reconcile"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
