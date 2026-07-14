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

  const profile =
    await getProfile(session.user.id);

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
          amount,
          amount_paid,
          balance,
          status,
          due_date,
          created_at
        )
      `)
      .eq(
        "workspace_id",
        profile.workspace_id
      )
      .eq("id", leaseId)
      .single();

  if (error) throw error;

  const unpaidInvoices =
    (data.invoices ?? [])
      .filter(
        (invoice: any) =>
          invoice.balance > 0
      )
      .sort(
        (a: any, b: any) =>
          new Date(a.due_date).getTime() -
          new Date(b.due_date).getTime()
      );

  return {
    ...data,

    invoice_id:
      unpaidInvoices[0]?.id ?? null,

    current_invoice:
      unpaidInvoices[0] ?? null,
  };
}
