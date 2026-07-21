import InvoiceDetailsPage from "@/components/invoices/InvoiceDetailsPage";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <InvoiceDetailsPage invoiceId={id} />;
}
