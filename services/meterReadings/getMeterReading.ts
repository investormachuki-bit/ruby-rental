import { supabase } from "@/lib/supabase";

export async function getMeterReading(
  id: string
) {

  const { data, error } =
    await supabase

      .from("meter_readings")

      .select(`
        *,
        property:properties(
          id,
          name
        ),
        unit:units(
          id,
          unit_number
        )
      `)

      .eq("id", id)

      .single();

  if (error) {
    throw error;
  }

  return data;

}
