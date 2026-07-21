import { supabase } from "@/lib/supabase";
import { getProfile } from "@/services/auth/getProfile";

export async function getInvoiceById(
  invoiceId: string
) {

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {

    throw new Error(
      "You are not logged in."
    );

  }

  const profile =
    await getProfile(
      session.user.id
    );

  if (!profile) {

    throw new Error(
      "Profile not found."
    );

  }

  const {
    data,
    error,
  } = await supabase
    .from("invoices")
    .select(`
      *,
      tenant:tenants(*),
      property:properties(*),
      unit:units(*),
      lease:leases(*),
      invoice_items(*),
      payment_allocations(
        allocated_amount,
        allocated_at,
        payment:payments(*)
      )
    `)
    .eq(
      "workspace_id",
      profile.workspace_id
    )
    .eq(
      "id",
      invoiceId
    )
    .single();

  if (error) {

    throw error;

  }

  return data;

}
