import InvoiceDetailsPage from "@/components/invoices/InvoiceDetailsPage";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <InvoiceDetailsPage invoiceId={(await params).id} />;
}
