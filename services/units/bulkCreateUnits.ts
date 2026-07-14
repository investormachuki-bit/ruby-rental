import { supabase } from "@/lib/supabase";
import { getProfile } from "@/services/auth/getProfile";
import { createDefaultUtilityMeters } from "@/services/utilities/createDefaultUtilityMeters";

export type BulkUnitInput = {
  propertyId: string;
  prefix: string;
  start: number;
  end: number;
  monthlyRent: number;
  deposit: number;
  floorName?: string;
};

export async function bulkCreateUnits(
  input: BulkUnitInput
) {
  // Get logged-in user
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("You are not logged in.");
  }

  // Get user's profile
  const profile = await getProfile(
    session.user.id
  );

  if (!profile) {
    throw new Error("Profile not found.");
  }

  // Build units
  const units = [];

  for (
    let i = input.start;
    i <= input.end;
    i++
  ) {
    units.push({
      workspace_id:
        profile.workspace_id,

      property_id:
        input.propertyId,

      unit_number:
        `${input.prefix}${i}`,

      unit_sequence: i,

      floor_name:
        input.floorName ?? null,

      monthly_rent:
        input.monthlyRent,

      deposit:
        input.deposit,

      water_type:
        "Metered",

      electricity_type:
        "Prepaid",

      garbage_fee: 0,
      parking_fee: 0,
      internet_fee: 0,
      service_charge: 0,

      status: "Vacant",
    });
  }

  // Create units
  const {
    data: createdUnits,
    error,
  } = await supabase
    .from("units")
    .insert(units)
    .select();

  if (error) {
    throw error;
  }

  // Load property utility settings
  const {
    data: property,
    error: propertyError,
  } = await supabase
    .from("properties")
    .select(`
      water_type,
      water_rate,
      electricity_type,
      electricity_rate
    `)
    .eq(
      "id",
      input.propertyId
    )
    .single();

  if (propertyError) {
    throw propertyError;
  }

  // Automatically create utility meters
  for (const unit of createdUnits) {
    await createDefaultUtilityMeters({
      workspace_id:
        profile.workspace_id,

      property_id:
        input.propertyId,

      unit_id:
        unit.id,

      water_type:
        property.water_type,

      water_rate:
        Number(
          property.water_rate
        ),

      electricity_type:
        property.electricity_type,

      electricity_rate:
        Number(
          property.electricity_rate
        ),
    });
  }

  return true;
}
