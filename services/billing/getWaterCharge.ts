import type { LeaseDetails } from "@/types/lease";

import type { InvoiceLineItem } from "./types";

/**
 * Calculates the water charge for a lease.
 *
 * Current version:
 * - Uses a placeholder consumption value.
 *
 * Future version:
 * - Reads the previous meter reading.
 * - Reads the latest meter reading.
 * - Calculates units consumed.
 * - Applies the property's water tariff.
 */
export async function getWaterCharge(
  lease: LeaseDetails
): Promise<InvoiceLineItem[]> {

  const items: InvoiceLineItem[] = [];

  /*
   * TODO:
   *
   * const previousReading = ...
   * const currentReading = ...
   * const tariff = ...
   */

  const unitsConsumed = 12;

  const tariff = 120;

  const amount =
    unitsConsumed * tariff;
    if (amount <= 0) {
    return items;
  }

  items.push({

    item_type: "Water",

    description:
      `Water Usage (${unitsConsumed} Units)`,

    quantity: unitsConsumed,

    unit_price: tariff,

  });

  return items;

}
