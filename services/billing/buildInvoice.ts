import { getLeaseById } from "@/services/leases/getLeaseById";

import { getApplicableRecurringCharges } from "./getApplicableRecurringCharges";

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

  /*
   * Rent
   */

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
   * Recurring Charges
   */

  const recurringCharges =
    await getApplicableRecurringCharges(
      lease
    );

  items.push(
    ...recurringCharges
  );

  /*
   * Future Billing Modules
   *
   * items.push(
   *   ...(await getUtilityCharges(lease))
   * );
   *
   * items.push(
   *   ...(await getPreviousBalances(lease))
   * );
   *
   * items.push(
   *   ...(await getLatePenalties(lease))
   * );
   *
   * items.push(
   *   ...(await getDiscounts(lease))
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
      (item) =>
        item.item_type === "Rent"
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
        "Security",
        "Internet",
        "Cleaning",
        "Sewer",
        "Maintenance Fee",
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
