import { supabase } from "@/lib/supabase";
import { getProfile } from "@/services/auth/getProfile";

type CreateInvoiceInput = {
  lease_id: string;

  property_id: string;

  unit_id: string;

  tenant_id: string;

  invoice_type:
    | "Rent"
    | "Deposit"
    | "Water"
    | "Electricity"
    | "Service Charge"
    | "Penalty"
    | "Other";

  billing_period: string;

  invoice_date: string;

  due_date: string;

  notes?: string;
};

export async function createInvoice(
  input: CreateInvoiceInput
) {
  try {
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

    // Generate invoice number

    const today = new Date();

    const yyyy = today.getFullYear();

    const mm = String(
      today.getMonth() + 1
    ).padStart(2, "0");

    const dd = String(
      today.getDate()
    ).padStart(2, "0");

    const prefix = `INV-${yyyy}${mm}${dd}`;

    const { count, error: countError } =
      await supabase
        .from("invoices")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq(
          "workspace_id",
          profile.workspace_id
        );

    if (countError) {
      throw countError;
    }

    const sequence = String(
      (count ?? 0) + 1
    ).padStart(6, "0");

    const invoiceNumber =
      `${prefix}-${sequence}`;

    const {
      data,
      error,
    } = await supabase
      .from("invoices")
      .insert({

        workspace_id:
          profile.workspace_id,

        lease_id:
          input.lease_id,

        property_id:
          input.property_id,

        unit_id:
          input.unit_id,

        tenant_id:
          input.tenant_id,

        invoice_number:
          invoiceNumber,

        invoice_type:
          input.invoice_type,

        billing_period:
          input.billing_period,

        invoice_date:
          input.invoice_date,

        due_date:
          input.due_date,

        amount: 0,

        amount_paid: 0,

        balance: 0,

        status: "Issued",

        notes:
          input.notes ?? null,

      })
      .select()
      .single();

    if (error) {

      console.error(
        "SUPABASE CREATE INVOICE ERROR",
        error
      );

      alert(
        JSON.stringify(
          error,
          null,
          2
        )
      );

      throw error;
    }

    return data;

  } catch (error: any) {

    console.error(
      "createInvoice() failed",
      error
    );

    alert(
      JSON.stringify(
        error,
        null,
        2
      )
    );

    throw error;
  }
}
