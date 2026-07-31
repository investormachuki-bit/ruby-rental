import { supabase } from "@/lib/supabase";

export async function getInvoiceDetails(
  invoiceId: string
) {
  const {
    data,
    error,
  } = await supabase
    .from("invoices")
    .select(`
      *,
      property:properties(
        id,
        name,
        address
      ),
      unit:units(
        id,
        unit_number,
        floor
      ),
      tenant:tenants(
        id,
        full_name,
        first_name,
        last_name,
        phone,
        email
      ),
      lease:leases(
        id,
        lease_number,
        start_date,
        end_date,
        rent_amount
      ),
      items:invoice_items(
        id,
        item_type,
        description,
        quantity,
        unit_price,
        amount
      ),
      payments(
        id,
        receipt_number,
        payment_date,
        payment_method,
        amount
      )
    `)
    .eq("id", invoiceId)
    .single();

  if (error) {
    console.error(
      "GET INVOICE DETAILS ERROR",
      error
    );

    throw error;
  }

  const tenant =
    data.tenant ?? {};

  const property =
    data.property ?? {};

  const unit =
    data.unit ?? {};

  const lease =
    data.lease ?? {};

  const items =
    data.items ?? [];

  const payments =
    data.payments ?? [];

  return {

    ...data,

    tenant_name:
      tenant.full_name ??
      `${tenant.first_name ?? ""} ${tenant.last_name ?? ""}`.trim(),

    tenant_phone:
      tenant.phone ?? "",

    tenant_email:
      tenant.email ?? "",

    property_name:
      property.name ?? "",

    property_address:
      property.address ?? "",

    unit_number:
      unit.unit_number ?? "",

    unit_floor:
      unit.floor ?? "",

    lease_number:
      lease.lease_number ?? "",

    lease_start:
      lease.start_date ?? "",

    lease_end:
      lease.end_date ?? "",

    rent_amount:
      Number(
        lease.rent_amount ?? 0
      ),

    items,

    payments,

    total_items:
      items.length,

    total_payments:
      payments.reduce(
        (
          total: number,
          payment: any
        ) =>
          total +
          Number(
            payment.amount
          ),
        0
      ),

  };

}
