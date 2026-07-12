import { supabase } from "@/lib/supabase";

export async function getUtilityMeter(
  meterId: string
) {
  const { data, error } = await supabase
    .from("utility_meters")
    .select("*")
    .eq("id", meterId)
    .single();

  if (error) {
    throw error;
  }

  return data;
}
