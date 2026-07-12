import { supabase } from "@/lib/supabase";
import { getLatestReading } from "./getLatestReading";

type SaveMeterReadingData = {
  workspace_id: string;
  property_id: string;
  unit_id: string;

  utility_type: "Water" | "Electricity";

  current_reading: number;

  reading_date: string;

  unit_rate: number;

  notes?: string;
};

export async function saveMeterReading({
  workspace_id,
  property_id,
  unit_id,
  utility_type,
  current_reading,
  reading_date,
  unit_rate,
  notes,
}: SaveMeterReadingData) {
  const billingMonth = new Date(reading_date);

  billingMonth.setDate(1);

  const billing_month = billingMonth
    .toISOString()
    .split("T")[0];

  const { data: existing } = await supabase
    .from("meter_readings")
    .select("id")
    .eq("unit_id", unit_id)
    .eq("utility_type", utility_type)
    .eq("billing_month", billing_month)
    .maybeSingle();

  if (existing) {
    throw new Error(
      `${utility_type} reading for this billing month already exists.`
    );
  }

  const latest = await getLatestReading(
    unit_id,
    utility_type
  );

  const previousReading =
    latest?.current_reading ?? 0;

  if (current_reading < previousReading) {
    throw new Error(
      "Current reading cannot be less than the previous reading."
    );
  }

  const unitsUsed =
    current_reading - previousReading;

  const amount =
    unitsUsed * unit_rate;

  const { data, error } = await supabase
    .from("meter_readings")
    .insert({
      workspace_id,
      property_id,
      unit_id,

      utility_type,

      reading_date,

      billing_month,

      previous_reading: previousReading,

      current_reading,

      units_used: unitsUsed,

      unit_rate,

      amount,

      notes: notes ?? null,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}
