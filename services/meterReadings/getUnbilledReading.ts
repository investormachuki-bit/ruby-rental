import { supabase } from "@/lib/supabase";

export async function getUnbilledReading(
  unitId: string,
  meterType: "Water" | "Electricity"
) {

  const { data, error } =
    await supabase

      .from("meter_readings")

      .select("*")

      .eq("unit_id", unitId)

      .eq("meter_type", meterType)

      .eq("status", "Unbilled")

      .order(
        "reading_date",
        {
          ascending: true,
        }
      );

  if (error) {
    throw error;
  }

  return data ?? [];

}
