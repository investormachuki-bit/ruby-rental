import { supabase } from "@/lib/supabase";
import { getProfile } from "@/services/auth/getProfile";

export async function getLeaseInvoices(leaseId: string) {
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
    .from("invoices")
    .select("id, status, balance, amount, amount_paid")
    .eq("workspace_id", profile.workspace_id)
    .eq("lease_id", leaseId)
    .order("invoice_date", { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
}
