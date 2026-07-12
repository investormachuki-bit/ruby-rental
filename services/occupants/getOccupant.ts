import { supabase } from "@/lib/supabase";

export async function getOccupant(
  occupantId: string
) {
  const { data, error } = await supabase
    .from("occupants")
    .select(`
      *,
      property:properties(
        id,
        name
      ),
      unit:units(
        id,
        unit_number,
        floor_name,
        monthly_rent
      )
    `)
    .eq("id", occupantId)
    .single();

  if (error) {
    throw error;
  }

  return data;
}
