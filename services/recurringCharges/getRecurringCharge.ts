import { supabase } from "@/lib/supabase";
import { TABLES } from "@/constants/tables";

export async function getRecurringCharge(id: string) {
  const { data, error } = await supabase
    .from(TABLES.RECURRING_CHARGES)
    .select(`
      *,
      properties (
        id,
        name
      ),
      units (
        id,
        unit_number
      ),
      leases (
        id,
        lease_number
      )
    `)
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}
