import { supabase } from "@/lib/supabase";

export async function getPropertyUnitStats(
  propertyId: string
) {
  const { data, error } = await supabase
    .from("units")
    .select("status, monthly_rent")
    .eq("property_id", propertyId);

  if (error) throw error;

  const units = data ?? [];

  const totalUnits = units.length;

  const occupied = units.filter(
    (u) => u.status === "Occupied"
  ).length;

  const vacant = units.filter(
    (u) => u.status === "Vacant"
  ).length;

  const monthlyIncome = units.reduce(
    (sum, unit) => sum + Number(unit.monthly_rent),
    0
  );

  return {
    totalUnits,
    occupied,
    vacant,
    monthlyIncome,
  };
}
