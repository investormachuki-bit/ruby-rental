import { supabase } from "@/lib/supabase";
import { getProfile } from "@/services/auth/getProfile";

export async function getPropertyOptions() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("You are not logged in.");
  }

  const profile = await getProfile(session.user.id);

  if (!profile) {
    throw new Error("Profile not found.");
  }

  const { data, error } = await supabase
    .from("properties")
    .select("id, name")
    .eq("workspace_id", profile.workspace_id)
    .order("name");

  if (error) {
    throw error;
  }

  return data ?? [];
}
