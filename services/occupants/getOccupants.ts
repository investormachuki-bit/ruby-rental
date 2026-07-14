import { supabase } from "@/lib/supabase";
import { getProfile } from "@/services/auth/getProfile";

export async function getOccupants() {
  // Get logged in user
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("You are not logged in.");
  }

  // Get workspace
  const profile = await getProfile(
    session.user.id
  );

  if (!profile) {
    throw new Error("Profile not found.");
  }

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
        floor_name
      )
    `)
    .eq(
      "workspace_id",
      profile.workspace_id
    )
    .order("first_name", {
      ascending: true,
    });

  if (error) {
    throw error;
  }

  return data ?? [];
}
