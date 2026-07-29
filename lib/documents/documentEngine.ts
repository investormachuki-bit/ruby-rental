import { getWorkspaceSettings } from "@/services/workspace";
import { CompanyDocumentInfo } from "@/types/document";

export async function getDocumentCompany(): Promise<CompanyDocumentInfo> {

  const settings =
    await getWorkspaceSettings();

  return {

    company_name:
      settings.company_name,

    trading_name:
      settings.trading_name,

    logo_url:
      settings.invoice_logo_url ||
      settings.logo_url,

    company_stamp_url:
      settings.company_stamp_url,

    signature_url:
      settings.signature_url,

    phone:
      settings.phone,

    email:
      settings.email,

    website:
      settings.website,

    physical_address:
      settings.physical_address,

    postal_address:
      settings.postal_address,

    city:
      settings.city,

    country:
      settings.country,

    currency:
      settings.currency,

    currency_symbol:
      settings.currency_symbol,

    invoice_footer:
      settings.invoice_footer,

    receipt_footer:
      settings.receipt_footer,

    footer_text:
      settings.remove_ruby_branding
        ? null
        : settings.footer_text,

    tax_enabled:
      settings.tax_enabled,

    tax_name:
      settings.tax_name,

    tax_rate:
      Number(settings.tax_rate),

  };

}
