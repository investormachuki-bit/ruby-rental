import { supabase } from "@/lib/supabase";

export async function terminateLease(
  leaseId: string
) {
  // Calls the database function that terminates a lease
  // and performs all related business logic.

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
