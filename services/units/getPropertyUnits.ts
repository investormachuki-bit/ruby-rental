import { supabase } from "@/lib/supabase";

export async function getPropertyUnits(
  propertyId: string
) {
  const { data, error } = await supabase
    .from("units")
    .select("*")
    .eq("property_id", propertyId)
    .order("unit_number");

  if (error) {
    throw error;
  }

  return data ?? [];
}
