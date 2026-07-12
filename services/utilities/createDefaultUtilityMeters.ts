import { supabase } from "@/lib/supabase";

type CreateDefaultUtilityMetersData = {
  workspace_id: string;
  property_id: string;
  unit_id: string;

  water_type: string;
  water_rate: number;

  electricity_type: string;
  electricity_rate: number;
};

export async function createDefaultUtilityMeters({
  workspace_id,
  property_id,
  unit_id,
  water_type,
  water_rate,
  electricity_type,
  electricity_rate,
}: CreateDefaultUtilityMetersData) {
  const { error } = await supabase
    .from("utility_meters")
    .insert([
      {
        workspace_id,
        property_id,
        unit_id,

        utility_type: "Water",

        meter_number: "",

        opening_reading: 0,

        unit_rate: water_rate,

        status: "Pending Setup",

        notes: `${water_type} water meter`,
      },

      {
        workspace_id,
        property_id,
        unit_id,

        utility_type: "Electricity",

        meter_number: "",

        opening_reading: 0,

        unit_rate: electricity_rate,

        status: "Pending Setup",

        notes: `${electricity_type} electricity meter`,
      },
    ]);

  if (error) {
    throw error;
  }
}
