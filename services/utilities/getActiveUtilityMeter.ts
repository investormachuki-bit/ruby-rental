import { supabase } from "@/lib/supabase";

export async function getActiveUtilityMeter(
  unitId: string,
  utilityType: "Water" | "Electricity"
) {
  const { data, error } = await supabase
    .from("utility_meters")
    .select("*")
    .eq("unit_id", unitId)
    .eq("utility_type", utilityType)
    .eq("status", "Active")
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}
