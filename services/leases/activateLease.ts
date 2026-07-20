import { supabase } from "@/lib/supabase";

export async function activateLease(
  leaseId: string
) {
  // Calls the database function that activates a lease
  // and performs all related business logic.

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
