import { supabase } from "@/lib/supabase";

export async function getCurrentWorkspace() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("User not authenticated.");
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("workspace_id")
    .eq("id", user.id)
    .single();

  if (error) {
    throw error;
  }

  return {
    id: data.workspace_id,
  };
}
