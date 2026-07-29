import { supabase } from "@/lib/supabase";

export type AllocationItem = {
  invoiceId: string;
  amount: number;
};

export type AllocatePaymentInput = {
  workspaceId: string;
  paymentId: string;
  allocations: AllocationItem[];
  allocatedBy?: string;
  method?:
    | "Automatic"
    | "Manual"
    | "Adjustment";
  notes?: string;
};

export async function validateAllocation(
  workspaceId: string,
  paymentId: string,
  allocations: AllocationItem[]
) {
  const { data: payment, error } =
    await supabase
      .from("payments")
      .select(
        "amount,allocated_amount"
      )
      .eq("workspace_id", workspaceId)
      .eq("id", paymentId)
      .single();

  if (error) throw error;

  const alreadyAllocated =
    Number(
      payment.allocated_amount ?? 0
    );

  const paymentAmount =
    Number(payment.amount);

  const allocationTotal =
    allocations.reduce(
      (sum, item) =>
        sum + item.amount,
      0
    );

  if (
    alreadyAllocated +
      allocationTotal >
    paymentAmount
  ) {
    throw new Error(
      "Allocation exceeds payment amount."
    );
  }

  return {
    paymentAmount,
    alreadyAllocated,
    allocationTotal,
  };
}
import { updatePaymentAllocationTotals } from "./updatePaymentAllocationTotals";

export async function allocatePayment(
  input: AllocatePaymentInput
) {

  await validateAllocation(
    input.workspaceId,
    input.paymentId,
    input.allocations
  );

  const rows = input.allocations.map(
    (allocation) => ({

      workspace_id:
        input.workspaceId,

      payment_id:
        input.paymentId,

      invoice_id:
        allocation.invoiceId,

      allocated_amount:
        allocation.amount,

      allocated_at:
        new Date().toISOString(),

      allocated_by:
        input.allocatedBy ?? null,

      allocation_method:
        input.method ??
        "Manual",

      notes:
        input.notes ?? null,

    })
  );

  const {
    error,
  } = await supabase
    .from("payment_allocations")
    .insert(rows);

  if (error) {
    throw error;
  }

  await updatePaymentAllocationTotals(
    input.paymentId
  );

  return true;

}

export async function allocateToInvoice(
  workspaceId: string,
  paymentId: string,
  invoiceId: string,
  amount: number,
  allocatedBy?: string
) {

  return allocatePayment({

    workspaceId,

    paymentId,

    allocatedBy,

    method: "Manual",

    allocations: [

      {

        invoiceId,

        amount,

      },

    ],

  });

}
export async function getPaymentAllocations(
  paymentId: string
) {

  const {
    data,
    error,
  } = await supabase
    .from("payment_allocations")
    .select(`
      *,
      invoices(
        id,
        invoice_number,
        due_date
      )
    `)
    .eq("payment_id", paymentId)
    .order("allocated_at", {
      ascending: true,
    });

  if (error) {
    throw error;
  }

  return data ?? [];

}

export async function removeAllocation(
  allocationId: string,
  paymentId: string
) {

  const { error } = await supabase
    .from("payment_allocations")
    .delete()
    .eq("id", allocationId);

  if (error) {
    throw error;
  }

  await updatePaymentAllocationTotals(
    paymentId
  );

  return true;

}

export async function recalculateBalances(
  paymentId: string
) {

  await updatePaymentAllocationTotals(
    paymentId
  );

}

export async function allocateMany(
  input: AllocatePaymentInput
) {

  return allocatePayment(input);

}
