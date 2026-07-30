import { buildInvoicePdf } from "./buildInvoicePdf";

import { getInvoiceDetails } from "@/services/invoices/getInvoiceDetails";

export async function downloadInvoicePdf(
  invoiceId: string
) {
  try {

    const invoice =
      await getInvoiceDetails(
        invoiceId
      );

    const pdf =
      await buildInvoicePdf(
        invoice
      );

    pdf.save(

      `${invoice.invoice_number}.pdf`

    );

  } catch (error) {

    console.error(
      "DOWNLOAD PDF ERROR",
      error
    );

    throw error;

  }
}
