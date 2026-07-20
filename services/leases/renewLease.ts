import { supabase } from "@/lib/supabase";
import { getProfile } from "@/services/auth/getProfile";
import { TABLES } from "@/constants/tables";

type RenewLeaseInput = {
  leaseId: string;
  startDate: string;
  endDate: string;
  rentAmount: number;
  depositAmount: number;
  billingDay: number;
  notes?: string;
};

export async function renewLease(
  input: RenewLeaseInput
) {
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

  // Get current lease
  const { data: currentLease, error: leaseError } =
    await supabase
      .from(TABLES.LEASES)
      .select("*")
      .eq("id", input.leaseId)
      .single();

  if (leaseError) {
    throw leaseError;
  }

  // Close current lease
  const { error: updateError } = await supabase
    .from(TABLES.LEASES)
    .update({
      status: "Renewed",
      move_out_date: input.startDate,
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.leaseId);

  if (updateError) {
    throw updateError;
  }

  // Create the renewed lease
  const { data, error } = await supabase
    .from(TABLES.LEASES)
    .insert({
      workspace_id: profile.workspace_id,

      tenant_id: currentLease.tenant_id,

      property_id: currentLease.property_id,

      unit_id: currentLease.unit_id,

      rent_amount: input.rentAmount,

      deposit_amount: input.depositAmount,

      billing_day: input.billingDay,

      move_in_date: input.startDate,

      move_out_date: input.endDate,

      status: "Active",

      notes: input.notes,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}
