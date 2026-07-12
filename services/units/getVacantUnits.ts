import { supabase } from "@/lib/supabase";

export async function getVacantUnits(
  propertyId: string
) {
  if (!propertyId) {
    return [];
  }

  const { data, error } = await supabase
    .from("units")
    .select(`
      id,
      unit_number,
      floor_name
    `)
    .eq("property_id", propertyId)
    .eq("status", "Vacant")
    .order("unit_sequence");

  if (error) {
    throw error;
  }

  return data ?? [];
}
