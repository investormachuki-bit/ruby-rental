import { supabase } from "@/lib/supabase";

export async function createTenantCredit({
  workspaceId,
  tenantId,
  paymentId,
  amount,
  notes,
}: {
  workspaceId: string;
  tenantId: string;
  paymentId?: string;
  amount: number;
  notes?: string;
}) {
  const { data, error } = await supabase
    .from("tenant_credits")
    .insert({
      workspace_id: workspaceId,
      tenant_id: tenantId,
      payment_id: paymentId ?? null,
      amount,
      remaining_amount: amount,
      status: "Available",
      notes: notes ?? null,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function getTenantCredits(
  tenantId: string
) {
  const { data, error } = await supabase
    .from("tenant_credits")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("created_at", {
      ascending: true,
    });

  if (error) {
    throw error;
  }

  return data ?? [];
}
export async function getAvailableCredit(
  tenantId: string
) {
  const { data, error } = await supabase
    .from("tenant_credits")
    .select("remaining_amount")
    .eq("tenant_id", tenantId)
    .eq("status", "Available");

  if (error) {
    throw error;
  }

  return (data ?? []).reduce(
    (sum, row) => sum + Number(row.remaining_amount),
    0
  );
}

export async function consumeCredit({
  creditId,
  amount,
}: {
  creditId: string;
  amount: number;
}) {
  const { data: credit, error } = await supabase
    .from("tenant_credits")
    .select("*")
    .eq("id", creditId)
    .single();

  if (error) {
    throw error;
  }

  const remaining =
    Number(credit.remaining_amount) - amount;

  const { data, error: updateError } =
    await supabase
      .from("tenant_credits")
      .update({
        remaining_amount: Math.max(remaining, 0),
        status:
          remaining <= 0
            ? "Consumed"
            : "Available",
        updated_at: new Date().toISOString(),
      })
      .eq("id", creditId)
      .select()
      .single();

  if (updateError) {
    throw updateError;
  }

  return data;
}

export async function applyCreditToInvoice({
  tenantId,
  invoiceId,
  amount,
}: {
  tenantId: string;
  invoiceId: string;
  amount: number;
}) {
  const { data: credits, error } =
    await supabase
      .from("tenant_credits")
      .select("*")
      .eq("tenant_id", tenantId)
      .eq("status", "Available")
      .order("created_at", {
        ascending: true,
      });

  if (error) {
    throw error;
  }

  let remaining = amount;

  for (const credit of credits ?? []) {

    if (remaining <= 0) {
      break;
    }

    const available = Number(
      credit.remaining_amount
    );

    const consume = Math.min(
      available,
      remaining
    );

    await consumeCredit({
      creditId: credit.id,
      amount: consume,
    });

    remaining -= consume;

  }

  return {
    requested: amount,
    applied: amount - remaining,
    remaining,
    invoiceId,
  };
}
