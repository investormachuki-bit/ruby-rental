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

export type GetExpensesFilters = {
  propertyId?: string;

  unitId?: string;

  category?: string;

  status?: string;

  from?: string;

  to?: string;

  search?: string;
};

export async function getExpenses(
  filters: GetExpensesFilters = {}
): Promise<Expense[]> {

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

  let query = supabase
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
    .eq("workspace_id", profile.workspace_id);

  if (filters.propertyId) {
    query = query.eq(
      "property_id",
      filters.propertyId
    );
  }

  if (filters.unitId) {
    query = query.eq(
      "unit_id",
      filters.unitId
    );
  }

  if (filters.category) {
    query = query.eq(
      "category",
      filters.category
    );
  }

  if (filters.status) {
    query = query.eq(
      "status",
      filters.status
    );
  }

  if (filters.from) {
    query = query.gte(
      "expense_date",
      filters.from
    );
  }

  if (filters.to) {
    query = query.lte(
      "expense_date",
      filters.to
    );
  }

  if (filters.search) {
    query = query.or(
      `expense_number.ilike.%${filters.search}%,
vendor.ilike.%${filters.search}%,
reference.ilike.%${filters.search}%,
description.ilike.%${filters.search}%`
    );
  }

  const { data, error } = await query
    .order("expense_date", {
      ascending: false,
    })
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return (data ?? []) as Expense[];
}
