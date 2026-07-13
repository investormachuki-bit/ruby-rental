import { supabase } from "@/lib/supabase";
import { getProfile } from "@/services/auth/getProfile";

export async function getLease(
  leaseId: string
) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("Not authenticated.");
  }

  const profile =
    await getProfile(session.user.id);

  const { data, error } =
    await supabase
      .from("leases")
      .select(`
        *,
        property:properties(
          id,
          name,
          county,
          town
        ),
        unit:units(
          id,
          unit_number,
          floor_name
        ),
        occupant:occupants(
          id,
          first_name,
          last_name,
          phone_number,
          email,
          id_number
        )
      `)
      .eq(
        "workspace_id",
        profile.workspace_id
      )
      .eq("id", leaseId)
      .single();

  if (error) throw error;

  return data;
}
