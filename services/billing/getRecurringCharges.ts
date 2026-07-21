import type { LeaseDetails } from "@/types/lease";
import type { InvoiceLineItem } from "./types";

export async function getRecurringCharges(lease: LeaseDetails): Promise<InvoiceLineItem[]> {
  const items: InvoiceLineItem[] = [];
  const recurringCharges = [
    { name: "Garbage", amount: 300 },
    { name: "Service Charge", amount: 1000 },
  ];

  for (const charge of recurringCharges) {
    if (charge.amount <= 0) continue;
    items.push({
      item_type: charge.name === "Garbage" ? "Garbage" : "Service Charge",
      description: charge.name,
      quantity: 1,
      unit_price: charge.amount,
    });
  }

  return items;
}
