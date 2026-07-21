import { supabase } from "@/lib/supabase";
import { getProfile } from "@/services/auth/getProfile";

export async function getInvoices() {
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
    .select(`
      id,
      invoice_number,
      billing_period,
      invoice_date,
      due_date,
      lease_id,
      amount,
      amount_paid,
      balance,
      status,
      tenant:tenants(
        id,
        first_name,
        last_name
      ),
      property:properties(
        id,
        name
      ),
      unit:units(
        id,
        unit_number
      )
    `)
    .eq("workspace_id", profile.workspace_id)
    .order("invoice_date", { ascending: false });

  if (error) {
    throw error;
  }

  return (
    data?.map((invoice: any) => ({
      id: invoice.id,
      invoice_number: invoice.invoice_number,
      tenant_name: `${invoice.tenant?.first_name ?? ""} ${invoice.tenant?.last_name ?? ""}`.trim(),
      tenant_id: invoice.tenant?.id ?? null,
      property_name: invoice.property?.name ?? "",
      property_id: invoice.property?.id ?? null,
      unit_number: invoice.unit?.unit_number ?? "",
      unit_id: invoice.unit?.id ?? null,
      billing_period: invoice.billing_period,
      invoice_date: invoice.invoice_date,
      due_date: invoice.due_date,
      lease_id: invoice.lease_id ?? null,
      amount: Number(invoice.amount ?? 0),
      amount_paid: Number(invoice.amount_paid ?? 0),
      balance: Number(invoice.balance ?? 0),
      status: invoice.status,
    })) ?? []
  );
}
