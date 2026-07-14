import { supabase } from "@/lib/supabase";
import { getProfile } from "@/services/auth/getProfile";

type CreateReceiptInput = {

  payment_id: string;

  amount: number;

  receipt_date: string;

  notes?: string;

};

export async function createReceipt(
  input: CreateReceiptInput
) {

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {

    throw new Error(
      "You are not logged in."
    );

  }

  const profile =
    await getProfile(
      session.user.id
    );

  if (!profile) {

    throw new Error(
      "Profile not found."
    );

  }

  const today =
    new Date();

  const yyyy =
    today.getFullYear();

  const mm = String(
    today.getMonth() + 1
  ).padStart(2, "0");

  const dd = String(
    today.getDate()
  ).padStart(2, "0");

  const prefix =
    `RCP-${yyyy}${mm}${dd}`;

  const { count } =
    await supabase
      .from("receipts")
      .select("*", {

        count: "exact",

        head: true,

      })
      .eq(
        "workspace_id",
        profile.workspace_id
      );

  const sequence =
    String(
      (count ?? 0) + 1
    ).padStart(6, "0");

  const receiptNumber =
    `${prefix}-${sequence}`;
    const { data, error } =
    await supabase
      .from("receipts")
      .insert({

        workspace_id:
          profile.workspace_id,

        payment_id:
          input.payment_id,

        receipt_number:
          receiptNumber,

        receipt_date:
          input.receipt_date,

        amount:
          input.amount,

        issued_by:
          session.user.id,

        notes:
          input.notes ?? null,

      })
      .select()
      .single();

  if (error) {

    throw error;

  }

  return data;

}
