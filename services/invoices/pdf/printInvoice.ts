import { buildInvoicePdf } from "./buildInvoicePdf";
import { getInvoiceDetails } from "@/services/invoices/getInvoiceDetails";

export async function printInvoice(invoiceId: string) {
  const invoice = await getInvoiceDetails(invoiceId);
  const pdf = await buildInvoicePdf(invoice);

  const url = pdf.output("bloburl");
  const printWindow = window.open(url, "_blank");

  if (!printWindow) {
    throw new Error("Popup blocked. Please allow popups to print the invoice.");
  }
}
