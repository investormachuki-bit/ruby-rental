import { supabase } from "@/lib/supabase";
import { updatePaymentAllocationTotals } from "./updatePaymentAllocationTotals";

type ReversePaymentInput = {
  paymentId: string;
  reversedBy: string;
  reason: string;
};

export async function reversePayment({
  paymentId,
  reversedBy,
  reason,
}: ReversePaymentInput) {

  /*
  |--------------------------------------------------------------------------
  | Load Payment
  |--------------------------------------------------------------------------
  */

  const {
    data: payment,
    error: paymentError,
  } = await supabase
    .from("payments")
    .select("*")
    .eq("id", paymentId)
    .single();

  if (paymentError) {
    throw paymentError;
  }

  if (payment.is_reversed) {
    throw new Error(
      "Payment has already been reversed."
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Reverse Allocations
  |--------------------------------------------------------------------------
  */

  const {
    data: allocations,
    error: allocationError,
  } = await supabase
    .from("payment_allocations")
    .select("*")
    .eq("payment_id", paymentId)
    .eq("is_reversed", false);

  if (allocationError) {
    throw allocationError;
  }

  for (const allocation of allocations ?? []) {

    /*
    |--------------------------------------------------------------------------
    | Restore Invoice
    |--------------------------------------------------------------------------
    */

    const {
      data: invoice,
      error: invoiceError,
    } = await supabase
      .from("invoices")
      .select("amount_paid,balance,amount")
      .eq("id", allocation.invoice_id)
      .single();

    if (invoiceError) {
      throw invoiceError;
    }

    const amountPaid =
      Number(invoice.amount_paid) -
      Number(allocation.allocated_amount);

    const balance =
      Number(invoice.balance) +
      Number(allocation.allocated_amount);

    let status = "Partially Paid";

    if (amountPaid <= 0) {

      status = "Unpaid";

    } else if (
      balance <= 0
    ) {

      status = "Paid";

    }

    const {
      error: updateInvoiceError,
    } = await supabase
      .from("invoices")
      .update({

        amount_paid:
          Math.max(amountPaid, 0),

        balance,

        status,

        updated_at:
          new Date().toISOString(),

      })
      .eq("id", allocation.invoice_id);

    if (updateInvoiceError) {
      throw updateInvoiceError;
    }

    /*
    |--------------------------------------------------------------------------
    | Reverse Allocation
    |--------------------------------------------------------------------------
    */

    const {
      error: reverseAllocationError,
    } = await supabase
      .from("payment_allocations")
      .update({

        is_reversed: true,

        reversed_at:
          new Date().toISOString(),

        reversed_by:
          reversedBy,

        reversal_reason:
          reason,

      })
      .eq("id", allocation.id);

    if (reverseAllocationError) {
      throw reverseAllocationError;
    }

  }

  /*
  |--------------------------------------------------------------------------
  | Reverse Tenant Credits
  |--------------------------------------------------------------------------
  */

  const {
    error: creditError,
  } = await supabase
    .from("tenant_credits")
    .update({

      is_reversed: true,

      status: "Reversed",

      remaining_amount: 0,

      reversed_at:
        new Date().toISOString(),

      reversed_by:
        reversedBy,

      reversal_reason:
        reason,

      updated_at:
        new Date().toISOString(),

    })
    .eq("payment_id", paymentId)
    .eq("is_reversed", false);

  if (creditError) {
    throw creditError;
  }

  /*
  |--------------------------------------------------------------------------
  | Update Payment Totals
  |--------------------------------------------------------------------------
  */

  await updatePaymentAllocationTotals(
    paymentId
  );

  /*
  |--------------------------------------------------------------------------
  | Reverse Payment
  |--------------------------------------------------------------------------
  */

  const {
    error: paymentUpdateError,
  } = await supabase
    .from("payments")
    .update({

      status: "Reversed",

      is_reversed: true,

      allocated_amount: 0,

      unallocated_amount:
        payment.amount,

      reversed_at:
        new Date().toISOString(),

      reversed_by:
        reversedBy,

      reversal_reason:
        reason,

      updated_at:
        new Date().toISOString(),

    })
    .eq("id", paymentId);

  if (paymentUpdateError) {
    throw paymentUpdateError;
  }

  return {

    success: true,

    paymentId,

    message:
      "Payment reversed successfully.",

  };

}
