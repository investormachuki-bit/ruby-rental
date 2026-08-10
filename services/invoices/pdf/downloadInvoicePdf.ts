import { buildInvoicePdf } from "./buildInvoicePdf";
import { getInvoiceDetails } from "@/services/invoices/getInvoiceDetails";

export async function getInvoicePdfBlob(invoiceId: string) {
  const invoice = await getInvoiceDetails(invoiceId);
  const pdf = await buildInvoicePdf(invoice);

  return {
    blob: pdf.output("blob"),
    fileName: `${invoice.invoice_number}.pdf`,
    invoice,
  };
}

export async function downloadInvoicePdf(invoiceId: string) {
  try {
    const { blob, fileName } =
      await getInvoicePdfBlob(invoiceId);

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);
  } catch (error) {
    console.error(
      "DOWNLOAD PDF ERROR",
      error
    );

    throw error;
  }
}
