import { supabase } from "@/lib/supabase";

export async function getProperties() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("Not authenticated.");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("workspace_id")
    .eq("id", session.user.id)
    .single();

  if (!profile) {
    throw new Error("Profile not found.");
  }

  const { data, error } = await supabase
    .from("properties")
    .select(`
      *,
      units(
        id,
        status,
        monthly_rent
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
    data?.map((property: any) => {
      const units =
        property.units ?? [];

      const totalUnits =
        units.length;

      const occupiedUnits =
        units.filter(
          (u: any) =>
            u.status ===
            "Occupied"
        ).length;

      const vacantUnits =
        units.filter(
          (u: any) =>
            u.status ===
            "Vacant"
        ).length;

      const monthlyIncome =
        units.reduce(
          (
            total: number,
            unit: any
          ) =>
            total +
            Number(
              unit.monthly_rent ??
                0
            ),
          0
        );

      const occupancyRate =
        totalUnits === 0
          ? 0
          : Math.round(
              (occupiedUnits /
                totalUnits) *
                100
            );

      return {
        ...property,

        total_units:
          totalUnits,

        occupied_units:
          occupiedUnits,

        vacant_units:
          vacantUnits,

        monthly_income:
          monthlyIncome,

        occupancy_rate:
          occupancyRate,
      };
    }) ?? []
  );
}
