import { supabase } from "@/lib/supabase";
import { TABLES } from "@/constants/tables";

export async function getLeaseRecurringCharges(
  leaseId: string
) {
  const { data, error } = await supabase
    .from(TABLES.RECURRING_CHARGES)
    .select("*")
    .eq("lease_id", leaseId)
    .eq("is_active", true)
    .order("charge_name");

  if (error) {
    throw error;
  }

  return data ?? [];
}
