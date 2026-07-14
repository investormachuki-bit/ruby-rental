import { supabase } from "@/lib/supabase";
import { getProfile } from "@/services/auth/getProfile";

export async function getUnitActiveLease(
  unitId: string
) {

  const {
    data: { session },
  } =
    await supabase.auth.getSession();

  if (!session) {

    throw new Error(
      "Not authenticated."
    );

  }

  const profile =
    await getProfile(
      session.user.id
    );

  const {
    data,
    error,
  } =
    await supabase
      .from("leases")
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
        occupant:occupants(
          id,
          first_name,
          last_name,
          phone_number,
          email
        )
      `)
      .eq(
        "workspace_id",
        profile.workspace_id
      )
      .eq(
        "unit_id",
        unitId
      )
      .eq(
        "status",
        "Active"
      )
      .maybeSingle();

  if (error) {

    throw error;

  }

  return data;

}
