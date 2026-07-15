import { supabase } from "@/lib/supabase";

import { getProfile } from "@/services/auth/getProfile";

import { generateExpenseNumber } from "./generateExpenseNumber";

export type CreateExpenseInput = {
  property_id?: string | null;

  unit_id?: string | null;

  expense_date: string;

  category: string;

  amount: number;

  vendor?: string;

  description?: string;

  receipt_url?: string;

  payment_method: string;

  reference?: string;

  status: "Paid" | "Pending";
};

export async function createExpense(
  input: CreateExpenseInput
) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("You are not logged in.");
  }

  const profile = await getProfile(
    session.user.id
  );

  if (!profile) {
    throw new Error("Profile not found.");
  }

  const expenseNumber =
    await generateExpenseNumber();

  const { data, error } = await supabase
    .from("expenses")
    .insert({
      workspace_id: profile.workspace_id,

      property_id:
        input.property_id ?? null,

      unit_id:
        input.unit_id ?? null,

      expense_number:
        expenseNumber,

      expense_date:
        input.expense_date,

      category:
        input.category,

      amount:
        input.amount,

      vendor:
        input.vendor ?? null,

      description:
        input.description ?? null,

      receipt_url:
        input.receipt_url ?? null,

      payment_method:
        input.payment_method,

      reference:
        input.reference ?? null,

      status:
        input.status,

      created_by:
        session.user.id,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}
