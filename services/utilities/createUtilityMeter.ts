import { supabase } from "@/lib/supabaseClient";

type CreateUtilityMeterInput = {
  workspace_id: string;
  property_id: string;
  unit_id: string;
  utility_type: string;
  meter_number: string;
  opening_reading: number;
  unit_rate: number;
  meter_location?: string;
  notes?: string;
};

export async function createUtilityMeter(
  data: CreateUtilityMeterInput
) {
  const { data: meter, error } = await supabase
    .from("utility_meters")
    .insert({
      workspace_id: data.workspace_id,
      property_id: data.property_id,
      unit_id: data.unit_id,

      utility_type: data.utility_type,

      meter_number: data.meter_number,

      opening_reading: data.opening_reading,

      unit_rate: data.unit_rate,

      meter_location: data.meter_location ?? null,

      notes: data.notes ?? null,

      status: "Active",
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return meter;
}
