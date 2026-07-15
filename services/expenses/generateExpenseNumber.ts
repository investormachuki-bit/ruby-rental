import { supabase } from "@/lib/supabase";

export async function generateExpenseNumber(): Promise<string> {
  const today = new Date();

  const yyyy = today.getFullYear();

  const mm = String(today.getMonth() + 1).padStart(2, "0");

  const dd = String(today.getDate()).padStart(2, "0");

  const prefix = `EXP-${yyyy}${mm}${dd}`;

  const { count, error } = await supabase
    .from("expenses")
    .select("*", {
      count: "exact",
      head: true,
    })
    .ilike("expense_number", `${prefix}%`);

  if (error) {
    throw error;
  }

  const nextNumber = String((count ?? 0) + 1).padStart(4, "0");

  return `${prefix}-${nextNumber}`;
}
