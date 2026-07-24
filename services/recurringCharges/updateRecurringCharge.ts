import { supabase } from "@/lib/supabase";
import { TABLES } from "@/constants/tables";

export type UpdateRecurringChargeInput = {
  propertyId: string;

  unitId?: string;
  leaseId?: string;

  chargeName: string;
  description?: string;

  amount: number;

  billingFrequency: string;

  isMandatory: boolean;
  isActive: boolean;
};

export async function updateRecurringCharge(
  id: string,
  input: UpdateRecurringChargeInput
) {
  const { data, error } = await supabase
    .from(TABLES.RECURRING_CHARGES)
    .update({
      property_id: input.propertyId,

      unit_id: input.unitId || null,

      lease_id: input.leaseId || null,

      charge_name: input.chargeName.trim(),

      description:
        input.description?.trim() || null,

      amount: input.amount,

      billing_frequency:
        input.billingFrequency,

      is_mandatory:
        input.isMandatory,

      is_active:
        input.isActive,

      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}
