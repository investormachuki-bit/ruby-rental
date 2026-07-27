import { supabase } from "@/lib/supabase";
import type { InvoiceLineItem } from "./types";

export async function getApplicableRecurringCharges(
  lease: {
    id: string;
    property_id: string;
    unit_id: string;
  }
): Promise<InvoiceLineItem[]> {

  const { data, error } = await supabase
    .from("recurring_charges")
    .select("*")
    .eq("is_active", true)
    .or(
      [
        `lease_id.eq.${lease.id}`,
        `unit_id.eq.${lease.unit_id}`,
        `property_id.eq.${lease.property_id}`
      ].join(",")
    );

  if (error) {
    throw error;
  }

  return (data ?? []).map((charge) => ({
    item_type: charge.charge_name,

    description: charge.description
      ? charge.description
      : charge.charge_name,

    quantity: 1,

    unit_price: Number(charge.amount),
  }));
}
