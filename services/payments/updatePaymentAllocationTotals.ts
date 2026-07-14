import { supabase } from "@/lib/supabase";

export async function updatePaymentAllocationTotals(
  paymentId: string
) {
  const {
    data: payment,
    error: paymentError,
  } = await supabase
    .from("payments")
    .select("amount")
    .eq("id", paymentId)
    .single();

  if (paymentError) {
    throw paymentError;
  }

  const {
    data: allocations,
    error: allocationError,
  } = await supabase
    .from("payment_allocations")
    .select("allocated_amount")
    .eq("payment_id", paymentId);

  if (allocationError) {
    throw allocationError;
  }

  const allocatedAmount = (allocations ?? []).reduce(
    (sum, row) => sum + Number(row.allocated_amount),
    0
  );

  const paymentAmount = Number(payment.amount);

  const unallocatedAmount =
    paymentAmount - allocatedAmount;

  let status:
    | "Unallocated"
    | "Partially Allocated"
    | "Allocated";

  if (allocatedAmount === 0) {
    status = "Unallocated";
  } else if (unallocatedAmount === 0) {
    status = "Allocated";
  } else {
    status = "Partially Allocated";
  }

  const { error } = await supabase
    .from("payments")
    .update({
      allocated_amount: allocatedAmount,
      unallocated_amount: unallocatedAmount,
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", paymentId);

  if (error) {
    throw error;
  }
}
