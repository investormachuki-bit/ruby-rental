import type { LeaseDetails } from "@/types/lease";

import type { InvoiceLineItem } from "./types";

export async function getRecurringCharges(
  lease: LeaseDetails
): Promise<InvoiceLineItem[]> {

  const items: InvoiceLineItem[] = [];

  /*
   * Future source:
   *
   * Property Recurring Charges
   * Unit Charges
   * Lease Charges
   *
   * Examples:
   * - Garbage Collection
   * - Service Charge
   * - Security Fee
   * - Cleaning Fee
   * - Estate Levy
   */

  const recurringCharges = [

    {
      name: "Garbage",
      amount: 300,
    },

    {
      name: "Service Charge",
      amount: 1000,
    },

  ];
   for (const charge of recurringCharges) {

    if (charge.amount <= 0) {
      continue;
    }

    items.push({

      item_type:
        charge.name as InvoiceLineItem["item_type"],

      description:
        charge.name,

      quantity: 1,

      unit_price:
        charge.amount,

    });

  }

  return items;

} 
