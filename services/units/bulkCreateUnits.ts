import { supabase } from "@/lib/supabase";
import { getProfile } from "@/services/auth/getProfile";
import { createDefaultUtilityMeters } from "@/services/utilities/createDefaultUtilityMeters";

export type BulkUnitInput = {
  propertyId: string;
  prefix: string;
  floorNumber?: number;
  unitType?: string | null;
  bedrooms: number;
  bathrooms: number;
  sizeSqm: number;
  start: number;
  end: number;
  monthlyRent: number;
  deposit: number;
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

  // Get workspace
  const profile = await getProfile(session.user.id);

  if (!profile) {
    throw new Error("Profile not found.");
  }

  const units: any[] = [];

  // Build units
  for (let i = input.start; i <= input.end; i++) {
    units.push({
      workspace_id: profile.workspace_id,
      property_id: input.propertyId,
      unit_number: `${input.prefix}${i}`,
      unit_sequence: i,
      floor_number: input.floorNumber ?? null,
      unit_type: input.unitType,
      bedrooms: input.bedrooms,
      bathrooms: input.bathrooms,
      size_sqm: input.sizeSqm,
      monthly_rent: input.monthlyRent,
      deposit: input.deposit,
      garbage_fee: 0,
      parking_fee: 0,
      internet_fee: 0,
      security_fee: 0,
      sewer_fee: 0,
      service_charge: 0,
      status: "Vacant",
      notes: null,
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

  // Automatically create utility meters
  for (const unit of createdUnits) {
    await createDefaultUtilityMeters({
      workspace_id: profile.workspace_id,
      property_id: input.propertyId,
      unit_id: unit.id,
    });
  }

  return createdUnits;
}
