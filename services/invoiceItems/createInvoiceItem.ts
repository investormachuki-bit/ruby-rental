import { supabase } from "@/lib/supabase";
import { getProfile } from "@/services/auth/getProfile";

type CreateInvoiceItemInput = {
  invoice_id: string;

  item_type:
    | "Rent"
    | "Water"
    | "Electricity"
    | "Garbage"
    | "Service Charge"
    | "Parking"
    | "Penalty"
    | "Previous Balance"
    | "Deposit"
    | "Other";

  description: string;

  quantity?: number;

  unit_price: number;
};

export async function createInvoiceItem(
  input: CreateInvoiceItemInput
) {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      throw new Error("You are not logged in.");
    }

    const profile =
      await getProfile(session.user.id);

    if (!profile) {
      throw new Error("Profile not found.");
    }

    const quantity =
      input.quantity ?? 1;

    const amount =
      quantity * input.unit_price;

    const {
      data,
      error,
    } = await supabase
      .from("invoice_items")
      .insert({
        invoice_id: input.invoice_id,

        workspace_id: profile.workspace_id,

        item_type: input.item_type,

        description: input.description,

        quantity,

        unit_price: input.unit_price,

        amount,
      })
      .select()
      .single();

    if (error) {
      console.error(
        "CREATE INVOICE ITEM ERROR",
        error
      );

      throw error;
    }

    /*
    --------------------------------------------------------
    No manual invoice total calculation is required.

    The database trigger:

        invoice_items_trigger()

    automatically calls:

        recalculate_invoice_totals()

    after every INSERT / UPDATE / DELETE.

    PostgreSQL is therefore the single source of truth.
    --------------------------------------------------------
    */

    return data;

  } catch (error) {

    console.error(
      "createInvoiceItem() failed",
      error
    );

    throw error;

  }
}
