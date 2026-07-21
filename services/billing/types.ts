export type InvoiceLineItem = {
  item_type:
    | "Rent"
    | "Water"
    | "Electricity"
    | "Garbage"
    | "Service Charge"
    | "Parking"
    | "Penalty"
    | "Previous Balance"
    | "Other";
  description: string;
  quantity: number;
  unit_price: number;
};

export type InvoiceBuildResult = {
  billing_period: string;
  items: InvoiceLineItem[];
  subtotal: number;
  total: number;
  rent_total: number;
  utility_charges: number;
  previous_balances: number;
};

export type BillingSummaryItem = {
  lease_id: string;
  unit_label: string;
  tenant_name: string;
  status: "generated" | "skipped" | "failed";
  reason?: string;
  invoice_id?: string;
  amount?: number;
};

export type MonthlyBillingSummary = {
  billing_period: string;
  occupied_units: number;
  existing_invoices: number;
  new_invoices: number;
  skipped_units: number;
  failed: number;
  expected_revenue: number;
  rent_total: number;
  utility_charges: number;
  previous_balances: number;
  generated: number;
  skipped: number;
  failed_units: number;
  results: BillingSummaryItem[];
};
