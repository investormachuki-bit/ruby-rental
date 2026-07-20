import { supabase } from "@/lib/supabase";
import { getProfile } from "@/services/auth/getProfile";
import { TABLES } from "@/constants/tables";

export type CreateLeaseInput = {
  property_id: string;
  unit_id: string;

  tenant_id: string;

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

  // Generate Lease Number

  const today = new Date();

  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(
    2,
    "0"
  );
  const dd = String(today.getDate()).padStart(
    2,
    "0"
  );

  const prefix = `LSE-${yyyy}${mm}${dd}`;

  const { count, error: countError } =
    await supabase
      .from(TABLES.LEASES)
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq(
        "workspace_id",
        profile.workspace_id
      );

  if (countError) {
    console.error(
      "Lease count error:",
      countError
    );
    throw countError;
  }

  const sequence = String(
    (count ?? 0) + 1
  ).padStart(6, "0");

  const leaseNumber =
    `${prefix}-${sequence}`;

  // Create Lease

  const {
    data,
    error,
  } = await supabase
    .from(TABLES.LEASES)
    .insert({
      workspace_id:
        profile.workspace_id,

      lease_number:
        leaseNumber,

      property_id:
        input.property_id,

      unit_id:
        input.unit_id,

      tenant_id:
        input.tenant_id,

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
    console.error(
      "Create Lease Error:",
      error
    );
    throw error;
  }

  // Mark Unit as Occupied

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
    console.error(
      "Unit Update Error:",
      unitError
    );
    throw unitError;
  }

  return data;
}
