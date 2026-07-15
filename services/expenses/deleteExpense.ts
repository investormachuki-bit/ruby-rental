import { supabase } from "@/lib/supabase";

import { getProfile } from "@/services/auth/getProfile";

export async function deleteExpense(
  id: string
): Promise<void> {

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

  const { error } = await supabase
    .from("expenses")
    .delete()
    .eq("workspace_id", profile.workspace_id)
    .eq("id", id);

  if (error) {
    throw error;
  }

  return;
}
