import { supabase } from "@/lib/supabase";
import { getProfile } from "@/services/auth/getProfile";

export type CreateLeaseInput = {
  property_id: string;
  unit_id: string;
  occupant_id: string;

  start_date: string;
  end_date?: string | null;

  rent_amount: number;
  deposit_amount: number;

  rent_due_day: number;

  grace_period_days: number;

  lease_type: "Open-ended" | "Fixed Term";

  notes?: string;
};

export async function createLease(
  input: CreateLeaseInput
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
    .insert({
      workspace_id: profile.workspace_id,

      property_id: input.property_id,
      unit_id: input.unit_id,
      occupant_id: input.occupant_id,

      start_date: input.start_date,
      end_date: input.end_date ?? null,

      rent_amount: input.rent_amount,
      deposit_amount: input.deposit_amount,

      rent_due_day: input.rent_due_day,

      grace_period_days:
        input.grace_period_days,

      lease_type: input.lease_type,

      notes: input.notes ?? "",

      status: "Draft",
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}
