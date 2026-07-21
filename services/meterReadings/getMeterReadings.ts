import { supabase } from "@/lib/supabase";

export type GetMeterReadingsFilters = {
  property_id?: string;
  unit_id?: string;
  meter_type?: "Water" | "Electricity";
  billing_period?: string;
  status?: "Unbilled" | "Billed";
};

export async function getMeterReadings(
  filters: GetMeterReadingsFilters = {}
) {

  let query = supabase

    .from("meter_readings")

    .select(`
      *,
      property:properties(
        id,
        name
      ),
      unit:units(
        id,
        unit_number
      )
    `)

    .order(
      "reading_date",
      {
        ascending: false,
      }
    );

  if (filters.property_id) {

    query = query.eq(
      "property_id",
      filters.property_id
    );

  }

  if (filters.unit_id) {

    query = query.eq(
      "unit_id",
      filters.unit_id
    );

  }

  if (filters.meter_type) {

    query = query.eq(
      "meter_type",
      filters.meter_type
    );

  }

  if (filters.billing_period) {

    query = query.eq(
      "billing_period",
      filters.billing_period
    );

  }

  if (filters.status) {

    query = query.eq(
      "status",
      filters.status
    );

  }

  const {
    data,
    error,
  } = await query;

  if (error) {
    throw error;
  }

  return data ?? [];

}
