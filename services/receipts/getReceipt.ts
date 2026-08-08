import { supabase } from "@/lib/supabase";
import { getProfile } from "@/services/auth/getProfile";

export type ReceiptRecord = {
  id: string;
  workspace_id: string;
  payment_id: string;
  receipt_number: string;
  receipt_date: string;
  amount: number;
  issued_by: string | null;
  notes: string | null;
};

export async function getReceipt(receiptId: string): Promise<ReceiptRecord> {
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
    .from("receipts")
    .select("id, workspace_id, payment_id, receipt_number, receipt_date, amount, issued_by, notes")
    .eq("id", receiptId)
    .eq("workspace_id", profile.workspace_id)
    .single();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error("Receipt not found.");
  }

  return {
    id: data.id,
    workspace_id: data.workspace_id,
    payment_id: data.payment_id,
    receipt_number: data.receipt_number,
    receipt_date: data.receipt_date,
    amount: Number(data.amount ?? 0),
    issued_by: data.issued_by ?? null,
    notes: data.notes ?? null,
  };
}
