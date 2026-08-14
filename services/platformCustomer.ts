import { supabase } from "@/lib/supabase";

export type PlatformCustomer = {
  id: string;
  name: string;
  brand_name: string | null;
  email: string | null;
  phone: string | null;
  is_active: boolean;
  created_at: string;
};

export type CustomerSubscription = {
  id: string;
  workspace_id: string;
  plan_id: string;
  subscribed_units: number;
  unit_limit: number;
  rate_per_unit: number;
  monthly_amount: number;
  currency: string;
  status: string;
  start_date: string;
  next_billing_date: string | null;
  created_at: string;
  updated_at: string;
  plan?: {
    id: string;
    name: string;
    min_units: number;
    max_units: number | null;
    price_per_unit: number;
  } | null;
};

export type CustomerPlan = {
  id: string;
  name: string;
  description: string | null;
  min_units: number;
  max_units: number | null;
  price_per_unit: number;
  currency: string;
  is_active: boolean;
};

export type BillingBreakdown = {
  units: number;
  amount: number;
  rate: number;
  label: string;
};

export async function getPlatformCustomer(
  customerId: string
): Promise<{
  data: PlatformCustomer | null;
  error: string | null;
}> {
  const { data, error } = await supabase
    .from("workspaces")
    .select(`
      id,
      name,
      brand_name,
      email,
      phone,
      is_active,
      created_at
    `)
    .eq("id", customerId)
    .maybeSingle();

  if (error) {
    console.error(
      "Failed to load platform customer:",
      error
    );

    return {
      data: null,
      error: error.message,
    };
  }

  return {
    data: data as PlatformCustomer | null,
    error: null,
  };
}

export async function getCustomerSubscription(
  customerId: string
): Promise<{
  data: CustomerSubscription | null;
  error: string | null;
}> {
  const { data, error } = await supabase
    .from("subscriptions")
    .select(`
      id,
      workspace_id,
      plan_id,
      subscribed_units,
      unit_limit,
      rate_per_unit,
      monthly_amount,
      currency,
      status,
      start_date,
      next_billing_date,
      created_at,
      updated_at,
      plan:subscription_plans (
        id,
        name,
        min_units,
        max_units,
        price_per_unit
      )
    `)
    .eq("workspace_id", customerId)
    .order("created_at", {
      ascending: false,
    })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error(
      "Failed to load customer subscription:",
      error
    );

    return {
      data: null,
      error: error.message,
    };
  }

  if (!data) {
    return {
      data: null,
      error: null,
    };
  }

  const rawPlan = data.plan;

  const plan = Array.isArray(rawPlan)
    ? rawPlan[0]
    : rawPlan;

  return {
    data: {
      ...data,
      subscribed_units: Number(
        data.subscribed_units
      ),
      unit_limit: Number(data.unit_limit),
      rate_per_unit: Number(
        data.rate_per_unit
      ),
      monthly_amount: Number(
        data.monthly_amount
      ),
      plan: plan
        ? {
            ...plan,
            min_units: Number(
              plan.min_units
            ),
            max_units:
              plan.max_units === null
                ? null
                : Number(plan.max_units),
            price_per_unit: Number(
              plan.price_per_unit
            ),
          }
        : null,
    } as CustomerSubscription,
    error: null,
  };
}

export async function getCustomerPlans(): Promise<{
  data: CustomerPlan[];
  error: string | null;
}> {
  const { data, error } = await supabase
    .from("subscription_plans")
    .select(`
      id,
      name,
      description,
      min_units,
      max_units,
      price_per_unit,
      currency,
      is_active
    `)
    .eq("is_active", true)
    .order("min_units", {
      ascending: true,
    });

  if (error) {
    console.error(
      "Failed to load customer plans:",
      error
    );

    return {
      data: [],
      error: error.message,
    };
  }

  return {
    data: (data ?? []).map((plan) => ({
      ...plan,
      min_units: Number(plan.min_units),
      max_units:
        plan.max_units === null
          ? null
          : Number(plan.max_units),
      price_per_unit: Number(
        plan.price_per_unit
      ),
    })) as CustomerPlan[],
    error: null,
  };
}

/**
 * Progressive billing.
 *
 * Example:
 *
 * 20 units:
 * 20 × 50 = 1,000
 *
 * 50 units:
 * 20 × 50 = 1,000
 * 30 × 40 = 1,200
 * Total = 2,200
 *
 * 150 units:
 * 20 × 50 = 1,000
 * 80 × 40 = 3,200
 * 50 × 30 = 1,500
 * Total = 5,700
 */
export function calculateProgressiveBilling(
  units: number,
  plans: CustomerPlan[]
): {
  monthlyAmount: number;
  ratePerUnit: number;
  unitLimit: number;
  plan: CustomerPlan | null;
  breakdown: BillingBreakdown[];
} {
  const safeUnits = Math.max(
    0,
    Math.floor(Number(units) || 0)
  );

  if (safeUnits === 0 || plans.length === 0) {
    return {
      monthlyAmount: 0,
      ratePerUnit: 0,
      unitLimit: 0,
      plan: null,
      breakdown: [],
    };
  }

  const sortedPlans = [...plans].sort(
    (a, b) =>
      a.min_units - b.min_units
  );

  let remaining = safeUnits;
  let monthlyAmount = 0;

  const breakdown: BillingBreakdown[] = [];

  for (const plan of sortedPlans) {
    if (remaining <= 0) break;

    const tierStart = plan.min_units;

    const tierEnd =
      plan.max_units ?? Infinity;

    const tierCapacity =
      tierEnd === Infinity
        ? Infinity
        : tierEnd - tierStart + 1;

    const previousUnits = Math.max(
      0,
      safeUnits - remaining
    );

    const unitsBeforeTier =
      Math.max(
        0,
        previousUnits - (tierStart - 1)
      );

    const available =
      tierCapacity === Infinity
        ? remaining
        : Math.max(
            0,
            tierCapacity -
              unitsBeforeTier
          );

    const unitsInTier = Math.min(
      remaining,
      available
    );

    if (unitsInTier <= 0) continue;

    const amount =
      unitsInTier *
      Number(plan.price_per_unit);

    monthlyAmount += amount;

    breakdown.push({
      units: unitsInTier,
      amount,
      rate: Number(
        plan.price_per_unit
      ),
      label: plan.name,
    });

    remaining -= unitsInTier;
  }

  const selectedPlan =
    sortedPlans.find(
      (plan) =>
        safeUnits >= plan.min_units &&
        (
          plan.max_units === null ||
          safeUnits <= plan.max_units
        )
    ) ??
    sortedPlans[
      sortedPlans.length - 1
    ] ??
    null;

  return {
    monthlyAmount,
    ratePerUnit:
      selectedPlan
        ? Number(
            selectedPlan.price_per_unit
          )
        : 0,
    unitLimit:
      selectedPlan?.max_units ??
      safeUnits,
    plan: selectedPlan,
    breakdown,
  };
}

function getNextBillingDate(): string {
  const date = new Date();

  date.setMonth(
    date.getMonth() + 1
  );

  return date
    .toISOString()
    .split("T")[0];
}

export async function createCustomerSubscription(
  customerId: string,
  planId: string,
  units: number,
  plans: CustomerPlan[]
): Promise<{
  data: CustomerSubscription | null;
  error: string | null;
}> {
  const billing =
    calculateProgressiveBilling(
      units,
      plans
    );

  if (!billing.plan) {
    return {
      data: null,
      error:
        "No valid subscription package found.",
    };
  }

  if (
    billing.plan.id !== planId
  ) {
    return {
      data: null,
      error:
        "The selected package does not match the number of units.",
    };
  }

  const today =
    new Date()
      .toISOString()
      .split("T")[0];

  const { data, error } =
    await supabase
      .from("subscriptions")
      .insert({
        workspace_id: customerId,
        plan_id: billing.plan.id,
        subscribed_units: units,
        unit_limit:
          billing.unitLimit,
        rate_per_unit:
          billing.ratePerUnit,
        monthly_amount:
          billing.monthlyAmount,
        currency:
          billing.plan.currency || "KES",
        status: "Active",
        start_date: today,
        next_billing_date:
          getNextBillingDate(),
      })
      .select(`
        *,
        plan:subscription_plans (
          id,
          name,
          min_units,
          max_units,
          price_per_unit
        )
      `)
      .single();

  if (error) {
    console.error(
      "Failed to create subscription:",
      error
    );

    return {
      data: null,
      error: error.message,
    };
  }

  const rawPlan = data.plan;

  const plan = Array.isArray(rawPlan)
    ? rawPlan[0]
    : rawPlan;

  return {
    data: {
      ...data,
      plan: plan ?? null,
    } as CustomerSubscription,
    error: null,
  };
}

export async function updateCustomerSubscription(
  subscriptionId: string,
  planId: string,
  units: number,
  plans: CustomerPlan[]
): Promise<{
  data: CustomerSubscription | null;
  error: string | null;
}> {
  const billing =
    calculateProgressiveBilling(
      units,
      plans
    );

  if (!billing.plan) {
    return {
      data: null,
      error:
        "No valid subscription package found.",
    };
  }

  if (
    billing.plan.id !== planId
  ) {
    return {
      data: null,
      error:
        "The selected package does not match the number of units.",
    };
  }

  const { data, error } =
    await supabase
      .from("subscriptions")
      .update({
        plan_id: billing.plan.id,
        subscribed_units: units,
        unit_limit:
          billing.unitLimit,
        rate_per_unit:
          billing.ratePerUnit,
        monthly_amount:
          billing.monthlyAmount,
        currency:
          billing.plan.currency || "KES",
        updated_at:
          new Date().toISOString(),
      })
      .eq("id", subscriptionId)
      .select(`
        *,
        plan:subscription_plans (
          id,
          name,
          min_units,
          max_units,
          price_per_unit
        )
      `)
      .single();

  if (error) {
    console.error(
      "Failed to update subscription:",
      error
    );

    return {
      data: null,
      error: error.message,
    };
  }

  const rawPlan = data.plan;

  const plan = Array.isArray(rawPlan)
    ? rawPlan[0]
    : rawPlan;

  return {
    data: {
      ...data,
      plan: plan ?? null,
    } as CustomerSubscription,
    error: null,
  };
}

export async function updateSubscriptionStatus(
  subscriptionId: string,
  status: string
): Promise<{
  error: string | null;
}> {
  const { error } =
    await supabase
      .from("subscriptions")
      .update({
        status,
        updated_at:
          new Date().toISOString(),
      })
      .eq("id", subscriptionId);

  if (error) {
    console.error(
      "Failed to update subscription status:",
      error
    );

    return {
      error: error.message,
    };
  }

  return {
    error: null,
  };
}