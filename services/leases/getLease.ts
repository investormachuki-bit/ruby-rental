import { supabase } from "@/lib/supabase";
import { getProfile } from "@/services/auth/getProfile";

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

  const { data, error } =
    await supabase
      .from("leases")
      .select(`
        *,
        property:properties(
          id,
          name,
          county,
          town
        ),
        unit:units(
          id,
          unit_number,
          floor_name
        ),
        occupant:occupants(
          id,
          first_name,
          last_name,
          phone_number,
          email,
          id_number
        ),
        invoices(
          id,
          invoice_number,
          invoice_type,
          billing_period,
          invoice_date,
          due_date,
          amount,
          amount_paid,
          balance,
          status,
          created_at
        ),
        payments(
          id,
          receipt_number,
          payment_date,
          payment_type,
          payment_method,
          amount,
          status,
          reference_number,
          created_at
        )
      `)
      .eq(
        "workspace_id",
        profile.workspace_id
      )
      .eq("id", leaseId)
      .order("created_at", {
        foreignTable: "invoices",
        ascending: false,
      })
      .order("payment_date", {
        foreignTable: "payments",
        ascending: false,
      })
      .single();

  if (error) {
    throw error;
  }

  return data;
}
