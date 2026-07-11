import { supabase } from "@/lib/supabase";

export async function getPropertyDetails(propertyId: string) {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", propertyId)
    .single();

  if (error) {
    throw error;
  }

  return data;
}
