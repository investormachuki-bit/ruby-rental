import { supabase } from "@/lib/supabase";
import { getProfile } from "@/services/auth/getProfile";
import { TABLES } from "@/constants/tables";

export async function getTenants() {
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
    .from(TABLES.TENANTS)
    .select(`
      *,
      leases(
        id,
        lease_number,
        property_id,
        unit_id,
        status,
        start_date,
        end_date
      )
    `)
    .eq("workspace_id", profile.workspace_id)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return (
    data?.map((tenant: any) => {
      const leases = tenant.leases ?? [];

      const activeLease = leases.find(
        (lease: any) => lease.status === "Active"
      );

      let current_status = "Unassigned";

      if (activeLease) {
        current_status = "Current";
      } else if (leases.length > 0) {
        current_status = "Former";
      }

      return {
        ...tenant,
        leases,
        active_lease: activeLease ?? null,
        current_status,
      };
    }) ?? []
  );
}
