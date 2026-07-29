import { supabase } from "@/lib/supabase";
import type { WorkspaceSettings } from "@/types/workspace";

export async function getWorkspaceSettings(): Promise<WorkspaceSettings> {
  const { data, error } = await supabase.rpc(
    "get_workspace_settings"
  );

  if (error) {
    throw error;
  }

  if (!data || data.length === 0) {
    throw new Error("Workspace settings not found.");
  }

  return data[0] as WorkspaceSettings;
}

export async function updateWorkspaceSettings(
  settings: WorkspaceSettings
): Promise<WorkspaceSettings> {
  const { data, error } = await supabase.rpc(
    "update_workspace_settings",
    {
      p_company_name: settings.company_name,
      p_trading_name: settings.trading_name,
      p_registration_number: settings.registration_number,
      p_tax_pin: settings.tax_pin,
      p_vat_number: settings.vat_number,
      p_company_type: settings.company_type,
      p_industry: settings.industry,
      p_company_description: settings.company_description,

      p_phone: settings.phone,
      p_alternate_phone: settings.alternate_phone,
      p_email: settings.email,
      p_website: settings.website,
      p_whatsapp: settings.whatsapp,

      p_physical_address: settings.physical_address,
      p_postal_address: settings.postal_address,
      p_city: settings.city,
      p_county: settings.county,
      p_country: settings.country,
      p_google_maps_url: settings.google_maps_url,

      p_app_name: settings.app_name,
      p_browser_title: settings.browser_title,

      p_primary_color: settings.primary_color,
      p_secondary_color: settings.secondary_color,
      p_accent_color: settings.accent_color,

      p_currency: settings.currency,
      p_currency_symbol: settings.currency_symbol,
      p_timezone: settings.timezone,
      p_language: settings.language,
      p_date_format: settings.date_format,
      p_time_format: settings.time_format,

      p_financial_year_start:
        settings.financial_year_start,

      p_invoice_prefix: settings.invoice_prefix,
      p_receipt_prefix: settings.receipt_prefix,
      p_quotation_prefix: settings.quotation_prefix,
      p_expense_prefix: settings.expense_prefix,

      p_tax_enabled: settings.tax_enabled,
      p_tax_name: settings.tax_name,
      p_tax_rate: settings.tax_rate,

      p_invoice_footer: settings.invoice_footer,
      p_receipt_footer: settings.receipt_footer,

      p_enable_white_label:
        settings.enable_white_label,

      p_remove_ruby_branding:
        settings.remove_ruby_branding,

      p_footer_text: settings.footer_text,
    }
  );

  if (error) {
    throw error;
  }

  return data as WorkspaceSettings;
}
