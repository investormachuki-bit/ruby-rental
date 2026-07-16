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
    const defaultUtilities = [

    {
      workspace_id:
        profile.workspace_id,

      property_id:
        property.id,

      utility_type:
        "Water",

      billing_type:
        "Metered",

      unit_rate: 0,

      is_active: true,
    },

    {
      workspace_id:
        profile.workspace_id,

      property_id:
        property.id,

      utility_type:
        "Electricity",

      billing_type:
        "Metered",

      unit_rate: 0,

      is_active: true,
    },

  ];

  const {
    error: utilityError,
  } = await supabase
    .from(
      "property_utility_settings"
    )
    .insert(defaultUtilities);

  if (utilityError) {

    throw utilityError;

  }

  return property;

}
