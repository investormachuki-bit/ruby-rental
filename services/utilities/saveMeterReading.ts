import { supabase } from "@/lib/supabase";
import { getLatestReading } from "./getLatestReading";

type SaveMeterReadingData = {
  meter_id: string;

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
  meter_id,

  workspace_id,
  property_id,
  unit_id,

  utility_type,

  current_reading,

  reading_date,

  unit_rate,

  notes,
}: SaveMeterReadingData) {
  // -----------------------------------
  // Billing Month
  // -----------------------------------

  const billingDate = new Date(reading_date);

  billingDate.setDate(1);

  const billing_month =
    billingDate.toISOString().split("T")[0];

  // -----------------------------------
  // Prevent duplicate readings
  // -----------------------------------

  const {
    data: existing,
    error: existingError,
  } = await supabase
    .from("meter_readings")
    .select("id")
    .eq("meter_id", meter_id)
    .eq("billing_month", billing_month)
    .maybeSingle();

  if (existingError) {
    throw existingError;
  }

  if (existing) {
    throw new Error(
      `${utility_type} reading for this billing month already exists.`
    );
  }

  // -----------------------------------
  // Get latest reading
  // -----------------------------------

  const latest = await getLatestReading(
    unit_id,
    utility_type
  );

  let previousReading = 0;

  if (latest) {
    previousReading = Number(
      latest.current_reading
    );
  } else {
    // First reading
    const {
      data: meter,
      error: meterError,
    } = await supabase
      .from("utility_meters")
      .select("opening_reading")
      .eq("id", meter_id)
      .single();

    if (meterError) {
      throw meterError;
    }

    previousReading = Number(
      meter.opening_reading ?? 0
    );
  }

  // -----------------------------------
  // Validation
  // -----------------------------------

  if (
    current_reading < previousReading
  ) {
    throw new Error(
      "Current reading cannot be less than the previous reading."
    );
  }

  const unitsUsed =
    current_reading - previousReading;

  const amount =
    unitsUsed * unit_rate;

  // -----------------------------------
  // Save reading
  // -----------------------------------

  const { data, error } =
    await supabase
      .from("meter_readings")
      .insert({
        meter_id,

        workspace_id,

        property_id,

        unit_id,

        utility_type,

        reading_date,

        billing_month,

        previous_reading:
          previousReading,

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
