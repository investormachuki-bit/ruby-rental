import { supabase } from "@/lib/supabase";

export type UpdateUnitData = {
  unit_number: string;
  floor_name: string | null;

  monthly_rent: number;
  deposit: number;

  water_type: string;
  water_amount: number;

  electricity_type: string;
  electricity_amount: number;

  garbage_fee: number;
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
