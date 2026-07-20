import { supabase } from "@/lib/supabase";
import { TABLES } from "@/constants/tables";
import { getProfile } from "@/services/auth/getProfile";

export async function getTenantPayments(
  tenantId: string
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
    .from(TABLES.PAYMENTS)
    .select(`
      *,
      invoice:invoices(
        id,
        invoice_number
      )
    `)
    .eq("workspace_id", profile.workspace_id)
    .eq("tenant_id", tenantId)
    .order("payment_date", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return data ?? [];
}
