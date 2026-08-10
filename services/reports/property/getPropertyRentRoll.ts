import { getInvoices } from "@/services/invoices/getInvoices";
import { getAllPayments } from "@/services/payments/getAll";
import { getProperties } from "@/services/properties/getProperties";

export type PropertyRentRoll = {
  property_id: string;
  property_name: string;
  units: number;
  billed: number;
  collected: number;
  outstanding: number;
  collection_rate: number;
};

export async function getPropertyRentRoll(): Promise<PropertyRentRoll[]> {
  const [properties, invoices, payments] = await Promise.all([
    getProperties(),
    getInvoices(),
    getAllPayments(),
  ]);

  return properties.map((property: any) => {
    const propertyInvoices = invoices.filter(
      (invoice: any) => invoice.property_id === property.id
    );

    const propertyPayments = payments.filter(
      (payment: any) => payment.property_id === property.id
    );

    const billed = propertyInvoices.reduce(
      (sum: number, invoice: any) =>
        sum + Number(invoice.amount ?? 0),
      0
    );

    const collected = propertyPayments.reduce(
      (sum: number, payment: any) =>
        sum + Number(payment.amount ?? 0),
      0
    );

    const outstanding = propertyInvoices.reduce(
      (sum: number, invoice: any) =>
        sum + Number(invoice.balance ?? 0),
      0
    );

    return {
      property_id: property.id,
      property_name: property.name,
      units: 0,
      billed,
      collected,
      outstanding,
      collection_rate:
        billed > 0
          ? Number(((collected / billed) * 100).toFixed(1))
          : 0,
    };
  });
}
