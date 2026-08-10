import { supabase } from "@/lib/supabase";
import { getProfile } from "@/services/auth/getProfile";

export type ReceiptAllocation = {
  id: string;
  invoice_id: string;
  allocated_amount: number;
  is_reversed: boolean;
  invoice: {
    id: string;
    invoice_number: string;
    amount: number;
    amount_paid: number;
    balance: number;
    currency: string;
  } | null;
};

export type ReceiptPayment = {
  id: string;
  workspace_id: string;
  lease_id: string;
  property_id: string;
  unit_id: string;
  tenant_id: string;
  receipt_number: string | null;
  payment_date: string;
  payment_type: string;
  payment_method: string;
  amount: number;
  allocated_amount: number;
  unallocated_amount: number;
  reference_number: string | null;
  notes: string | null;
  allocations: ReceiptAllocation[];
};

export async function getReceiptPayment(
  paymentId: string
): Promise<ReceiptPayment> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("You are not logged in.");
  }

  const profile = await getProfile(session.user.id);

  if (!profile) {
    throw new Error("Profile not found.");
  }

  const { data, error } = await supabase
    .from("payments")
    .select(
      [
        "id",
        "workspace_id",
        "lease_id",
        "property_id",
        "unit_id",
        "tenant_id",
        "receipt_number",
        "payment_date",
        "payment_type",
        "payment_method",
        "amount",
        "allocated_amount",
        "unallocated_amount",
        "reference_number",
        "notes",
      ].join(",")
    )
    .eq("id", paymentId)
    .eq("workspace_id", profile.workspace_id)
    .single();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error("Payment not found.");
  }

  const { data: allocationRows, error: allocationError } =
    await supabase
      .from("payment_allocations")
      .select(
        `
        id,
        invoice_id,
        allocated_amount,
        is_reversed,
        invoices (
          id,
          invoice_number,
          amount,
          amount_paid,
          balance,
          currency
        )
      `
      )
      .eq("payment_id", paymentId)
      .eq("workspace_id", profile.workspace_id)
      .eq("is_reversed", false)
      .order("allocated_at", {
        ascending: true,
      });

  if (allocationError) {
    throw allocationError;
  }

  const payment = data as any;

  const allocations: ReceiptAllocation[] =
    (allocationRows ?? []).map((row: any) => ({
      id: row.id,
      invoice_id: row.invoice_id,
      allocated_amount: Number(
        row.allocated_amount ?? 0
      ),
      is_reversed: Boolean(row.is_reversed),
      invoice: row.invoices
        ? {
            id: row.invoices.id,
            invoice_number:
              row.invoices.invoice_number,
            amount: Number(
              row.invoices.amount ?? 0
            ),
            amount_paid: Number(
              row.invoices.amount_paid ?? 0
            ),
            balance: Number(
              row.invoices.balance ?? 0
            ),
            currency:
              row.invoices.currency || "KES",
          }
        : null,
    }));

  return {
    id: payment.id,
    workspace_id: payment.workspace_id,
    lease_id: payment.lease_id,
    property_id: payment.property_id,
    unit_id: payment.unit_id,
    tenant_id: payment.tenant_id,
    receipt_number: payment.receipt_number,
    payment_date: payment.payment_date,
    payment_type: payment.payment_type,
    payment_method: payment.payment_method,
    amount: Number(payment.amount ?? 0),
    allocated_amount: Number(
      payment.allocated_amount ?? 0
    ),
    unallocated_amount: Number(
      payment.unallocated_amount ?? 0
    ),
    reference_number:
      payment.reference_number,
    notes: payment.notes,
    allocations,
  };
}
