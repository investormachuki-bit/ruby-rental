import { supabase } from "@/lib/supabase";

export type UpdateUnitData = {
  unit_number: string;
  floor_number: number | null;
  unit_type: string | null;
  bedrooms: number;
  bathrooms: number;
  size_sqm: number;
  monthly_rent: number;
  deposit: number;
  notes: string | null;
};

export async function updateUnit(
  unitId: string,
  values: UpdateUnitData
) {
  const { data, error } = await supabase
    .from("units")
    .update({
      unit_number: values.unit_number,
      floor_number: values.floor_number,
      unit_type: values.unit_type,
      bedrooms: values.bedrooms,
      bathrooms: values.bathrooms,
      size_sqm: values.size_sqm,
      monthly_rent: values.monthly_rent,
      deposit: values.deposit,
      notes: values.notes,
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
