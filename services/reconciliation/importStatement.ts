import { supabase } from "@/lib/supabase";

import { getProfile } from "@/services/auth/getProfile";

import { reconcilePayment } from "@/services/payments/reconcilePayment";

type ImportedTransactionRecord = {
  id?: string;
  workspace_id?: string;
  source_type: string;
  source_name: string;
  transaction_date: string;
  amount: number;
  reference_number: string | null;
  transaction_code: string | null;
  narration: string | null;
  sender_name: string | null;
  phone_number: string | null;
  bank_account: string | null;
  status: string;
  confidence_score: number | null;
  matching_decision: string | null;
  created_at?: string;
  updated_at?: string;
};

type ImportStatementInput = {
  sourceType: string;
  sourceName: string;
  transactions: Array<{
    transaction_date: string;
    amount: number;
    reference_number?: string | null;
    transaction_code?: string | null;
    narration?: string | null;
    sender_name?: string | null;
    phone_number?: string | null;
    bank_account?: string | null;
  }>;
};

export async function importStatement(input: ImportStatementInput) {
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

  const existingQuery = await supabase
    .from("reconciliation_transactions")
    .select("reference_number")
    .eq("workspace_id", profile.workspace_id)
    .eq("source_name", input.sourceName);

  if (existingQuery.error) {
    throw existingQuery.error;
  }

  const existingReferences = new Set(
    (existingQuery.data ?? [])
      .map((row: { reference_number?: string | null }) => row.reference_number)
      .filter(Boolean)
  );

  const records: ImportedTransactionRecord[] = input.transactions.map((transaction) => ({
    workspace_id: profile.workspace_id,
    source_type: input.sourceType,
    source_name: input.sourceName,
    transaction_date: transaction.transaction_date,
    amount: Number(transaction.amount),
    reference_number: transaction.reference_number ?? null,
    transaction_code: transaction.transaction_code ?? null,
    narration: transaction.narration ?? null,
    sender_name: transaction.sender_name ?? null,
    phone_number: transaction.phone_number ?? null,
    bank_account: transaction.bank_account ?? null,
    status: "Imported",
    confidence_score: 0,
    matching_decision: "Pending",
  }));

  const deduped = records.filter((record) => {
    const normalized = record.reference_number ?? `${record.transaction_date}:${record.amount}`;
    return !existingReferences.has(normalized);
  });

  if (deduped.length === 0) {
    return { imported: 0, duplicates: records.length, skipped: records.length };
  }

  const { data, error } = await supabase
    .from("reconciliation_transactions")
    .insert(deduped)
    .select();

  if (error) {
    throw error;
  }

  return {
    imported: data?.length ?? 0,
    duplicates: records.length - (data?.length ?? 0),
    skipped: records.length - (data?.length ?? 0),
  };
}
