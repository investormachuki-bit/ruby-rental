import { supabase } from "@/lib/supabase";
import { getProfile } from "@/services/auth/getProfile";

export async function getDashboardStats() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("Not authenticated.");
  }

  const profile = await getProfile(session.user.id);

  if (!profile) {
    throw new Error("Profile not found.");
  }

  const workspaceId = profile.workspace_id;

  const [{ count: propertyCount }, { data: units }, { count: occupantCount }] =
    await Promise.all([
      supabase
        .from("properties")
        .select("*", { count: "exact", head: true })
        .eq("workspace_id", workspaceId),

      supabase
        .from("units")
        .select("status, monthly_rent")
        .eq("workspace_id", workspaceId),

      supabase
        .from("occupants")
        .select("*", { count: "exact", head: true })
        .eq("workspace_id", workspaceId),
    ]);

  const totalUnits = units?.length ?? 0;

  const occupiedUnits =
    units?.filter(
      (u) => u.status === "Occupied"
    ).length ?? 0;

  const vacantUnits =
    units?.filter(
      (u) => u.status === "Vacant"
    ).length ?? 0;

  const expectedMonthlyRent =
    units?.reduce(
      (sum, unit) =>
        sum + Number(unit.monthly_rent ?? 0),
      0
    ) ?? 0;

  const occupancyRate =
    totalUnits === 0
      ? 0
      : Math.round(
          (occupiedUnits / totalUnits) * 100
        );

  return {
    totalProperties: propertyCount ?? 0,
    totalUnits,
    occupiedUnits,
    vacantUnits,
    totalOccupants: occupantCount ?? 0,
    expectedMonthlyRent,
    occupancyRate,
  };
}
