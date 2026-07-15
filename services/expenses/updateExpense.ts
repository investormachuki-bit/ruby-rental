import { supabase } from "@/lib/supabase";

import { getProfile } from "@/services/auth/getProfile";

import { CreateExpenseInput } from "./createExpense";

export async function updateExpense(
  id: string,
  input: CreateExpenseInput
) {
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
    .from("expenses")
    .update({
      property_id: input.property_id ?? null,

      unit_id: input.unit_id ?? null,

      expense_date: input.expense_date,

      category: input.category,

      amount: input.amount,

      vendor: input.vendor ?? null,

      description: input.description ?? null,

      receipt_url: input.receipt_url ?? null,

      payment_method: input.payment_method,

      reference: input.reference ?? null,

      status: input.status,
    })
    .eq("workspace_id", profile.workspace_id)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}
