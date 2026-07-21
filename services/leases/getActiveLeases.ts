import { supabase } from "@/lib/supabase";
import { getProfile } from "@/services/auth/getProfile";

export async function getActiveLeases() {
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
      id,
      lease_number,
      property_id,
      unit_id,
      tenant_id,
      occupant_id,
      rent_amount,
      billing_day,
      rent_due_day,
      status,
      property:properties(id, name),
      unit:units(id, unit_number),
      tenant:tenants(id, first_name, last_name, full_name)
    `)
    .eq("workspace_id", profile.workspace_id)
    .eq("status", "Active");

  if (error) {
    throw error;
  }

  return data ?? [];
}
