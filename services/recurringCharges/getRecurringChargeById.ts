import { supabase } from "@/lib/supabase";
import { TABLES } from "@/constants/tables";

import { RecurringCharge } from "@/types/recurringCharge";

export async function getRecurringChargeById(
  id: string
): Promise<RecurringCharge> {
  const { data, error } = await supabase
    .from(TABLES.RECURRING_CHARGES)
    .select("*")
    .eq("id", id)
    .is("deleted_at", null)
    .single();

  if (error) {
    throw error;
  }

  return data;
}
