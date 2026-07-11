import { supabase } from "@/lib/supabase";

export type UpdatePropertyInput = {
  id: string;
  name: string;
  propertyType: string;
  county?: string;
  town?: string;
  address?: string;
  description?: string;
};

export async function updateProperty(
  input: UpdatePropertyInput
) {
  const { data, error } = await supabase
    .from("properties")
    .update({
      name: input.name,
      property_type: input.propertyType,
      county: input.county,
      town: input.town,
      address: input.address,
      description: input.description,
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.id)
    .select()
    .single();

  if (error) throw error;

  return data;
}
