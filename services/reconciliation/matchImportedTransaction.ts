import { supabase } from "@/lib/supabase";

import { getProfile } from "@/services/auth/getProfile";

import { createPayment } from "@/services/payments/createPayment";

import { reconcilePayment } from "@/services/payments/reconcilePayment";

type MatchImportedTransactionInput = {
  transactionId: string;
  leaseId?: string;
  invoiceId?: string;
  tenantName?: string;
  unitNumber?: string;
  houseNumber?: string;
  leaseNumber?: string;
  amount?: number;
  paymentMethod?: "Cash" | "M-Pesa" | "Bank" | "Cheque";
  referenceNumber?: string;
  notes?: string;
};

export async function matchImportedTransaction(input: MatchImportedTransactionInput) {
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

  const { data: transaction, error: transactionError } = await supabase
    .from("reconciliation_transactions")
    .select("*")
    .eq("id", input.transactionId)
    .single();

  if (transactionError || !transaction) {
    throw transactionError ?? new Error("Imported transaction not found.");
  }

  if (!input.leaseId) {
    return {
      status: "Needs Review",
      confidence: 0,
      decision: "No lease selected",
    };
  }

  const paymentAmount = Number(input.amount ?? transaction.amount ?? 0);

  if (paymentAmount <= 0) {
    throw new Error("Payment amount must be greater than zero.");
  }

  const payment = await createPayment({
    lease_id: input.leaseId,
    property_id: "",
    unit_id: "",
    tenant_id: "",
    payment_type: "Rent",
    payment_method: input.paymentMethod ?? "M-Pesa",
    payment_date: transaction.transaction_date,
    amount: paymentAmount,
    reference_number: input.referenceNumber ?? transaction.reference_number ?? undefined,
    notes: input.notes ?? transaction.narration ?? undefined,
  });

  const reconciliation = await reconcilePayment({
    paymentId: payment.payment.id,
    workspaceId: profile.workspace_id,
    leaseId: input.leaseId,
    amount: paymentAmount,
    mode: "review",
  });

  await supabase
    .from("reconciliation_transactions")
    .update({
      status: reconciliation.allocation_status === "Allocated" ? "Reconciled" : "Needs Review",
      confidence_score: 95,
      matching_decision: "Manual",
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.transactionId);

  return {
    status: reconciliation.allocation_status === "Allocated" ? "Reconciled" : "Needs Review",
    confidence: 95,
    decision: "Manual",
    reconciliation,
  };
}
