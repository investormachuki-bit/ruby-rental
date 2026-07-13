import { supabase } from "@/lib/supabase";

export async function terminateLease(
  leaseId: string
) {
  const { error } = await supabase.rpc(
    "terminate_lease",
    {
      lease_uuid: leaseId,
    }
  );

  if (error) {
    throw error;
  }

  return true;
}
