import { supabase } from "@/lib/supabase";

export async function getLatestReading(
  unitId: string,
  meterType: "Water" | "Electricity"
) {

  const { data, error } =
    await supabase

      .from("meter_readings")

      .select("*")

      .eq("unit_id", unitId)

      .eq("meter_type", meterType)

      .order(
        "reading_date",
        {
          ascending: false,
        }
      )

      .limit(1)

      .maybeSingle();

  if (error) {
    throw error;
  }

  return data;

}
