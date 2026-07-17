import { supabase } from "@/lib/supabase";
import { getProfile } from "@/services/auth/getProfile";
import { createDefaultUtilityMeters } from "@/services/utilities/createDefaultUtilityMeters";

export type CreateUnitInput = {
  propertyId: string;
  unitNumber: string;
  unitSequence: number;
  floorNumber?: number;
  unitType?: string | null;
  bedrooms: number;
  bathrooms: number;
  sizeSqm: number;
  monthlyRent: number;
  deposit: number;
  garbageFee: number;
  parkingFee: number;
  internetFee: number;
  securityFee: number;
  sewerFee: number;
  serviceCharge: number;
  notes?: string | null;
};

export async function createUnit(
  input: CreateUnitInput
) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("You are not logged in.");
  }

  const profile = await getProfile(session.user.id);

  if (!profile) {
    throw new Error("Profile not found.");
  }

  const { data: unit, error } = await supabase
    .from("units")
    .insert({
      workspace_id: profile.workspace_id,
      property_id: input.propertyId,
      unit_number: input.unitNumber,
      unit_sequence: input.unitSequence,
      floor_number: input.floorNumber ?? null,
      unit_type: input.unitType,
      bedrooms: input.bedrooms,
      bathrooms: input.bathrooms,
      size_sqm: input.sizeSqm,
      monthly_rent: input.monthlyRent,
      deposit: input.deposit,
      garbage_fee: input.garbageFee,
      parking_fee: input.parkingFee,
      internet_fee: input.internetFee,
      security_fee: input.securityFee,
      sewer_fee: input.sewerFee,
      service_charge: input.serviceCharge,
      status: "Vacant",
      notes: input.notes ?? null,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  try {
    await createDefaultUtilityMeters({
      workspace_id: profile.workspace_id,
      property_id: input.propertyId,
      unit_id: unit.id,
    });
  } catch (error) {
    console.error("Failed to create default utility meters:", error);
    throw error;
  }

  return unit;
}
