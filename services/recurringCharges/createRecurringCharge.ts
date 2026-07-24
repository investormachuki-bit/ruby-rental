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
  // Get logged in user
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("You are not logged in.");
  }

  // Get user profile
  const profile = await getProfile(session.user.id);

  if (!profile) {
    throw new Error("Profile not found.");
  }

  // Create recurring charge
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
    throw error;
  }

  return data;
}
