import { supabase } from "@/lib/supabase";

import { getProfile } from "@/services/auth/getProfile";

import { Expense } from "./getExpenses";

export async function getExpense(
  id: string
): Promise<Expense> {

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("You are not logged in.");
  }

  const profile =
    await getProfile(session.user.id);

  if (!profile) {
    throw new Error("Profile not found.");
  }

  const { data, error } =
    await supabase
      .from("expenses")
      .select(`
        *,
        properties (
          id,
          name
        ),
        units (
          id,
          unit_number
        )
      `)
      .eq("workspace_id", profile.workspace_id)
      .eq("id", id)
      .single();

  if (error) {
    throw error;
  }

  return data as Expense;
}
