import { supabase } from "@/lib/supabase";
import { getProfile } from "@/services/auth/getProfile";

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
  const profile = await getProfile(session.user.id);

  if (!profile) {
    throw new Error("Profile not found.");
  }

  const units = [];

  for (let i = input.start; i <= input.end; i++) {
    units.push({
      workspace_id: profile.workspace_id,
      property_id: input.propertyId,

      unit_number: `${input.prefix}${i}`,
      unit_sequence: i,
      floor_name: input.floorName ?? null,

      monthly_rent: input.monthlyRent,
      deposit: input.deposit,

      water_type: "Metered",
      electricity_type: "Prepaid",

      garbage_fee: 0,
      parking_fee: 0,
      internet_fee: 0,
      service_charge: 0,

      status: "Vacant",
    });
  }

  const { error } = await supabase
    .from("units")
    .insert(units);

  if (error) {
    throw error;
  }

  return true;
}
