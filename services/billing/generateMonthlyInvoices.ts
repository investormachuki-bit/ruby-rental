import { getActiveLeases } from "@/services/leases/getActiveLeases";
import { buildInvoice } from "./buildInvoice";
import { createInvoice } from "@/services/invoices/createInvoice";
import { createInvoiceItem } from "@/services/invoiceItems/createInvoiceItem";
import type { MonthlyBillingSummary, BillingSummaryItem } from "./types";

export async function generateMonthlyInvoices(targetDate = new Date()): Promise<MonthlyBillingSummary> {
  const leases = await getActiveLeases();
  const billingPeriod = `${targetDate.toLocaleString("default", { month: "long" })} ${targetDate.getFullYear()}`;
  const results: BillingSummaryItem[] = [];

  const summary: MonthlyBillingSummary = {
    billing_period: billingPeriod,
    occupied_units: leases.length,
    existing_invoices: 0,
    new_invoices: 0,
    skipped_units: 0,
    failed: 0,
    expected_revenue: 0,
    rent_total: 0,
    utility_charges: 0,
    previous_balances: 0,
    generated: 0,
    skipped: 0,
    failed_units: 0,
    results,
  };

  for (const lease of leases) {
    const unitLabel =
  lease.unit?.[0]?.unit_number ?? "Unit";
    const tenantName =
  lease.tenant?.[0]?.full_name ??
  lease.tenant?.[0]?.first_name ??
  "Tenant";

    try {
      const invoiceData = await buildInvoice(lease.id, billingPeriod);
      const existingInvoice = await fetchExistingInvoice(lease.id, billingPeriod);

      if (existingInvoice) {
        summary.existing_invoices += 1;
        summary.skipped_units += 1;
        summary.skipped += 1;
        results.push({ lease_id: lease.id, unit_label: unitLabel, tenant_name: tenantName, status: "skipped", reason: "Invoice already exists for this billing period." });
        continue;
      }

      const invoice = await createInvoice({
        lease_id: lease.id,
        property_id: lease.property_id,
        unit_id: lease.unit_id,
        tenant_id: lease.tenant_id ?? lease.occupant_id ?? "",
        invoice_type: "Rent",
        billing_period: billingPeriod,
        invoice_date: targetDate.toISOString().split("T")[0],
        due_date: targetDate.toISOString().split("T")[0],
        notes: `Monthly auto-generated invoice for ${billingPeriod}`,
      });

      for (const item of invoiceData.items) {
        await createInvoiceItem({
          invoice_id: invoice.id,
          item_type: item.item_type,
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
        });
      }

      summary.new_invoices += 1;
      summary.generated += 1;
      summary.expected_revenue += Number(invoiceData.total ?? 0);
      summary.rent_total += Number(invoiceData.rent_total ?? 0);
      summary.utility_charges += Number(invoiceData.utility_charges ?? 0);
      summary.previous_balances += Number(invoiceData.previous_balances ?? 0);
      results.push({ lease_id: lease.id, unit_label: unitLabel, tenant_name: tenantName, status: "generated", invoice_id: invoice.id, amount: Number(invoiceData.total ?? 0) });
    } catch (error: any) {
      summary.failed += 1;
      summary.failed_units += 1;
      results.push({ lease_id: lease.id, unit_label: unitLabel, tenant_name: tenantName, status: "failed", reason: error?.message ?? "Billing generation failed." });
    }
  }

  summary.skipped_units = summary.skipped_units;
  summary.generated = summary.generated;
  summary.failed_units = summary.failed_units;
  return summary;
}

async function fetchExistingInvoice(leaseId: string, billingPeriod: string) {
  const { createClient } = await import("@/lib/supabase");
  const supabase = createClient();
  const { data } = await supabase
    .from("invoices")
    .select("id")
    .eq("lease_id", leaseId)
    .eq("billing_period", billingPeriod)
    .maybeSingle();
  return data;
}
