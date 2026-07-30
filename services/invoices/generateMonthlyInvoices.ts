import { supabase } from "@/lib/supabase";

type GenerateMonthlyInvoicesResult = {
  generated: number;
};

export async function generateMonthlyInvoices(): Promise<GenerateMonthlyInvoicesResult> {
  try {
    const {
      data,
      error,
    } = await supabase.rpc(
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
      generated: Number(data ?? 0),
    };

  } catch (error) {

    console.error(
      "generateMonthlyInvoices() failed",
      error
    );

    throw error;

  }
}
