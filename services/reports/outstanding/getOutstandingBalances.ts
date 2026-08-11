import { getInvoices } from "@/services/invoices/getInvoices";

export type OutstandingBalanceRow = {
  invoice_number: string;
  tenant: string;
  property: string;
  unit: string;
  billing_period: string;
  due_date: string;
  amount: number;
  amount_paid: number;
  balance: number;
  status: string;
};

export async function getOutstandingBalances(): Promise<
  OutstandingBalanceRow[]
> {
  const invoices = await getInvoices();

  return invoices
    .filter((invoice) => Number(invoice.balance ?? 0) > 0)
    .map((invoice) => ({
      invoice_number: invoice.invoice_number,
      tenant: invoice.tenant_name ?? "Unknown Tenant",
      property: invoice.property_name ?? "Unknown Property",
      unit: invoice.unit_number ?? "Unknown Unit",
      billing_period: invoice.billing_period ?? "",
      due_date: invoice.due_date ?? "",
      amount: Number(invoice.amount ?? 0),
      amount_paid: Number(invoice.amount_paid ?? 0),
      balance: Number(invoice.balance ?? 0),
      status: invoice.status ?? "",
    }))
    .sort(
      (a, b) =>
        new Date(a.due_date).getTime() -
        new Date(b.due_date).getTime()
    );
}
