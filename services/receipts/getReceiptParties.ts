import { supabase } from "@/lib/supabase";
import { getProfile } from "@/services/auth/getProfile";

export async function getReceiptParties(
  tenantId: string,
  propertyId: string,
  unitId: string
) {
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

  const [tenantResult, propertyResult, unitResult] = await Promise.all([
    supabase
      .from("tenants")
      .select("id, first_name, last_name, full_name, phone, email")
      .eq("id", tenantId)
      .eq("workspace_id", profile.workspace_id)
      .single(),

    supabase
      .from("properties")
      .select("id, name")
      .eq("id", propertyId)
      .eq("workspace_id", profile.workspace_id)
      .single(),

    supabase
      .from("units")
      .select("id, unit_number")
      .eq("id", unitId)
      .eq("workspace_id", profile.workspace_id)
      .single(),
  ]);

  if (tenantResult.error) throw tenantResult.error;
  if (propertyResult.error) throw propertyResult.error;
  if (unitResult.error) throw unitResult.error;

  return {
    tenant: tenantResult.data,
    property: propertyResult.data,
    unit: unitResult.data,
  };
}
