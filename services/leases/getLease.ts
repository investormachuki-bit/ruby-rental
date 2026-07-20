import { supabase } from "@/lib/supabase";
import { getProfile } from "@/services/auth/getProfile";
import { TABLES } from "@/constants/tables";

export async function getLease(
  leaseId: string
) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("Not authenticated.");
  }

  const profile = await getProfile(
    session.user.id
  );

  if (!profile) {
    throw new Error("Profile not found.");
  }
const { data, error } = await supabase
  .from(TABLES.LEASES)
  .select("*")
  .eq("workspace_id", profile.workspace_id)
  .eq("id", leaseId)
  .single();
if (error) {
  console.error("getLease error:", error);
  throw error;
}

  return data;
}
