import { supabase } from "@/lib/supabase";
import { getProfile } from "@/services/auth/getProfile";

export type PropertyPerformance = {
  id: string;
  property: string;
  totalUnits: number;
  occupiedUnits: number;
  vacantUnits: number;
  occupancyRate: number;
  expectedRent: number;
  collectedRent: number;
  outstandingRent: number;
};

export async function getPropertyPerformance(): Promise<
  PropertyPerformance[]
> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("You are not logged in.");
  }

  const profile = await getProfile(session.user.id);

  if (!profile) {
    throw new Error("Profile not found.");
  }

  const [
    propertiesResult,
    unitsResult,
    invoicesResult,
    paymentsResult,
  ] = await Promise.all([
    supabase
      .from("properties")
      .select("id, name")
      .eq("workspace_id", profile.workspace_id),

    supabase
      .from("units")
      .select("id, property_id, status")
      .eq("workspace_id", profile.workspace_id),

    supabase
      .from("invoices")
      .select(
        "property_id, amount, amount_paid, balance, due_date"
      )
      .eq("workspace_id", profile.workspace_id),

    supabase
      .from("payments")
      .select(
        "property_id, amount, payment_date"
      )
      .eq("workspace_id", profile.workspace_id)
      .eq("is_reversed", false),
  ]);

  if (propertiesResult.error) {
    throw propertiesResult.error;
  }

  if (unitsResult.error) {
    throw unitsResult.error;
  }

  if (invoicesResult.error) {
    throw invoicesResult.error;
  }

  if (paymentsResult.error) {
    throw paymentsResult.error;
  }

  const properties = propertiesResult.data ?? [];
  const units = unitsResult.data ?? [];
  const invoices = invoicesResult.data ?? [];
  const payments = paymentsResult.data ?? [];

  return properties.map((property) => {
    const propertyUnits = units.filter(
      (unit) => unit.property_id === property.id
    );

    const occupiedUnits = propertyUnits.filter(
      (unit) =>
        String(unit.status ?? "").toLowerCase() ===
        "occupied"
    ).length;

    const totalUnits = propertyUnits.length;

    const vacantUnits =
      Math.max(totalUnits - occupiedUnits, 0);

    const occupancyRate =
      totalUnits > 0
        ? Number(
            (
              (occupiedUnits / totalUnits) *
              100
            ).toFixed(1)
          )
        : 0;

    const propertyInvoices =
      invoices.filter(
        (invoice) =>
          invoice.property_id === property.id
      );

    const propertyPayments =
      payments.filter(
        (payment) =>
          payment.property_id === property.id
      );

    const expectedRent =
      propertyInvoices.reduce(
        (sum, invoice) =>
          sum + Number(invoice.amount ?? 0),
        0
      );

    const collectedRent =
      propertyPayments.reduce(
        (sum, payment) =>
          sum + Number(payment.amount ?? 0),
        0
      );

    const outstandingRent =
      propertyInvoices.reduce(
        (sum, invoice) =>
          sum + Number(invoice.balance ?? 0),
        0
      );

    return {
      id: property.id,
      property: property.name,
      totalUnits,
      occupiedUnits,
      vacantUnits,
      occupancyRate,
      expectedRent,
      collectedRent,
      outstandingRent,
    };
  });
}
