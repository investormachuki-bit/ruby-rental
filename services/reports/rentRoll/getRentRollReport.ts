import { supabase } from "@/lib/supabase";
import { getProfile } from "@/services/auth/getProfile";

export type RentRollRow = {
  property_id: string;
  property_name: string;
  total_units: number;
  occupied_units: number;
  vacant_units: number;
  occupancy_rate: number;
  monthly_rent: number;
  outstanding_rent: number;
};

export type RentRollReport = {
  totalProperties: number;
  totalUnits: number;
  occupiedUnits: number;
  vacantUnits: number;
  occupancyRate: number;
  monthlyExpectedRent: number;
  outstandingRent: number;
  properties: RentRollRow[];
};

export async function getRentRollReport(): Promise<RentRollReport> {
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

  const workspaceId = profile.workspace_id;

  const [propertiesResult, unitsResult, leasesResult, invoicesResult] =
    await Promise.all([
      supabase
        .from("properties")
        .select("id, name")
        .eq("workspace_id", workspaceId),

      supabase
        .from("units")
        .select("id, property_id, unit_number, status, rent_amount")
        .eq("workspace_id", workspaceId),

      supabase
        .from("leases")
        .select("id, unit_id, status, rent_amount")
        .eq("workspace_id", workspaceId),

      supabase
        .from("invoices")
        .select("property_id, balance")
        .eq("workspace_id", workspaceId)
        .gt("balance", 0),
    ]);

  if (propertiesResult.error) throw propertiesResult.error;
  if (unitsResult.error) throw unitsResult.error;
  if (leasesResult.error) throw leasesResult.error;
  if (invoicesResult.error) throw invoicesResult.error;

  const properties = propertiesResult.data ?? [];
  const units = unitsResult.data ?? [];
  const leases = leasesResult.data ?? [];
  const invoices = invoicesResult.data ?? [];

  const rows: RentRollRow[] = properties.map((property) => {
    const propertyUnits = units.filter(
      (unit) => unit.property_id === property.id
    );

    const occupiedUnits = propertyUnits.filter((unit) => {
      return leases.some(
        (lease) =>
          lease.unit_id === unit.id &&
          String(lease.status ?? "").toLowerCase() === "active"
      );
    });

    const monthlyRent = occupiedUnits.reduce((sum, unit) => {
      const lease = leases.find(
        (item) =>
          item.unit_id === unit.id &&
          String(item.status ?? "").toLowerCase() === "active"
      );

      return sum + Number(lease?.rent_amount ?? unit.rent_amount ?? 0);
    }, 0);

    const outstandingRent = invoices
      .filter((invoice) => invoice.property_id === property.id)
      .reduce(
        (sum, invoice) => sum + Number(invoice.balance ?? 0),
        0
      );

    const totalUnits = propertyUnits.length;
    const occupiedCount = occupiedUnits.length;

    return {
      property_id: property.id,
      property_name: property.name,
      total_units: totalUnits,
      occupied_units: occupiedCount,
      vacant_units: Math.max(totalUnits - occupiedCount, 0),
      occupancy_rate:
        totalUnits > 0
          ? Number(((occupiedCount / totalUnits) * 100).toFixed(1))
          : 0,
      monthly_rent: monthlyRent,
      outstanding_rent: outstandingRent,
    };
  });

  const totalUnits = rows.reduce(
    (sum, row) => sum + row.total_units,
    0
  );

  const occupiedUnits = rows.reduce(
    (sum, row) => sum + row.occupied_units,
    0
  );

  return {
    totalProperties: rows.length,
    totalUnits,
    occupiedUnits,
    vacantUnits: Math.max(totalUnits - occupiedUnits, 0),
    occupancyRate:
      totalUnits > 0
        ? Number(((occupiedUnits / totalUnits) * 100).toFixed(1))
        : 0,
    monthlyExpectedRent: rows.reduce(
      (sum, row) => sum + row.monthly_rent,
      0
    ),
    outstandingRent: rows.reduce(
      (sum, row) => sum + row.outstanding_rent,
      0
    ),
    properties: rows,
  };
}
