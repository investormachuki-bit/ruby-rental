import { supabase } from "@/lib/supabase";

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select(`
      *,
      workspace:workspaces(*)
    `)
    .eq("id", userId)
    .single();

  if (error) {
    throw error;
  }

  return data;
}
