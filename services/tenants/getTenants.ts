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
        status,
        rent_amount,
        start_date,
        end_date,
        property:properties(
          id,
          name
        ),
        unit:units(
          id,
          unit_number
        )
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

      const activeLease =
        leases.find(
          (lease: any) =>
            lease.status === "Active"
        ) ?? null;

      const latestLease =
        activeLease ??
        leases.sort(
          (a: any, b: any) =>
            new Date(b.start_date).getTime() -
            new Date(a.start_date).getTime()
        )[0] ??
        null;

      let current_status:
        | "Current"
        | "Former"
        | "Unassigned" =
        "Unassigned";

      if (activeLease) {
        current_status = "Current";
      } else if (leases.length > 0) {
        current_status = "Former";
      }

      return {
        ...tenant,

        current_status,

        property_name:
          latestLease?.property?.name ??
          null,

        unit_number:
          latestLease?.unit?.unit_number ??
          null,

        move_in_date:
          latestLease?.start_date ??
          null,

        monthly_rent:
          latestLease?.rent_amount ??
          0,

        active_lease:
          activeLease,

        lease_history:
          leases,
      };
    }) ?? []
  );
}
