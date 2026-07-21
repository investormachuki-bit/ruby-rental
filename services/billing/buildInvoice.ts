import { getLeaseById } from "@/services/leases/getLeaseById";

import type {
  InvoiceBuildResult,
  InvoiceLineItem,
} from "./types";

function getBillingPeriod() {
  const now = new Date();

  return `${now.toLocaleString("default", {
    month: "long",
  })} ${now.getFullYear()}`;
}

export async function buildInvoice(
  leaseId: string
): Promise<InvoiceBuildResult> {

  const lease =
    await getLeaseById(leaseId);

  if (!lease) {
    throw new Error(
      "Lease not found."
    );
  }

  const billingPeriod =
    getBillingPeriod();

  const items: InvoiceLineItem[] = [];

  items.push({

    item_type: "Rent",

    description:
      `${billingPeriod} Rent`,

    quantity: 1,

    unit_price: Number(
      lease.rent_amount
    ),

  });
    /*
   * Future billing modules will add items here.
   *
   * Example:
   *
   * items.push(
   *   ...(await getRecurringCharges(lease))
   * );
   *
   * items.push(
   *   ...(await getWaterCharge(lease))
   * );
   *
   * items.push(
   *   ...(await getParkingCharge(lease))
   * );
   *
   * items.push(
   *   ...(await getInternetCharge(lease))
   * );
   *
   * items.push(
   *   ...(await getPreviousBalance(lease))
   * );
   */

  const subtotal =
    items.reduce(

      (
        total,
        item
      ) =>

        total +
        item.quantity *
        item.unit_price,

      0

    );

  const total = subtotal;

const rentTotal = items
  .filter(
    (item) => item.item_type === "Rent"
  )
  .reduce(
    (sum, item) =>
      sum +
      item.quantity *
      item.unit_price,
    0
  );

const utilityCharges = items
  .filter((item) =>
    [
      "Water",
      "Electricity",
      "Garbage",
      "Service Charge",
      "Parking",
    ].includes(item.item_type)
  )
  .reduce(
    (sum, item) =>
      sum +
      item.quantity *
      item.unit_price,
    0
  );

const previousBalances = items
  .filter(
    (item) =>
      item.item_type ===
      "Previous Balance"
  )
  .reduce(
    (sum, item) =>
      sum +
      item.quantity *
      item.unit_price,
    0
  );

const invoice: InvoiceBuildResult = {

  billing_period:
    billingPeriod,

  items,

  subtotal,

  total,

  rent_total:
    rentTotal,

  utility_charges:
    utilityCharges,

  previous_balances:
    previousBalances,

};

return invoice;
}
