import { supabase } from "@/lib/supabase";
import { getProfile } from "@/services/auth/getProfile";

export async function getPropertyConfiguration(
  propertyId: string
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

  const [propertyResult, utilityResult] =
    await Promise.all([
      supabase
        .from("properties")
        .select(`
          id,
          name,
          property_type,
          billing_day,
          rent_due_day,
          billing_basis,
          utility_billing_basis,
          invoice_generation_mode
        `)
        .eq("id", propertyId)
        .eq("workspace_id", profile.workspace_id)
        .single(),

      supabase
        .from("property_utility_settings")
        .select("*")
        .eq("property_id", propertyId)
        .eq("workspace_id", profile.workspace_id)
        .maybeSingle(),
    ]);

  if (propertyResult.error) {
    throw propertyResult.error;
  }

  if (utilityResult.error) {
    throw utilityResult.error;
  }

  return {
    property: propertyResult.data,
    utilities: utilityResult.data,
  };
}
