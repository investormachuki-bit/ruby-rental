import { supabase } from "@/lib/supabase";

export async function getUnitDetails(unitId: string) {

  const { data: unit, error } = await supabase
    .from("units")
    .select(`
      *,
      property:properties(
        id,
        name,
        property_type,
        workspace_id
      ),
      occupant:tenants(*),
      lease:leases(*)
    `)
    .eq("id", unitId)
    .maybeSingle();

  if (error) throw error;

  const { data: meters, error: meterError } =
    await supabase
      .from("utility_meters")
      .select(`
        *,
        latest_reading:meter_readings(
          current_reading,
          amount
        )
      `)
      .eq("unit_id", unitId);

  if (meterError) throw meterError;

  return {
    unit,
    meters: meters ?? [],
  };

}
