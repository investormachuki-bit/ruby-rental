import type { LeaseDetails } from "@/types/lease";
import type { InvoiceLineItem } from "./types";
import { getLatestReading } from "@/services/meterReadings/getLatestReading";
import { getUnbilledReading } from "@/services/meterReadings/getUnbilledReading";

export async function getWaterCharge(lease: LeaseDetails, billingPeriod?: string): Promise<InvoiceLineItem[]> {
  const items: InvoiceLineItem[] = [];

  const latestReading = await getLatestReading(lease.unit_id, "Water");
  const unbilledReadings = await getUnbilledReading(lease.unit_id, "Water");

  const reading = latestReading ?? unbilledReadings[0];
  if (!reading) return items;

  const unitsConsumed = Number(reading.units_used ?? reading.current_reading ?? 0);
  const tariff = Number(reading.unit_rate ?? 120);
  const amount = unitsConsumed * tariff;

  if (amount <= 0) return items;

  items.push({
    item_type: "Water",
    description: `${billingPeriod ?? "Current"} Water Usage (${unitsConsumed} Units)`,
    quantity: unitsConsumed,
    unit_price: tariff,
  });

  return items;
}
