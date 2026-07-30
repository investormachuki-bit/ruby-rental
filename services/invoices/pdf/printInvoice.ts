import { buildInvoicePdf } from "./buildInvoicePdf";

import { getInvoiceDetails } from "@/services/invoices/getInvoiceDetails";

export async function printInvoice(
  invoiceId: string
) {

  const invoice =
    await getInvoiceDetails(
      invoiceId
    );

  const pdf =
    await buildInvoicePdf(
      invoice
    );

  pdf.autoPrint();

  window.open(
    pdf.output("bloburl"),
    "_blank"
  );

}
