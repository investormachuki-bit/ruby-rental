import { supabase } from "@/lib/supabase";

import { getMeterReading } from "./getMeterReading";
import { getPreviousReading } from "./getPreviousReading";
import { calculateConsumption } from "./calculateConsumption";

export type UpdateMeterReadingInput = {
  id: string;

  current_reading: number;

  rate_per_unit: number;

  reading_date: string;
};

export async function updateMeterReading(
  input: UpdateMeterReadingInput
) {

  const reading =
    await getMeterReading(input.id);

  if (!reading) {
    throw new Error(
      "Meter reading not found."
    );
  }

  const previousReading =
    await getPreviousReading(
      reading.unit_id,
      reading.meter_type,
      input.reading_date
    );

  const previousValue =
    previousReading
      ? previousReading.current_reading
      : 0;

  const calculation =
    calculateConsumption({

      previousReading:
        previousValue,

      currentReading:
        input.current_reading,

      ratePerUnit:
        input.rate_per_unit,

    });

  const { data, error } =
    await supabase

      .from("meter_readings")

      .update({

        previous_reading:
          calculation.previousReading,

        current_reading:
          calculation.currentReading,

        units_consumed:
          calculation.unitsConsumed,

        rate_per_unit:
          calculation.ratePerUnit,

        amount:
          calculation.amount,

        reading_date:
          input.reading_date,

        updated_at:
          new Date().toISOString(),

      })

      .eq("id", input.id)

      .select()

      .single();

  if (error) {
    throw error;
  }

  return data;

}
