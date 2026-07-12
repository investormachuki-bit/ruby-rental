import { supabase } from "@/lib/supabase";
import { getProfile } from "@/services/auth/getProfile";

export async function getUnits() {
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
    .from("units")
    .select(`
      *,
      property:properties(
        id,
        name
      )
    `)
    .eq("workspace_id", profile.workspace_id)
    .order("unit_sequence");

  if (error) {
    throw error;
  }

  return data ?? [];
}
