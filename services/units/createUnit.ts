import { supabase } from "@/lib/supabase";
import { getProfile } from "@/services/auth/getProfile";

export type CreateUnitData = {
  property_id: string;

  unit_number: string;

  unit_type: string | null;

  floor_number: number | null;

  bedrooms: number;

  bathrooms: number;

  size_sqm: number;

  monthly_rent: number;

  deposit: number;

  water_meter_number: string | null;

  electricity_meter_number: string | null;

  gas_meter_number: string | null;

  internet_account_number: string | null;

  garbage_fee: number;

  security_fee: number;

  sewer_fee: number;

  parking_fee: number;

  internet_fee: number;

  service_charge: number;

  status: string;

  notes: string | null;
};

export async function createUnit(
  values: CreateUnitData
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

  const { data, error } = await supabase
    .from("units")
    .insert({
      workspace_id: profile.workspace_id,

      ...values,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}
