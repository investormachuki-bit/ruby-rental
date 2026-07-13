import { supabase } from "@/lib/supabase";
import { getProfile } from "@/services/auth/getProfile";

type CreatePaymentInput = {
  lease_id: string;

  property_id: string;

  unit_id: string;

  occupant_id: string;

  payment_type:
    | "Rent"
    | "Deposit"
    | "Water"
    | "Electricity"
    | "Service Charge"
    | "Penalty"
    | "Other";

  payment_method:
    | "Cash"
    | "M-Pesa"
    | "Bank"
    | "Cheque";

  amount: number;

  payment_date: string;

  reference_number?: string;

  notes?: string;
};

export async function createPayment(
  input: CreatePaymentInput
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
    // Generate receipt number

  const today = new Date();

  const yyyy =
    today.getFullYear();

  const mm = String(
    today.getMonth() + 1
  ).padStart(2, "0");

  const dd = String(
    today.getDate()
  ).padStart(2, "0");

  const prefix =
    `RCP-${yyyy}${mm}${dd}`;

  const { count } =
    await supabase
      .from("payments")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq(
        "workspace_id",
        profile.workspace_id
      );

  const sequence = String(
    (count ?? 0) + 1
  ).padStart(6, "0");

  const receiptNumber =
    `${prefix}-${sequence}`;

  const { data, error } =
    await supabase
      .from("payments")
      .insert({

        workspace_id:
          profile.workspace_id,

        lease_id:
          input.lease_id,

        property_id:
          input.property_id,

        unit_id:
          input.unit_id,

        occupant_id:
          input.occupant_id,

        receipt_number:
          receiptNumber,

        payment_date:
          input.payment_date,

        payment_type:
          input.payment_type,

        payment_method:
          input.payment_method,

        amount:
          input.amount,

        reference_number:
          input.reference_number ??
          null,

        notes:
          input.notes ?? null,

        received_by:
          session.user.id,

      })
      .select()
      .single();

  if (error) {

    throw error;

  }

  return data;

}
