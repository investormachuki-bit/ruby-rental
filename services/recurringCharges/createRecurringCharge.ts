import { supabase } from "@/lib/supabase";
import { getProfile } from "@/services/auth/getProfile";
import { TABLES } from "@/constants/tables";

export type CreateRecurringChargeInput = {
  propertyId: string;

  unitId?: string;
  leaseId?: string;

  chargeName: string;
  description?: string;

  amount: number;

  billingFrequency: string;

  isMandatory?: boolean;
  isActive?: boolean;
};

export async function createRecurringCharge(
  input: CreateRecurringChargeInput
) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    alert("You are not logged in.");
    throw new Error("You are not logged in.");
  }

  const profile = await getProfile(session.user.id);

  if (!profile) {
    alert("Profile not found.");
    throw new Error("Profile not found.");
  }

  const { data, error } = await supabase
    .from(TABLES.RECURRING_CHARGES)
    .insert({
      workspace_id: profile.workspace_id,

      property_id: input.propertyId,

      unit_id: input.unitId || null,

      lease_id: input.leaseId || null,

      charge_name: input.chargeName.trim(),

      description: input.description?.trim() || null,

      amount: input.amount,

      billing_frequency: input.billingFrequency,

      is_mandatory: input.isMandatory ?? true,

      is_active: input.isActive ?? true,
    })
    .select()
    .single();

  if (error) {
    alert(
      "SUPABASE ERROR\n\n" +
        JSON.stringify(error, null, 2)
    );

    throw error;
  }

  alert(
    "Recurring charge created successfully!\n\n" +
      JSON.stringify(data, null, 2)
  );

  return data;
}
