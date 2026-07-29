export interface WorkspaceSettings {
  id: string;
  workspace_id: string;

  company_name: string;
  trading_name: string | null;
  registration_number: string | null;
  tax_pin: string | null;
  vat_number: string | null;
  company_type: string | null;
  industry: string | null;
  company_description: string | null;

  phone: string | null;
  alternate_phone: string | null;
  email: string | null;
  website: string | null;
  whatsapp: string | null;

  physical_address: string | null;
  postal_address: string | null;
  city: string | null;
  county: string | null;
  country: string;

  google_maps_url: string | null;

  app_name: string;
  browser_title: string;

  logo_url: string | null;
  login_logo_url: string | null;
  favicon_url: string | null;
  login_background_url: string | null;

  invoice_logo_url: string | null;
  receipt_logo_url: string | null;
  company_stamp_url: string | null;
  signature_url: string | null;

  primary_color: string;
  secondary_color: string;
  accent_color: string;

  currency: string;
  currency_symbol: string;
  timezone: string;
  language: string;
  date_format: string;
  time_format: string;

  financial_year_start: string | null;

  invoice_prefix: string;
  receipt_prefix: string;
  quotation_prefix: string;
  expense_prefix: string;

  tax_enabled: boolean;
  tax_name: string;
  tax_rate: number;

  invoice_footer: string | null;
  receipt_footer: string | null;

  enable_white_label: boolean;
  remove_ruby_branding: boolean;
  footer_text: string;

  active: boolean;

  created_at: string;
  updated_at: string;
}
