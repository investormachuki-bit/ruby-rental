import { supabase } from "@/lib/supabase";
import { getProfile } from "@/services/auth/getProfile";

export type FinancePayment = {
  id: string;
  workspace_id: string;
  lease_id: string;
  property_id: string;
  unit_id: string;
  tenant_id: string;
  receipt_number: string;
  payment_date: string;
  payment_type: string;
  payment_method: string;
  amount: number;
  allocated_amount: number;
  unallocated_amount: number;
  status: string;
  reference_number: string | null;
  notes: string | null;
  tenant_name: string;
  property_name: string;
  unit_number: string;
};

export async function getAllPayments(): Promise<FinancePayment[]> {
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
    .from("payments")
    .select(`
      id,
      workspace_id,
      lease_id,
      property_id,
      unit_id,
      tenant_id,
      receipt_number,
      payment_date,
      payment_type,
      payment_method,
      amount,
      allocated_amount,
      unallocated_amount,
      status,
      reference_number,
      notes,
      tenants!payments_tenant_id_fkey(
        id,
        first_name,
        last_name,
        full_name
      ),
      properties!payments_property_id_fkey(
        id,
        name
      ),
      units!payments_unit_id_fkey(
        id,
        unit_number
      )
    `)
    .eq("workspace_id", profile.workspace_id)
    .eq("is_reversed", false)
    .order("payment_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map((payment: any) => {
    const tenant = payment.tenants;

    const tenantName =
      tenant?.full_name ||
      `${tenant?.first_name ?? ""} ${tenant?.last_name ?? ""}`.trim() ||
      "Unknown Tenant";

    return {
      ...payment,
      amount: Number(payment.amount ?? 0),
      allocated_amount: Number(payment.allocated_amount ?? 0),
      unallocated_amount: Number(payment.unallocated_amount ?? 0),
      tenant_name: tenantName,
      property_name:
        payment.properties?.name ?? "Unknown Property",
      unit_number:
        payment.units?.unit_number ?? "Unknown Unit",
    };
  });
}
