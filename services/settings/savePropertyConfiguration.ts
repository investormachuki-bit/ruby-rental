import { supabase } from "@/lib/supabase";
import { getProfile } from "@/services/auth/getProfile";

export type PropertyConfigurationInput = {
  propertyId: string;

  billingDay: number;
  rentDueDay: number;
  billingBasis: string;
  utilityBillingBasis: string;
  invoiceGenerationMode: string;

  waterEnabled: boolean;
  waterBillingMethod: string;
  waterBaseCharge: number;
  waterRatePerUnit: number;

  electricityEnabled: boolean;
  electricityBillingMethod: string;
  electricityBaseCharge: number;
  electricityRatePerUnit: number;

  gasEnabled: boolean;
  gasBillingMethod: string;
  gasBaseCharge: number;
  gasRatePerUnit: number;

  garbageFee: number;
  securityFee: number;
  sewerFee: number;
  parkingFee: number;
  internetFee: number;
  serviceCharge: number;
};

export async function savePropertyConfiguration(
  input: PropertyConfigurationInput
) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("You are not logged in.");
  }

  const profile = await getProfile(session.user.id);

  if (!profile) {
    throw new Error("Profile not found.");
  }

  const { error: propertyError } = await supabase
    .from("properties")
    .update({
      billing_day: Math.min(
        Math.max(input.billingDay, 1),
        31
      ),

      rent_due_day: Math.min(
        Math.max(input.rentDueDay, 1),
        31
      ),

      billing_basis: input.billingBasis,
      utility_billing_basis:
        input.utilityBillingBasis,
      invoice_generation_mode:
        input.invoiceGenerationMode,

      updated_at: new Date().toISOString(),
    })
    .eq("id", input.propertyId)
    .eq("workspace_id", profile.workspace_id);

  if (propertyError) {
    throw propertyError;
  }

  const utilityPayload = {
    workspace_id: profile.workspace_id,
    property_id: input.propertyId,

    water_enabled: input.waterEnabled,
    water_billing_method:
      input.waterBillingMethod,
    water_base_charge:
      Math.max(input.waterBaseCharge, 0),
    water_rate_per_unit:
      Math.max(input.waterRatePerUnit, 0),

    electricity_enabled:
      input.electricityEnabled,
    electricity_billing_method:
      input.electricityBillingMethod,
    electricity_base_charge:
      Math.max(input.electricityBaseCharge, 0),
    electricity_rate_per_unit:
      Math.max(input.electricityRatePerUnit, 0),

    gas_enabled: input.gasEnabled,
    gas_billing_method:
      input.gasBillingMethod,
    gas_base_charge:
      Math.max(input.gasBaseCharge, 0),
    gas_rate_per_unit:
      Math.max(input.gasRatePerUnit, 0),

    default_garbage_fee:
      Math.max(input.garbageFee, 0),
    default_security_fee:
      Math.max(input.securityFee, 0),
    default_sewer_fee:
      Math.max(input.sewerFee, 0),
    default_parking_fee:
      Math.max(input.parkingFee, 0),
    default_internet_fee:
      Math.max(input.internetFee, 0),
    default_service_charge:
      Math.max(input.serviceCharge, 0),

    updated_at: new Date().toISOString(),
  };

  const { data: existingUtility, error: lookupError } =
    await supabase
      .from("property_utility_settings")
      .select("id")
      .eq("property_id", input.propertyId)
      .eq("workspace_id", profile.workspace_id)
      .maybeSingle();

  if (lookupError) {
    throw lookupError;
  }

  if (existingUtility) {
    const { error } = await supabase
      .from("property_utility_settings")
      .update(utilityPayload)
      .eq("id", existingUtility.id)
      .eq("workspace_id", profile.workspace_id);

    if (error) {
      throw error;
    }
  } else {
    const { error } = await supabase
      .from("property_utility_settings")
      .insert(utilityPayload);

    if (error) {
      throw error;
    }
  }

  return getPropertyConfiguration(
    input.propertyId
  );
}

async function getPropertyConfiguration(
  propertyId: string
) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("You are not authenticated.");
  }

  const profile = await getProfile(session.user.id);

  if (!profile) {
    throw new Error("Profile not found.");
  }

  const [propertyResult, utilityResult] =
    await Promise.all([
      supabase
        .from("properties")
        .select(`
          id,
          name,
          property_type,
          billing_day,
          rent_due_day,
          billing_basis,
          utility_billing_basis,
          invoice_generation_mode
        `)
        .eq("id", propertyId)
        .eq("workspace_id", profile.workspace_id)
        .single(),

      supabase
        .from("property_utility_settings")
        .select("*")
        .eq("property_id", propertyId)
        .eq("workspace_id", profile.workspace_id)
        .maybeSingle(),
    ]);

  if (propertyResult.error) {
    throw propertyResult.error;
  }

  if (utilityResult.error) {
    throw utilityResult.error;
  }

  return {
    property: propertyResult.data,
    utilities: utilityResult.data,
  };
}
