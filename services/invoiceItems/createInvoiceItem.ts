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

  const {
    data: { session },
  } =
    await supabase.auth.getSession();

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

  const quantity =
    input.quantity ?? 1;

  const amount =
    quantity *
    input.unit_price;
    const { data, error } =
    await supabase
      .from("invoice_items")
      .insert({

        invoice_id:
          input.invoice_id,

        workspace_id:
          profile.workspace_id,

        item_type:
          input.item_type,

        description:
          input.description,

        quantity,

        unit_price:
          input.unit_price,

        amount,

      })
      .select()
      .single();

  if (error) {

    throw error;

  }

  const {
    data: items,
    error: totalError,
  } = await supabase
    .from("invoice_items")
    .select("amount")
    .eq(
      "invoice_id",
      input.invoice_id
    );

  if (totalError) {

    throw totalError;

  }

  const total =
    (items ?? []).reduce(
      (sum, item) =>
        sum + Number(item.amount),
      0
    );

const {
  data: invoice,
  error: invoiceError,
} = await supabase
  .from("invoices")
  .select("amount_paid")
  .eq(
    "id",
    input.invoice_id
  )
  .single();

if (invoiceError) {

  throw invoiceError;

}

const amountPaid =
  Number(
    invoice.amount_paid ?? 0
  );

const balance =
  total - amountPaid;

const { error: updateError } =
  await supabase
    .from("invoices")
    .update({

      amount: total,

      balance,

    })
    .eq(
      "id",
      input.invoice_id
    );

  if (updateError) {

    throw updateError;

  }

  return data;

}
