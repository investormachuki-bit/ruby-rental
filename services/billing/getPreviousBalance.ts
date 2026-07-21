import type { LeaseDetails } from "@/types/lease";

import type { InvoiceLineItem } from "./types";

import { getLeaseInvoices } from "@/services/invoices/getLeaseInvoices";

export async function getPreviousBalance(
  lease: LeaseDetails
): Promise<InvoiceLineItem[]> {

  const items: InvoiceLineItem[] = [];

  const invoices =
    await getLeaseInvoices(lease.id);

  const outstandingInvoices =
    invoices.filter(

      invoice =>

        invoice.status !== "Paid" &&

        Number(invoice.balance_due) > 0

    );

  const outstandingBalance =
    outstandingInvoices.reduce(

      (
        total,
        invoice
      ) =>

        total +
        Number(invoice.balance_due),

      0

    );
    if (outstandingBalance <= 0) {
    return items;
  }

  items.push({

    item_type: "Other",

    description:
      "Previous Outstanding Balance",

    quantity: 1,

    unit_price:
      outstandingBalance,

  });

  return items;

}
