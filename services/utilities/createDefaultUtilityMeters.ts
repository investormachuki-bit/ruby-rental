import { supabase } from "@/lib/supabase";

type UtilitySetting = {
  utility_type: string;
  billing_type: string;
  unit_rate: number;
};

type CreateDefaultUtilityMetersData = {
  workspace_id: string;
  property_id: string;
  unit_id: string;

  utilitySettings: UtilitySetting[];
};

export async function createDefaultUtilityMeters({
  workspace_id,
  property_id,
  unit_id,
  utilitySettings,
}: CreateDefaultUtilityMetersData) {

  if (
    !utilitySettings ||
    utilitySettings.length === 0
  ) {
    return;
  }

  const meters =
    utilitySettings.map(
      (setting) => ({

        workspace_id,

        property_id,

        unit_id,

        utility_type:
          setting.utility_type,

        meter_number: "",

        opening_reading: 0,

        unit_rate: Number(
          setting.unit_rate ?? 0
        ),

        status: "Pending Setup",

        notes: `${setting.billing_type} ${setting.utility_type} meter`,

      })
    );

  const { error } =
    await supabase
      .from("utility_meters")
      .insert(meters);

  if (error) {

    throw error;

  }

}
