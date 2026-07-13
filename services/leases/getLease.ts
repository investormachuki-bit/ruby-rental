import { supabase } from "@/lib/supabase";
import { getProfile } from "@/services/auth/getProfile";

export async function getLease(
  leaseId: string
) {
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
    .from("leases")
    .select(`
      *,
      property:properties(
        id,
        name,
        property_type
      ),
      unit:units(
        id,
        unit_number,
        floor_name,
        monthly_rent,
        deposit
      ),
      occupant:occupants(
        id,
        occupant_code,
        first_name,
        last_name,
        phone_number,
        email,
        id_number
      )
    `)
    .eq("workspace_id", profile.workspace_id)
    .eq("id", leaseId)
    .single();

  if (error) {
    throw error;
  }

  return data;
}
