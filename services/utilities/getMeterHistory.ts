import { supabase } from "@/lib/supabase";

export async function getMeterHistory(
  unitId: string,
  utilityType?: "Water" | "Electricity"
) {
  let query = supabase
    .from("meter_readings")
    .select("*")
    .eq("unit_id", unitId);

  if (utilityType) {
    query = query.eq(
      "utility_type",
      utilityType
    );
  }

  const { data, error } = await query
    .order("reading_date", {
      ascending: false,
    })
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return data ?? [];
}
