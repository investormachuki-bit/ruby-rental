import { supabase } from "@/lib/supabase";
import type {
  MonthlyBillingSummary,
} from "./types";

export async function generateMonthlyInvoices(): Promise<MonthlyBillingSummary> {
  const { data, error } = await supabase.rpc(
    "generate_monthly_invoices"
  );

  if (error) {
    console.error(
      "GENERATE MONTHLY INVOICES ERROR",
      error
    );

    throw error;
  }

  return {
    billing_period: "",
    occupied_units: 0,

    existing_invoices: 0,
    new_invoices: Number(data ?? 0),

    skipped_units: 0,
    failed: 0,

    expected_revenue: 0,
    rent_total: 0,
    utility_charges: 0,
    previous_balances: 0,

    generated: Number(data ?? 0),
    skipped: 0,
    failed_units: 0,

    results: [],
  };
}
