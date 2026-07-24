import { supabase } from "@/lib/supabase";
import { TABLES } from "@/constants/tables";

export async function deleteRecurringCharge(id: string) {
  const { data, error } = await supabase
    .from(TABLES.RECURRING_CHARGES)
    .update({
      is_active: false,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}
