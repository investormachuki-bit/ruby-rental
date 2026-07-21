"use client";

import InvoiceStatusBadge from "./InvoiceStatusBadge";
import InvoiceActions from "./InvoiceActions";

export type InvoiceRowData = {
  id: string;
  invoice_number: string;
  tenant_name: string;
  property_name: string;
  unit_number: string;
  billing_period: string;
  due_date: string;
  amount: number;
  amount_paid: number;
  balance: number;
  status: string;
};

type Props = {
  invoice: InvoiceRowData;
};

export default function InvoiceRow({
  invoice,
}: Props) {

  return (

    <tr className="border-b hover:bg-gray-50 transition">

      <td className="px-4 py-4 font-medium">
        {invoice.invoice_number}
      </td>

      <td className="px-4 py-4">
        {invoice.tenant_name}
      </td>

      <td className="px-4 py-4">
        {invoice.property_name}
      </td>

      <td className="px-4 py-4">
        {invoice.unit_number}
      </td>

      <td className="px-4 py-4">
        {invoice.billing_period}
      </td>

      <td className="px-4 py-4">
        {invoice.due_date}
      </td>

      <td className="px-4 py-4 text-right">
        {invoice.amount.toLocaleString()}
      </td>

      <td className="px-4 py-4 text-right">
        {invoice.amount_paid.toLocaleString()}
      </td>

      <td className="px-4 py-4 text-right font-semibold">
        {invoice.balance.toLocaleString()}
      </td>

      <td className="px-4 py-4">
        <InvoiceStatusBadge
          status={invoice.status}
        />
      </td>

      <td className="px-4 py-4">

        <InvoiceActions
          invoiceId={invoice.id}
        />

      </td>

    </tr>

  );

}
