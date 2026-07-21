import { supabase } from "@/lib/supabase";

export async function markAsBilled(
  readingIds: string[],
  invoiceId: string
) {

  if (readingIds.length === 0) {
    return;
  }

  const { error } =
    await supabase

      .from("meter_readings")

      .update({

        status: "Billed",

        invoice_id: invoiceId,

        billed_at: new Date().toISOString(),

      })

      .in("id", readingIds);

  if (error) {
    throw error;
  }

}
