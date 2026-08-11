import { supabase } from "@/lib/supabase";
import { getProfile } from "@/services/auth/getProfile";

export type RentRollRow = {
  id: string;
  property_id: string | null;
  property_name: string;
  unit_id: string | null;
  unit_number: string;
  tenant_id: string | null;
  tenant_name: string;
  lease_id: string | null;
  lease_number: string;
  rent: number;
  billed: number;
  paid: number;
  outstanding: number;
  lease_status: string;
};

export async function getRentRoll(): Promise<RentRollRow[]> {
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

  const { data, error } = await supabase
    .from("leases")
    .select(`
      id,
      lease_number,
      rent_amount,
      status,
      property_id,
      unit_id,
      tenant_id,
      properties (
        id,
        name
      ),
      units (
        id,
        unit_number
      ),
      tenants (
        id,
        first_name,
        last_name,
        full_name
      )
    `)
    .eq("workspace_id", profile.workspace_id)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  const leases = data ?? [];

  const leaseIds = leases.map((lease: any) => lease.id);

  let invoices: any[] = [];

  if (leaseIds.length > 0) {
    const { data: invoiceData, error: invoiceError } =
      await supabase
        .from("invoices")
        .select(`
          lease_id,
          amount,
          amount_paid,
          balance
        `)
        .eq("workspace_id", profile.workspace_id)
        .in("lease_id", leaseIds);

    if (invoiceError) {
      throw invoiceError;
    }

    invoices = invoiceData ?? [];
  }

  return leases.map((lease: any) => {
    const tenant = lease.tenants;
    const property = lease.properties;
    const unit = lease.units;

    const leaseInvoices = invoices.filter(
      (invoice) => invoice.lease_id === lease.id
    );

    const billed = leaseInvoices.reduce(
      (sum, invoice) =>
        sum + Number(invoice.amount ?? 0),
      0
    );

    const paid = leaseInvoices.reduce(
      (sum, invoice) =>
        sum + Number(invoice.amount_paid ?? 0),
      0
    );

    const outstanding = leaseInvoices.reduce(
      (sum, invoice) =>
        sum + Number(invoice.balance ?? 0),
      0
    );

    const tenantName =
      tenant?.full_name ||
      `${tenant?.first_name ?? ""} ${tenant?.last_name ?? ""}`.trim() ||
      "Vacant";

    return {
      id: lease.id,
      property_id: lease.property_id ?? property?.id ?? null,
      property_name: property?.name ?? "Unknown Property",
      unit_id: lease.unit_id ?? unit?.id ?? null,
      unit_number: unit?.unit_number ?? "Unknown Unit",
      tenant_id: lease.tenant_id ?? tenant?.id ?? null,
      tenant_name: tenantName,
      lease_id: lease.id,
      lease_number: lease.lease_number ?? "",
      rent: Number(lease.rent_amount ?? 0),
      billed,
      paid,
      outstanding,
      lease_status: lease.status ?? "Unknown",
    };
  });
}
