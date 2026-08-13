import { supabase } from "@/lib/supabase";

export type SubscriptionPlan = {
  id: string;
  name: string;
  description: string | null;
  min_units: number;
  max_units: number | null;
  price_per_unit: number;
  currency: string;
  is_active: boolean;
};

export async function getPlatformPackages(): Promise<{
  data: SubscriptionPlan[];
  error: string | null;
}> {
  const { data, error } = await supabase
    .from("subscription_plans")
    .select("*")
    .order("min_units", {
      ascending: true,
    });

  if (error) {
    console.error(
      "Failed to load subscription packages:",
      error
    );

    return {
      data: [],
      error: error.message,
    };
  }

  return {
    data: (data ?? []) as SubscriptionPlan[],
    error: null,
  };
}

export async function updateSubscriptionPlan(
  plan: SubscriptionPlan
): Promise<{
  data: SubscriptionPlan | null;
  error: string | null;
}> {
  const { data, error } = await supabase.rpc(
    "update_subscription_plan",
    {
      p_plan_id: plan.id,
      p_name: plan.name,
      p_description: plan.description ?? "",
      p_min_units: plan.min_units,
      p_max_units: plan.max_units,
      p_price_per_unit: plan.price_per_unit,
      p_is_active: plan.is_active,
    }
  );

  if (error) {
    console.error(
      "Failed to update subscription package:",
      error
    );

    return {
      data: null,
      error: error.message,
    };
  }

  return {
    data: data as SubscriptionPlan,
    error: null,
  };
}