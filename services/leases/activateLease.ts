import { supabase } from "@/lib/supabase";

export async function activateLease(
  leaseId: string
) {
  const { error } = await supabase.rpc(
    "activate_lease",
    {
      lease_uuid: leaseId,
    }
  );

  if (error) {
    throw error;
  }

  return true;
}
