import { supabase } from "@/lib/supabase";

export type SubscriptionQuote = {
  plan_id: string;
  plan_name: string;
  subscribed_units: number;
  rate_per_unit: number;
  monthly_amount: number;
  currency: string;
};

export async function calculateSubscriptionQuote(
  units: number
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

  const { data, error } = await supabase.rpc(
    "calculate_subscription_quote",
    {
      p_units: units,
    }
  );

  if (error) {
    console.error(
      "Failed to calculate subscription:",
      error
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
      currency: quote.currency,
    },
    error: null,
  };
}

export async function activateSubscription(
  units: number
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

  const { data, error } = await supabase.rpc(
    "activate_subscription",
    {
      p_units: units,
    }
  );

  if (error) {
    console.error(
      "Failed to activate subscription:",
      error
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