import { supabase } from "@/lib/supabase";
import { TABLES } from "@/constants/tables";
import { getProfile } from "@/services/auth/getProfile";

export async function getTenantInvoices(
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
    .from(TABLES.INVOICES)
    .select(`
      *,
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
    .eq("tenant_id", tenantId)
    .order("invoice_date", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  const invoices = data ?? [];

  const totalInvoiced = invoices.reduce(
    (sum: number, invoice: any) =>
      sum + Number(invoice.total_amount ?? invoice.amount ?? 0),
    0
  );

  const totalPaid = invoices.reduce(
    (sum: number, invoice: any) =>
      sum + Number(invoice.amount_paid ?? 0),
    0
  );

  const outstandingBalance = totalInvoiced - totalPaid;

  const overdueInvoices = invoices.filter(
    (invoice: any) =>
      invoice.status !== "Paid" &&
      invoice.due_date &&
      new Date(invoice.due_date) < new Date()
  );

  return {
    invoices,
    summary: {
      totalInvoiced,
      totalPaid,
      outstandingBalance,
      overdueInvoices: overdueInvoices.length,
    },
  };
}
