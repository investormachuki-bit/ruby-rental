import { supabase } from "@/lib/supabase";

export async function getProperties(workspaceId: string) {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}
