import { supabase } from "@/lib/supabase";

import { getProfile } from "@/services/auth/getProfile";

export type Expense = {
  id: string;

  workspace_id: string;

  property_id: string | null;

  unit_id: string | null;

  expense_number: string;

  expense_date: string;

  category: string;

  amount: number;

  vendor: string | null;

  description: string | null;

  receipt_url: string | null;

  payment_method: string;

  reference: string | null;

  status: string;

  created_by: string | null;

  created_at: string;

  updated_at: string;

  properties?: {
    id: string;

    name: string;
  } | null;

  units?: {
    id: string;

    unit_number: string;
  } | null;
};

export async function getExpenses(): Promise<Expense[]> {

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {

    throw new Error(
      "You are not logged in."
    );

  }

  const profile =
    await getProfile(session.user.id);

  if (!profile) {

    throw new Error(
      "Profile not found."
    );

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
      .eq(
        "workspace_id",
        profile.workspace_id
      )
      .order(
        "expense_date",
        {
          ascending: false,
        }
      )
      .order(
        "created_at",
        {
          ascending: false,
        }
      );

  if (error) {

    throw error;

  }

  return (data ?? []) as Expense[];

}
