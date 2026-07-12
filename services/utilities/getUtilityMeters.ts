import { supabase } from "@/lib/supabase";

export async function getUtilityMeters(
  unitId: string
) {
  const { data, error } = await supabase
    .from("utility_meters")
    .select(`
      *,
      latest_reading:meter_readings(
        id,
        reading_date,
        billing_month,
        previous_reading,
        current_reading,
        units_used,
        amount
      )
    `)
    .eq("unit_id", unitId)
    .in("status", [
      "Pending Setup",
      "Active",
    ])
    .order("utility_type", {
      ascending: true,
    });

  if (error) {
    throw error;
  }

  return (data ?? []).map(
    (meter: any) => {
      const readings = [
        ...(meter.latest_reading ?? []),
      ].sort(
        (a: any, b: any) =>
          new Date(
            b.reading_date
          ).getTime() -
          new Date(
            a.reading_date
          ).getTime()
      );

      return {
        ...meter,
        latest_reading:
          readings.length > 0
            ? readings[0]
            : null,
      };
    }
  );
}
