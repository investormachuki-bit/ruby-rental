import { supabase } from "@/lib/supabase";

import { updatePaymentAllocationTotals } from "@/services/payments/updatePaymentAllocationTotals";

export type ReconciliationMode = "auto" | "review";

export type ReconciliationCandidate = {
  invoice_id: string;
  invoice_number: string;
  due_date: string | null;
  balance: number;
  allocation_amount: number;
};

export type ReconciliationResult = {
  payment_id: string;
  mode: ReconciliationMode;
  allocated_amount: number;
  unallocated_amount: number;
  allocation_status: "Unallocated" | "Partially Allocated" | "Allocated";
  candidates: ReconciliationCandidate[];
};

export async function buildReconciliationPlan({
  workspaceId,
  leaseId,
  amount,
}: {
  workspaceId: string;
  leaseId: string;
  amount: number;
}): Promise<ReconciliationCandidate[]> {
  if (amount <= 0) {
    return [];
  }

  const { data: invoices, error } = await supabase
    .from("invoices")
    .select("id, invoice_number, balance, due_date")
    .eq("workspace_id", workspaceId)
    .eq("lease_id", leaseId)
    .gt("balance", 0)
    .order("due_date", { ascending: true });

  if (error) {
    throw error;
  }

  const candidates: ReconciliationCandidate[] = [];
  let remaining = amount;

  for (const invoice of invoices ?? []) {
    const balance = Number(invoice.balance);

    if (balance <= 0 || remaining <= 0) {
      continue;
    }

    const allocationAmount = Math.min(balance, remaining);

    candidates.push({
      invoice_id: invoice.id,
      invoice_number: invoice.invoice_number,
      due_date: invoice.due_date,
      balance,
      allocation_amount: allocationAmount,
    });

    remaining -= allocationAmount;
  }

  return candidates;
}

export async function reconcilePayment({
  paymentId,
  workspaceId,
  leaseId,
  amount,
  mode = "auto",
}: {
  paymentId: string;
  workspaceId: string;
  leaseId: string;
  amount: number;
  mode?: ReconciliationMode;
}): Promise<ReconciliationResult> {
  const candidates = await buildReconciliationPlan({
    workspaceId,
    leaseId,
    amount,
  });

  if (candidates.length > 0) {
    const { error: allocationError } = await supabase.rpc(
      "allocate_payment_to_invoices",
      {
        p_workspace_id: workspaceId,
        p_payment_id: paymentId,
        p_lease_id: leaseId,
        p_amount: amount,
      }
    );

    if (allocationError) {
      throw allocationError;
    }
  }

  await updatePaymentAllocationTotals(paymentId);

  const { data: payment, error: paymentError } = await supabase
    .from("payments")
    .select("allocated_amount, unallocated_amount, status")
    .eq("id", paymentId)
    .single();

  if (paymentError) {
    throw paymentError;
  }

  const allocatedAmount = Number(payment?.allocated_amount ?? 0);
  const unallocatedAmount = Number(payment?.unallocated_amount ?? 0);
  let allocationStatus: ReconciliationResult["allocation_status"] = "Unallocated";

  if (allocatedAmount === 0) {
    allocationStatus = "Unallocated";
  } else if (unallocatedAmount === 0) {
    allocationStatus = "Allocated";
  } else {
    allocationStatus = "Partially Allocated";
  }

  return {
    payment_id: paymentId,
    mode,
    allocated_amount: allocatedAmount,
    unallocated_amount: unallocatedAmount,
    allocation_status: allocationStatus,
    candidates,
  };
}
