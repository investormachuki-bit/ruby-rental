import { supabase } from "@/lib/supabase";

export type SelectOption = {
  label: string;
  value: string;
};

export async function getUnitsForSelect(
  propertyId: string
): Promise<SelectOption[]> {

  if (!propertyId) {
    return [];
  }

  const { data, error } = await supabase
    .from("units")
    .select("id, unit_number")
    .eq("property_id", propertyId)
    .order("unit_number");

  if (error) {
    throw error;
  }

  return (data ?? []).map((unit) => ({
    label: unit.unit_number,
    value: unit.id,
  }));
}
