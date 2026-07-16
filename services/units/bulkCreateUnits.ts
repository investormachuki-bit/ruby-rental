import { supabase } from "@/lib/supabase";
import { getProfile } from "@/services/auth/getProfile";

export type BulkUnitInput = {
  propertyId: string;

  prefix: string;

  start: number;

  end: number;

  monthlyRent: number;

  deposit: number;

  floorNumber?: number;

  unitType?: string;

  bedrooms?: number;

  bathrooms?: number;

  sizeSqm?: number;
};

export async function bulkCreateUnits(
  input: BulkUnitInput
) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("You are not logged in.");
  }

  const profile = await getProfile(
    session.user.id
  );

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

      unit_type: input.unitType ?? null,

      floor_number: input.floorNumber ?? null,

      bedrooms: input.bedrooms ?? 0,

      bathrooms: input.bathrooms ?? 0,

      size_sqm: input.sizeSqm ?? 0,

      monthly_rent: input.monthlyRent,

      deposit: input.deposit,

      water_meter_number: null,

      electricity_meter_number: null,

      gas_meter_number: null,

      internet_account_number: null,

      garbage_fee: 0,

      security_fee: 0,

      sewer_fee: 0,

      parking_fee: 0,

      internet_fee: 0,

      service_charge: 0,

      status: "Vacant",

      notes: null,
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
