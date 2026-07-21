"use client";

type Props = {
  transaction: any | null;
  onClose: () => void;
};

export default function TransactionDetailsDrawer({ transaction, onClose }: Props) {
  if (!transaction) return null;

  return (
    <div className="fixed inset-0 z-[70] flex justify-end bg-black/50">
      <div className="h-full w-full max-w-xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold">Transaction Details</h3>
            <p className="text-sm text-gray-500">Imported statement transaction</p>
          </div>
          <button onClick={onClose} className="text-sm text-gray-500">Close</button>
        </div>

        <div className="mt-6 space-y-4 text-sm text-gray-700">
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500">Reference</p>
            <p className="mt-1 font-semibold">{transaction.reference_number ?? "-"}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500">Narration</p>
            <p className="mt-1 font-semibold">{transaction.narration ?? "-"}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500">Amount</p>
            <p className="mt-1 font-semibold">KSh {Number(transaction.amount ?? 0).toLocaleString()}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500">Status</p>
            <p className="mt-1 font-semibold">{transaction.status}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
