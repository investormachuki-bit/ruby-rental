import { supabase } from "@/lib/supabase";
import { TABLES } from "@/constants/tables";

export async function getTenant(
  tenantId: string
) {
  const { data, error } = await supabase
    .from(TABLES.TENANTS)
    .select("*")
    .eq("id", tenantId)
    .single();

  if (error) {
    throw error;
  }

  return data;
}
