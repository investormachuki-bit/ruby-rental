import { supabase } from "@/lib/supabase";
import { getProfile } from "@/services/auth/getProfile";
import { TABLES } from "@/constants/tables";

export async function getRecurringCharges() {
  // Get logged in user
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("You are not logged in.");
  }

  // Get profile
  const profile = await getProfile(session.user.id);

  if (!profile) {
    throw new Error("Profile not found.");
  }

  const { data, error } = await supabase
    .from(TABLES.RECURRING_CHARGES)
    .select(`
      *,
      properties (
        id,
        name
      ),
      units (
        id,
        unit_number
      ),
      leases (
        id,
        lease_number
      )
    `)
    .eq("workspace_id", profile.workspace_id)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}
