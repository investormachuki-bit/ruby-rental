import { supabase } from "@/lib/supabase";

import type {
  MonthlyBillingSummary,
} from "./types";

export async function runMonthlyBilling(
  billingDate: Date = new Date()
): Promise<MonthlyBillingSummary> {

  const billingDateString =
    billingDate
      .toISOString()
      .split("T")[0];

  const {
    data,
    error,
  } = await supabase.rpc(
    "run_monthly_billing",
    {
      p_billing_date:
        billingDateString,
    }
  );

  if (error) {

    console.error(
      "RUN MONTHLY BILLING ERROR",
      error
    );

    alert(
      JSON.stringify(
        error,
        null,
        2
      )
    );

    throw error;

  }

  return data as MonthlyBillingSummary;

}
