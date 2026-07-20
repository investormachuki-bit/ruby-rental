import { supabase } from "@/lib/supabase";
import { getProfile } from "@/services/auth/getProfile";
import { TABLES } from "@/constants/tables";

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
      .from(TABLES.LEASES)
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
        tenant:tenants(
  id,
  tenant_code,
  full_name,
  phone,
  email,
  id_number,
  occupation,
  employer,
  emergency_contact_name,
  emergency_contact_phone,

  first_name,
  last_name
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
  console.error("getLease error:", error);
  throw error;
}

  return data;
}
