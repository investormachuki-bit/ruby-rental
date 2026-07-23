import { supabase } from "@/lib/supabase";

export async function getUnitDetails(unitId: string) {

  // Get unit
  const { data: unit, error: unitError } =
    await supabase
      .from("units")
      .select(`
        *,
        property:properties(
          id,
          name,
          property_type,
          workspace_id
        )
      `)
      .eq("id", unitId)
      .single();

  if (unitError) throw unitError;

  // Get active lease
  const { data: lease, error: leaseError } =
    await supabase
      .from("leases")
      .select("*")
      .eq("unit_id", unitId)
      .eq("status", "Active")
      .maybeSingle();

  if (leaseError) throw leaseError;

  let occupant = null;

  if (lease?.tenant_id) {

    const { data: tenant, error: tenantError } =
      await supabase
        .from("tenants")
        .select("*")
        .eq("id", lease.tenant_id)
        .maybeSingle();

    if (tenantError) throw tenantError;

    occupant = tenant;

  }

  const { data: meters, error: meterError } =
    await supabase
      .from("utility_meters")
      .select("*")
      .eq("unit_id", unitId);

  if (meterError) throw meterError;

  return {
    unit: {
      ...unit,
      lease,
      occupant,
    },
    meters: meters ?? [],
  };

}
