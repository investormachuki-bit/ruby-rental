import { supabase } from "@/lib/supabase";

export type PlatformSubscription = {
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

  workspace?: {
    id: string;
    name: string;
    brand_name: string | null;
    email: string | null;
  };

  plan?: {
    id: string;
    name: string;
    min_units: number;
    max_units: number | null;
    price_per_unit: number;
  };
};

export type SubscriptionStats = {
  active: number;
  trial: number;
  pastDue: number;
  monthlyRevenue: number;
};

export async function getPlatformSubscriptions(): Promise<{
  data: PlatformSubscription[];
  error: string | null;
}> {
  const { data, error } = await supabase
    .from("subscriptions")
    .select(`
      *,
      workspace:workspaces (
        id,
        name,
        brand_name,
        email
      ),
      plan:subscription_plans (
        id,
        name,
        min_units,
        max_units,
        price_per_unit
      )
    `)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "Failed to load platform subscriptions:",
      error
    );

    return {
      data: [],
      error: error.message,
    };
  }

  return {
    data: (data ?? []) as PlatformSubscription[],
    error: null,
  };
}

export async function getSubscriptionStats(): Promise<{
  data: SubscriptionStats;
  error: string | null;
}> {
  const { data, error } = await supabase
    .from("subscriptions")
    .select(
      "status, monthly_amount"
    );

  if (error) {
    console.error(
      "Failed to load subscription stats:",
      error
    );

    return {
      data: {
        active: 0,
        trial: 0,
        pastDue: 0,
        monthlyRevenue: 0,
      },
      error: error.message,
    };
  }

  const rows = data ?? [];

  const active = rows.filter(
    (row) => row.status === "Active"
  ).length;

  const trial = rows.filter(
    (row) => row.status === "Trial"
  ).length;

  const pastDue = rows.filter(
    (row) => row.status === "Past Due"
  ).length;

  const monthlyRevenue = rows
    .filter(
      (row) => row.status === "Active"
    )
    .reduce(
      (total, row) =>
        total + Number(row.monthly_amount || 0),
      0
    );

  return {
    data: {
      active,
      trial,
      pastDue,
      monthlyRevenue,
    },
    error: null,
  };
}