import { supabase } from "@/lib/supabase";
import { getProfile } from "@/services/auth/getProfile";

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
  reference_number: string | null;
  notes: string | null;
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
    .select([
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
      "reference_number",
      "notes"
    ].join(","))
    .eq("id", paymentId)
    .eq("workspace_id", profile.workspace_id)
    .single();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error("Payment not found.");
  }

  const payment = data as unknown as ReceiptPayment;

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
    reference_number: payment.reference_number,
    notes: payment.notes,
  };
}
