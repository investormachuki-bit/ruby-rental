import { supabase } from "@/lib/supabase";

export async function getUnit(
  unitId: string
) {
  const { data, error } = await supabase
    .from("units")
    .select(`
      *,
      property:properties(
        id,
        name,
        property_type
      )
    `)
    .eq("id", unitId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}
