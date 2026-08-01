export interface BillingSettings {
  workspace_id: string;
  invoice_prefix: string;
  next_invoice_number: number;

  receipt_prefix: string;
  next_receipt_number: number;

  billing_day: number;
  due_days: number;
  grace_period: number;

  auto_generate_invoices: boolean;
  auto_generate_receipts: boolean;

  prorate_first_month: boolean;

  enable_late_fees: boolean;
  late_fee_type: "Fixed" | "Percentage";
  late_fee_amount: number;

  currency: string;
  currency_symbol: string;

  vat_enabled: boolean;
  vat_rate: number;

  footer_text: string;
  signature_name: string;
  show_logo: boolean;
}
