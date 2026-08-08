"use client";

import InvoiceStatusBadge from "./InvoiceStatusBadge";
import InvoiceActions from "./InvoiceActions";

export type InvoiceRowData = {
  id: string;
  invoice_number: string;
  tenant_name: string;
  tenant_id?: string | null;
  property_name: string;
  property_id?: string | null;
  unit_number: string;
  unit_id?: string | null;
  billing_period: string;
  invoice_date: string;
  due_date: string;
  amount: number;
  amount_paid: number;
  balance: number;
  status: string;
};

type Props = {
  invoice: InvoiceRowData;
  onView?: (invoiceId: string) => void;
  onRecordPayment?: (invoiceId: string) => void;
  onDownload?: (invoiceId: string) => void;
  onPrint?: (invoiceId: string) => void;
  onDuplicate?: (invoiceId: string) => void;
  onCancel?: (invoiceId: string) => void;
};

function money(value: number) {
  return `KSh ${Number(value ?? 0).toLocaleString()}`;
}

function formatDate(value: string) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function InvoiceRow({
  invoice,
  onView,
  onRecordPayment,
  onDownload,
  onPrint,
  onDuplicate,
  onCancel,
}: Props) {
  return (
    <tr className="group border-b border-gray-100 transition hover:bg-gray-50/80">

      {/* Invoice */}
      <td className="px-5 py-4 align-middle">
        <div>
          <button
            type="button"
            onClick={() => onView?.(invoice.id)}
            className="font-semibold text-gray-900 transition hover:text-[#B8962E]"
          >
            {invoice.invoice_number}
          </button>

          <p className="mt-1 text-xs text-gray-400">
            {invoice.billing_period}
          </p>
        </div>
      </td>

      {/* Tenant */}
      <td className="px-5 py-4 align-middle">
        <div className="flex items-center gap-3">

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-700">
            {(invoice.tenant_name || "?")
              .charAt(0)
              .toUpperCase()}
          </div>

          <div className="min-w-0">
            <p className="truncate font-semibold text-gray-900">
              {invoice.tenant_name || "Unknown Tenant"}
            </p>

            <p className="truncate text-xs text-gray-500">
              {invoice.property_name} · Unit {invoice.unit_number}
            </p>
          </div>

        </div>
      </td>

      {/* Due */}
      <td className="px-5 py-4 align-middle whitespace-nowrap">
        <p className="text-sm font-medium text-gray-800">
          {formatDate(invoice.due_date)}
        </p>

        <p className="mt-1 text-xs text-gray-400">
          Issued {formatDate(invoice.invoice_date)}
        </p>
      </td>

      {/* Amount */}
      <td className="px-5 py-4 text-right align-middle">
        <p className="font-semibold text-gray-900">
          {money(invoice.amount)}
        </p>

        <p className="mt-1 text-xs text-gray-400">
          Paid {money(invoice.amount_paid)}
        </p>
      </td>

      {/* Balance */}
      <td className="px-5 py-4 text-right align-middle">
        <p
          className={`text-base font-bold ${
            invoice.balance > 0
              ? "text-gray-900"
              : "text-green-600"
          }`}
        >
          {money(invoice.balance)}
        </p>

        <p className="mt-1 text-xs text-gray-400">
          {invoice.balance > 0
            ? "Balance due"
            : "Fully settled"}
        </p>
      </td>

      {/* Status */}
      <td className="px-5 py-4 align-middle">
        <InvoiceStatusBadge status={invoice.status} />
      </td>

      {/* Actions */}
      <td className="px-5 py-4 text-right align-middle">
        <InvoiceActions
          invoiceId={invoice.id}
          status={invoice.status}
          onView={onView}
          onRecordPayment={onRecordPayment}
          onDownload={onDownload}
          onPrint={onPrint}
          onDuplicate={onDuplicate}
          onCancel={onCancel}
        />
      </td>

    </tr>
  );
}
