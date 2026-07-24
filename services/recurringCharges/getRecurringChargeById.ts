import { supabase } from "@/lib/supabase";
import { TABLES } from "@/lib/constants";

import { RecurringCharge } from "@/types/recurringCharge";

export async function getRecurringChargeById(
  id: string
): Promise<RecurringCharge> {
  const { data, error } = await supabase
    .from(TABLES.RECURRING_CHARGES)
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}
