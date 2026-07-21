import { supabase } from "@/lib/supabase";
import { getProfile } from "@/services/auth/getProfile";

export async function getInvoices() {

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
      id,
      invoice_number,
      billing_period,
      invoice_date,
      due_date,
      amount,
      amount_paid,
      balance,
      status,
      tenant:tenants(
        first_name,
        last_name
      ),
      property:properties(
        name
      ),
      unit:units(
        unit_number
      )
    `)
    .eq(
      "workspace_id",
      profile.workspace_id
    )
    .order(
      "invoice_date",
      {
        ascending: false,
      }
    );

  if (error) {

    throw error;

  }

  return (
    data?.map(
      (invoice: any) => ({

        id:
          invoice.id,

        invoice_number:
          invoice.invoice_number,

        tenant_name:
          `${invoice.tenant?.first_name ?? ""} ${invoice.tenant?.last_name ?? ""}`.trim(),

        property_name:
          invoice.property?.name ?? "",

        unit_number:
          invoice.unit?.unit_number ?? "",

        billing_period:
          invoice.billing_period,

        due_date:
          invoice.due_date,

        amount:
          Number(
            invoice.amount
          ),

        amount_paid:
          Number(
            invoice.amount_paid
          ),

        balance:
          Number(
            invoice.balance
          ),

        status:
          invoice.status,

      })
    ) ?? []
  );

}
