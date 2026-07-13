import { supabase } from "@/lib/supabase";
import { getProfile } from "@/services/auth/getProfile";

export type UpdateLeaseInput = {
  property_id: string;
  unit_id: string;
  occupant_id: string;

  start_date: string;
  end_date?: string | null;

  rent_amount: number;
  deposit_amount: number;

  billing_day: number;

  status: string;

  notes?: string;
};

export async function updateLease(
  leaseId: string,
  input: UpdateLeaseInput
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

  const { data, error } = await supabase
    .from("leases")
    .update({
      property_id: input.property_id,
      unit_id: input.unit_id,
      occupant_id: input.occupant_id,

      start_date: input.start_date,
      end_date: input.end_date ?? null,

      rent_amount: input.rent_amount,
      deposit_amount: input.deposit_amount,

      billing_day: input.billing_day,

      status: input.status,

      notes: input.notes ?? "",
    })
    .eq("workspace_id", profile.workspace_id)
    .eq("id", leaseId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}
