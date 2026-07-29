import { supabase } from "@/lib/supabase";

export type RefundMethod =
  | "Cash"
  | "M-Pesa"
  | "Bank"
  | "Cheque"
  | "Card"
  | "Other";

export type RefundInput = {
  paymentId: string;
  refundedBy: string;
  refundMethod: RefundMethod;
  amount: number;
  refundDate: string;
  reason: string;
  notes?: string;
};

export async function refundPayment(
  input: RefundInput
) {
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
    .eq("id", input.paymentId)
    .single();

  if (paymentError) {
    throw paymentError;
  }

  if (payment.is_reversed) {
    throw new Error(
      "Reversed payments cannot be refunded."
    );
  }

  const refunded =
    Number(payment.refunded_amount ?? 0);

  const paymentAmount =
    Number(payment.amount);

  const remaining =
    paymentAmount - refunded;

  if (input.amount <= 0) {
    throw new Error(
      "Refund amount must be greater than zero."
    );
  }

  if (input.amount > remaining) {
    throw new Error(
      "Refund amount exceeds remaining refundable balance."
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Create Refund Record
  |--------------------------------------------------------------------------
  */

  const {
    error: refundError,
  } = await supabase
    .from("payment_refunds")
    .insert({

      workspace_id:
        payment.workspace_id,

      payment_id:
        payment.id,

      tenant_id:
        payment.tenant_id,

      amount:
        input.amount,

      refund_method:
        input.refundMethod,

      refund_date:
        input.refundDate,

      reason:
        input.reason,

      notes:
        input.notes ?? null,

      refunded_by:
        input.refundedBy,

    });

  if (refundError) {
    throw refundError;
  }

  /*
  |--------------------------------------------------------------------------
  | Update Payment
  |--------------------------------------------------------------------------
  */

  const newRefundedAmount =
    refunded + input.amount;

  let refundStatus =
    "Partially Refunded";

  if (
    newRefundedAmount === 0
  ) {

    refundStatus =
      "Not Refunded";

  } else if (
    newRefundedAmount >= paymentAmount
  ) {

    refundStatus =
      "Refunded";

  }

  const {
    error: updateError,
  } = await supabase
    .from("payments")
    .update({

      refunded_amount:
        newRefundedAmount,

      refund_status:
        refundStatus,

      last_refunded_at:
        new Date().toISOString(),

      last_refunded_by:
        input.refundedBy,

      updated_at:
        new Date().toISOString(),

    })
    .eq("id", payment.id);

  if (updateError) {
    throw updateError;
  }

  return {

    success: true,

    paymentId:
      payment.id,

    refundedAmount:
      input.amount,

    totalRefunded:
      newRefundedAmount,

    remainingRefundable:
      paymentAmount -
      newRefundedAmount,

    refundStatus,

  };

}

export async function getRefunds() {

  const {
    data,
    error,
  } = await supabase
    .from("payment_refunds")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return data ?? [];

}

export async function getPaymentRefunds(
  paymentId: string
) {

  const {
    data,
    error,
  } = await supabase
    .from("payment_refunds")
    .select("*")
    .eq("payment_id", paymentId)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return data ?? [];

}

export async function getRefundBalance(
  paymentId: string
) {

  const {
    data: payment,
    error,
  } = await supabase
    .from("payments")
    .select(
      "amount, refunded_amount"
    )
    .eq("id", paymentId)
    .single();

  if (error) {
    throw error;
  }

  return {

    paymentAmount:
      Number(payment.amount),

    refundedAmount:
      Number(
        payment.refunded_amount ?? 0
      ),

    remainingRefundable:
      Number(payment.amount) -
      Number(
        payment.refunded_amount ?? 0
      ),

  };

}
