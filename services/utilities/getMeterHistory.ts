import { supabase } from "@/lib/supabase";

export async function getMeterHistory(
  meterId: string
) {
  const { data, error } = await supabase
    .from("meter_readings")
    .select(`
      id,
      meter_id,
      workspace_id,
      property_id,
      unit_id,
      utility_type,
      billing_month,
      reading_date,
      previous_reading,
      current_reading,
      units_used,
      unit_rate,
      amount,
      notes,
      created_at
    `)
    .eq("meter_id", meterId)
    .order("billing_month", {
      ascending: false,
    })
    .order("reading_date", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return data ?? [];
}
