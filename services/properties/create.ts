import { supabase } from "@/lib/supabase";

export type CreatePropertyInput = {
  workspaceId: string;
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
  const { data, error } = await supabase
    .from("properties")
    .insert({
      workspace_id: input.workspaceId,
      name: input.name,
      property_type: input.propertyType,
      county: input.county,
      town: input.town,
      address: input.address,
      description: input.description,
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}
