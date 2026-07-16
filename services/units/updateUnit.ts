import { supabase } from "@/lib/supabase";

export type UpdateUnitData = {
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

export async function updateUnit(
  unitId: string,
  values: UpdateUnitData
) {
  const { data, error } = await supabase
    .from("units")
    .update({
      ...values,
      updated_at: new Date().toISOString(),
    })
    .eq("id", unitId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}
