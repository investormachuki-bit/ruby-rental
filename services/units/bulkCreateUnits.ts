import { supabase } from "@/lib/supabase";

export type BulkUnitInput = {
  propertyId: string;
  workspaceId: string;
  prefix: string;
  start: number;
  end: number;
  monthlyRent: number;
  deposit: number;
  floorName?: string;
};

export async function bulkCreateUnits(
  input: BulkUnitInput
) {
  const units = [];

  for (let i = input.start; i <= input.end; i++) {
    units.push({
      workspace_id: input.workspaceId,
      property_id: input.propertyId,

      unit_number: `${input.prefix}${i}`,
      floor_name: input.floorName ?? null,

      monthly_rent: input.monthlyRent,
      deposit: input.deposit,

      water_type: "Metered",
      electricity_type: "Prepaid",

      garbage_fee: 0,
      parking_fee: 0,
      internet_fee: 0,
      service_charge: 0,

      status: "Vacant",
    });
  }

  const { error } = await supabase
    .from("units")
    .insert(units);

  if (error) throw error;
}
