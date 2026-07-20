"use client";

interface Payment {
  id: string;
  payment_date: string;
  receipt_number?: string;
  payment_method?: string;
  amount: number;
  status?: string;
  invoice?: {
    invoice_number?: string;
  };
}

interface Props {
  payments: Payment[];
}

export default function TenantPaymentsTable({
  payments,
}: Props) {
  if (!payments.length) {
    return (
      <div className="rounded-xl border border-dashed p-12 text-center">
        <h3 className="text-lg font-semibold">
          No Payments Recorded
        </h3>

        <p className="mt-2 text-gray-500">
          Payments received from this tenant will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border">

      <table className="min-w-full">

        <thead className="bg-[#111827] text-white">

          <tr>
            <th className="px-4 py-3 text-left">
              Date
            </th>

            <th className="px-4 py-3 text-left">
              Receipt
            </th>

            <th className="px-4 py-3 text-left">
              Invoice
            </th>

            <th className="px-4 py-3 text-left">
              Method
            </th>

            <th className="px-4 py-3 text-right">
              Amount
            </th>

            <th className="px-4 py-3 text-center">
              Status
            </th>

          </tr>

        </thead>

        <tbody>

          {payments.map((payment) => (

            <tr
              key={payment.id}
              className="border-t hover:bg-gray-50"
            >

              <td className="px-4 py-3">
                {payment.payment_date}
              </td>

              <td className="px-4 py-3">
                {payment.receipt_number ?? "-"}
              </td>

              <td className="px-4 py-3">
                {payment.invoice?.invoice_number ?? "-"}
              </td>

              <td className="px-4 py-3">
                {payment.payment_method ?? "-"}
              </td>

              <td className="px-4 py-3 text-right font-semibold">
                KSh{" "}
                {Number(payment.amount).toLocaleString()}
              </td>

              <td className="px-4 py-3 text-center">

                <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">

                  {payment.status ?? "Completed"}

                </span>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}
