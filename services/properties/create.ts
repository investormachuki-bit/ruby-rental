import { supabase } from "@/lib/supabase";

export type CreatePropertyInput = {
  name: string;
  propertyType: string;
  county?: string;
  town?: string;
  address?: string;
  description?: string;
};

export async function createProperty(
  input: CreatePropertyInput
) {
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

  const { data: property, error } =
    await supabase
      .from("properties")
      .insert({
        workspace_id: profile.workspace_id,

        name: input.name,

        property_type:
          input.propertyType,

        county: input.county,

        town: input.town,

        address: input.address,

        description:
          input.description,
      })
      .select()
      .single();

  if (error) {

    throw error;

  }
      const { error: utilityError } =
    await supabase
      .from("property_utility_settings")
      .insert({
        workspace_id:
          profile.workspace_id,

        property_id:
          property.id,

        water_enabled: true,
        water_billing_method: "Metered",
        water_base_charge: 0,
        water_rate_per_unit: 0,

        electricity_enabled: true,
        electricity_billing_method: "Metered",
        electricity_base_charge: 0,
        electricity_rate_per_unit: 0,

        gas_enabled: false,
        gas_billing_method: "Metered",
        gas_base_charge: 0,
        gas_rate_per_unit: 0,

        default_garbage_fee: 0,
        default_security_fee: 0,
        default_sewer_fee: 0,
        default_parking_fee: 0,
        default_internet_fee: 0,
        default_service_charge: 0,
      });

  if (utilityError) {
    throw utilityError;
  }

  return property;
