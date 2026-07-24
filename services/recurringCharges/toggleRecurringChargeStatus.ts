import { supabase } from "@/lib/supabase";
import { TABLES } from "@/constants/tables";

export async function toggleRecurringChargeStatus(
  id: string,
  isActive: boolean
): Promise<void> {
  const { error } = await supabase
    .from(TABLES.RECURRING_CHARGES)
    .update({
      is_active: isActive,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw error;
  }
}
