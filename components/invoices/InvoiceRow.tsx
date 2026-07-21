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
    <tr className="border-b border-gray-100 transition hover:bg-gray-50">
      <td className="px-4 py-4 font-semibold text-gray-900">{invoice.invoice_number}</td>
      <td className="px-4 py-4">{invoice.tenant_name}</td>
      <td className="px-4 py-4">{invoice.property_name}</td>
      <td className="px-4 py-4">{invoice.unit_number}</td>
      <td className="px-4 py-4">{invoice.billing_period}</td>
      <td className="px-4 py-4">{invoice.due_date}</td>
      <td className="px-4 py-4 text-right">KSh {invoice.amount.toLocaleString()}</td>
      <td className="px-4 py-4 text-right">KSh {invoice.amount_paid.toLocaleString()}</td>
      <td className="px-4 py-4 text-right font-semibold">KSh {invoice.balance.toLocaleString()}</td>
      <td className="px-4 py-4">
        <InvoiceStatusBadge status={invoice.status} />
      </td>
      <td className="px-4 py-4">
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
