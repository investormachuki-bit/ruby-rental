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

  // Generate lease number

  const today = new Date();

  const yyyy = today.getFullYear();

  const mm = String(
    today.getMonth() + 1
  ).padStart(2, "0");

  const dd = String(
    today.getDate()
  ).padStart(2, "0");

  const prefix = `LSE-${yyyy}${mm}${dd}`;

  const { count } = await supabase
    .from("leases")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq(
      "workspace_id",
      profile.workspace_id
    );

  const sequence = String(
    (count ?? 0) + 1
  ).padStart(6, "0");

  const leaseNumber =
    `${prefix}-${sequence}`;

  // Create lease

  const {
    data,
    error,
  } = await supabase
    .from("leases")
    .insert({
      workspace_id:
        profile.workspace_id,

      lease_number:
        leaseNumber,

      property_id:
        input.property_id,

      unit_id:
        input.unit_id,

      occupant_id:
        input.occupant_id,

      start_date:
        input.start_date,

      end_date:
        input.end_date ?? null,

      rent_amount:
        input.rent_amount,

      deposit_amount:
        input.deposit_amount,

      rent_due_day:
        input.rent_due_day,

      grace_period_days:
        input.grace_period_days,

      lease_type:
        input.lease_type,

      notes:
        input.notes ?? "",

      status:
        "Active",
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  // Mark unit as occupied

  const { error: unitError } =
    await supabase
      .from("units")
      .update({
        status: "Occupied",
      })
      .eq(
        "id",
        input.unit_id
      )
      .eq(
        "workspace_id",
        profile.workspace_id
      );

  if (unitError) {
    throw unitError;
  }

  return data;
}
