import { supabase } from "@/lib/supabase";

export type SubscriptionQuote = {
  plan_id: string;
  plan_name: string;
  subscribed_units: number;
  rate_per_unit: number;
  monthly_amount: number;
  currency: string;
};

export type CustomerSubscription = {
  id: string;
  workspace_id: string;
  plan_id: string;
  subscribed_units: number;
  rate_per_unit: number;
  monthly_amount: number;
  currency: string;
  status: string;
  start_date: string;
  next_billing_date: string | null;
  created_at: string;
  updated_at: string;
};


/* =========================================================
   CALCULATE SUBSCRIPTION QUOTE
========================================================= */

export async function calculateSubscriptionQuote(
  units: number,
): Promise<{
  data: SubscriptionQuote | null;
  error: string | null;
}> {

  if (!Number.isInteger(units) || units < 1) {
    return {
      data: null,
      error: "Enter at least 1 unit.",
    };
  }

  const {
    data,
    error,
  } = await supabase.rpc(
    "calculate_subscription_quote",
    {
      p_units: units,
    },
  );

  if (error) {

    console.error(
      "Failed to calculate subscription:",
      error,
    );

    return {
      data: null,
      error: error.message,
    };
  }

  if (!data || data.length === 0) {
    return {
      data: null,
      error:
        "No subscription package is available for this number of units.",
    };
  }

  const quote = data[0];

  return {
    data: {
      plan_id: quote.plan_id,
      plan_name: quote.plan_name,

      subscribed_units:
        Number(quote.subscribed_units),

      rate_per_unit:
        Number(quote.rate_per_unit),

      monthly_amount:
        Number(quote.monthly_amount),

      currency:
        quote.currency,
    },

    error: null,
  };
}


/* =========================================================
   ENSURE CUSTOMER SUBSCRIPTION
========================================================= */

/**
 * Creates a Trial subscription for a new customer.
 *
 * For an existing Trial subscription, it updates the
 * subscription according to the customer's selected units.
 *
 * It NEVER changes:
 *
 * - an Active subscription
 * - a subscription with a Pending payment
 *
 * This prevents customers from changing their amount
 * after submitting payment evidence.
 */

export async function ensureCurrentWorkspaceSubscription(
  units: number,
): Promise<{
  data: CustomerSubscription | null;
  error: string | null;
}> {

  if (!Number.isInteger(units) || units < 1) {
    return {
      data: null,
      error: "Enter at least 1 unit.",
    };
  }

  const {
    data,
    error,
  } = await supabase.rpc(
    "ensure_current_workspace_subscription",
    {
      p_units: units,
    },
  );

  if (error) {

    console.error(
      "Failed to prepare customer subscription:",
      error,
    );

    return {
      data: null,
      error: error.message,
    };
  }

  const row =
    Array.isArray(data)
      ? data[0]
      : data;

  if (!row) {
    return {
      data: null,
      error:
        "Ruby Rental could not prepare your subscription.",
    };
  }

  return {
    data: {
      ...row,

      subscribed_units:
        Number(row.subscribed_units),

      rate_per_unit:
        Number(row.rate_per_unit),

      monthly_amount:
        Number(row.monthly_amount),

    } as CustomerSubscription,

    error: null,
  };
}


/* =========================================================
   ACTIVATE SUBSCRIPTION
========================================================= */

export async function activateSubscription(
  units: number,
): Promise<{
  data: any | null;
  error: string | null;
}> {

  if (!Number.isInteger(units) || units < 1) {
    return {
      data: null,
      error: "Enter at least 1 unit.",
    };
  }

  const {
    data,
    error,
  } = await supabase.rpc(
    "activate_subscription",
    {
      p_units: units,
    },
  );

  if (error) {

    console.error(
      "Failed to activate subscription:",
      error,
    );

    return {
      data: null,
      error: error.message,
    };
  }

  return {
    data,
    error: null,
  };
}