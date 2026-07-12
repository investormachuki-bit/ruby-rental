import { supabase } from "@/lib/supabase";

export async function getLatestReading(
  unitId: string,
  utilityType: "Water" | "Electricity"
) {
  const { data, error } = await supabase
    .from("meter_readings")
    .select("*")
    .eq("unit_id", unitId)
    .eq("utility_type", utilityType)
    .order("reading_date", {
      ascending: false,
    })
    .order("created_at", {
      ascending: false,
    })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}
