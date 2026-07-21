"use client";

import InvoiceRow, {
  InvoiceRowData,
} from "./InvoiceRow";

type Props = {
  invoices: InvoiceRowData[];
};

export default function InvoicesList({
  invoices,
}: Props) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">

      <table className="min-w-full divide-y divide-gray-200">

        <thead className="bg-gray-50">

          <tr>

            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
              Invoice No.
            </th>

            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
              Tenant
            </th>

            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
              Property
            </th>

            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
              Unit
            </th>

            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
              Billing Period
            </th>

            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
              Due Date
            </th>

            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-600">
              Total
            </th>

            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-600">
              Paid
            </th>

            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-600">
              Balance
            </th>

            <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-600">
              Status
            </th>

            <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-600">
              Actions
            </th>

          </tr>

        </thead>

        <tbody className="divide-y divide-gray-100 bg-white">

          {invoices.map((invoice) => (
            <InvoiceRow
              key={invoice.id}
              invoice={invoice}
            />
          ))}

        </tbody>

      </table>

    </div>
  );
}
