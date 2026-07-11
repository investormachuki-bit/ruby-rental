import { supabase } from "@/lib/supabase";

export async function deleteProperty(id: string) {
  const { error } = await supabase
    .from("properties")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
