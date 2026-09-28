"use client";

interface Payment {
  id: string;
  payment_date: string;
  receipt_number?: string;
  payment_method?: string;
  amount: number;
  status?: string;
  invoice?: { invoice_number?: string };
}

interface Props { payments: Payment[]; }

function formatDate(value: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export default function TenantPaymentsTable({ payments }: Props) {
  if (!payments.length) {
    return (
      <div className="rounded-xl border border-dashed p-12 text-center">
        <h3 className="text-lg font-semibold">No Payments Recorded</h3>
        <p className="mt-2 text-gray-500">Payments received from this tenant will appear here.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full table-fixed">
        <thead className="bg-gray-50/80">
          <tr>
            <th className="w-[28%] px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 sm:px-4">Payment</th>
            <th className="w-[26%] px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 sm:px-4">Invoice / Receipt</th>
            <th className="w-[18%] px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 sm:px-4">Method</th>
            <th className="w-[16%] px-3 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500 sm:px-4">Amount</th>
            <th className="w-[12%] px-3 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500 sm:px-4">Status</th>
          </tr>
        </thead>

        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id} className="border-b border-gray-100 last:border-0 transition hover:bg-gray-50">
              <td className="px-3 py-4 align-middle sm:px-4">
                <p className="font-semibold text-gray-900">{formatDate(payment.payment_date)}</p>
                <p className="mt-1 text-xs text-gray-400">Payment received</p>
              </td>
              <td className="px-3 py-4 align-middle sm:px-4">
                <p className="font-medium text-gray-800">{payment.invoice?.invoice_number ?? "No invoice"}</p>
                <p className="mt-1 text-xs text-gray-500">{payment.receipt_number ?? "No receipt"}</p>
              </td>
              <td className="px-3 py-4 align-middle text-gray-700 sm:px-4">{payment.payment_method ?? "-"}</td>
              <td className="px-3 py-4 text-right align-middle font-semibold text-gray-900 sm:px-4">KSh {Number(payment.amount).toLocaleString()}</td>
              <td className="px-3 py-4 text-center align-middle sm:px-4">
                <span className="inline-flex max-w-full rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">{payment.status ?? "Completed"}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
