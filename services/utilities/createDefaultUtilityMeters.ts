import { supabase } from "@/lib/supabase";

type CreateDefaultUtilityMetersData = {
  workspace_id: string;
  property_id: string;
  unit_id: string;
};

export async function createDefaultUtilityMeters({
  workspace_id,
  property_id,
  unit_id,
}: CreateDefaultUtilityMetersData) {
  const { data: settings, error: settingsError } = await supabase
    .from("property_utility_settings")
    .select("*")
    .eq("property_id", property_id)
    .single();

  if (settingsError) {
    throw settingsError;
  }

  if (!settings) {
    return;
  }

  const meters = [];

  if (settings.water_enabled) {
    meters.push({
      workspace_id,
      property_id,
      unit_id,
      utility_type: "Water",
      meter_number: "",
      opening_reading: 0,
      unit_rate: Number(settings.water_rate_per_unit ?? 0),
      status: "Pending Setup",
      notes: `${settings.water_billing_method} Water meter`,
    });
  }

  if (settings.electricity_enabled) {
    meters.push({
      workspace_id,
      property_id,
      unit_id,
      utility_type: "Electricity",
      meter_number: "",
      opening_reading: 0,
      unit_rate: Number(settings.electricity_rate_per_unit ?? 0),
      status: "Pending Setup",
      notes: `${settings.electricity_billing_method} Electricity meter`,
    });
  }

  if (settings.gas_enabled) {
    meters.push({
      workspace_id,
      property_id,
      unit_id,
      utility_type: "Gas",
      meter_number: "",
      opening_reading: 0,
      unit_rate: Number(settings.gas_rate_per_unit ?? 0),
      status: "Pending Setup",
      notes: `${settings.gas_billing_method} Gas meter`,
    });
  }

  if (meters.length === 0) {
    return;
  }

  const { error } = await supabase
    .from("utility_meters")
    .insert(meters);

  if (error) {
    console.error("Utility meter insert failed:", error);
    throw error;
  }
}
