import { supabase } from "@/lib/supabase";

export async function cancelInvoice(
  invoiceId: string,
  reason: string
) {
  const cleanReason = reason.trim();

  if (!cleanReason) {
    throw new Error("A cancellation reason is required.");
  }

  const {
    data: invoice,
    error: invoiceError,
  } = await supabase
    .from("invoices")
    .select(`
      id,
      invoice_number,
      status,
      amount_paid
    `)
    .eq("id", invoiceId)
    .single();

  if (invoiceError) {
    throw invoiceError;
  }

  if (!invoice) {
    throw new Error("Invoice not found.");
  }

  const normalizedStatus =
    String(invoice.status ?? "")
      .trim()
      .toLowerCase();

  if (normalizedStatus === "cancelled") {
    throw new Error(
      "This invoice is already cancelled."
    );
  }

  if (normalizedStatus === "paid") {
    throw new Error(
      "A paid invoice cannot be cancelled. Reverse the payment first."
    );
  }

  if (Number(invoice.amount_paid ?? 0) > 0) {
    throw new Error(
      "This invoice has payments allocated to it. Reverse or remove the payment allocation before cancelling the invoice."
    );
  }

  const {
    data,
    error,
  } = await supabase
    .from("invoices")
    .update({
      status: "Cancelled",
      notes: cleanReason,
      updated_at: new Date().toISOString(),
    })
    .eq("id", invoiceId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return {
    invoice: data,
    reason: cleanReason,
  };
}
