import { supabase } from "@/lib/supabase";
import { getProfile } from "@/services/auth/getProfile";
import { calculateConsumption } from "./calculateConsumption";

export type CreateMeterReadingInput = {
  property_id: string;
  unit_id: string;
  meter_type: "Water" | "Electricity";
  previous_reading: number;
  current_reading: number;
  rate_per_unit: number;
  reading_date: string;
  billing_period: string;
};

export async function createMeterReading(
  input: CreateMeterReadingInput
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

  const calculation = calculateConsumption({
    previousReading: input.previous_reading,
    currentReading: input.current_reading,
    ratePerUnit: input.rate_per_unit,
  });

  const { data, error } = await supabase
    .from("meter_readings")
    .insert({
      workspace_id: profile.workspace_id,
      property_id: input.property_id,
      unit_id: input.unit_id,
      meter_type: input.meter_type,
      previous_reading: calculation.previousReading,
      current_reading: calculation.currentReading,
      units_consumed: calculation.unitsConsumed,
      rate_per_unit: calculation.ratePerUnit,
      amount: calculation.amount,
      reading_date: input.reading_date,
      billing_period: input.billing_period,
      status: "Unbilled",
      created_by: session.user.id,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}
