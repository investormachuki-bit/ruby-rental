import { supabase } from "@/lib/supabase";

export type UpdateUtilityMeterInput = {
  meter_number: string;
  opening_reading: number;
  unit_rate: number;
  meter_location?: string | null;
  notes?: string | null;
};

export async function updateUtilityMeter(
  meterId: string,
  input: UpdateUtilityMeterInput
) {
  const { data, error } = await supabase
    .from("utility_meters")
    .update({
      meter_number: input.meter_number,
      opening_reading:
        input.opening_reading,
      unit_rate: input.unit_rate,
      meter_location:
        input.meter_location ?? null,
      notes: input.notes ?? null,
      status: "Active",
      updated_at:
        new Date().toISOString(),
    })
    .eq("id", meterId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}
