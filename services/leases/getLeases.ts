import { supabase } from "@/lib/supabase";
import { getProfile } from "@/services/auth/getProfile";
import { TABLES } from "@/constants/tables";

export async function getLeases() {
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
    .from(TABLES.LEASES)
    .select(`
      *,
      property:properties(
        id,
        name
      ),
      unit:units(
        id,
        unit_number
      ),
      tenant:occupants(
        id,
        occupant_code,
        full_name,
        phone,
        email,
        id_number,
        occupation,
        employer,

        first_name,
        last_name,
        phone_number
      )
    `)
    .eq("workspace_id", profile.workspace_id)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return data ?? [];
}
