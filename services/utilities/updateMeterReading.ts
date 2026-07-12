import { supabase } from "@/lib/supabase";

type UpdateMeterReadingInput = {
  current_reading: number;
  notes?: string;
};

export async function updateMeterReading(
  readingId: string,
  input: UpdateMeterReadingInput
) {
  // Get existing reading
  const { data: reading, error } =
    await supabase
      .from("meter_readings")
      .select("*")
      .eq("id", readingId)
      .single();

  if (error) {
    throw error;
  }

  if (
    input.current_reading <
    Number(reading.previous_reading)
  ) {
    throw new Error(
      "Current reading cannot be less than the previous reading."
    );
  }

  const units_used =
    input.current_reading -
    Number(reading.previous_reading);

  const amount =
    units_used *
    Number(reading.unit_rate);

  const {
    data,
    error: updateError,
  } = await supabase
    .from("meter_readings")
    .update({
      current_reading:
        input.current_reading,

      units_used,

      amount,

      notes:
        input.notes ?? null,
    })
    .eq("id", readingId)
    .select()
    .single();

  if (updateError) {
    throw updateError;
  }

  return data;
}
