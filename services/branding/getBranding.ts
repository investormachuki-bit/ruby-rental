import { supabase } from "@/lib/supabase";
import { getProfile } from "@/services/auth/getProfile";

export type WorkspaceBranding = {
  companyName: string;
  tradingName: string;
  logo: string | null;
  invoiceLogo: string | null;

  primaryColor: string;
  secondaryColor: string;
  accentColor: string;

  email: string;
  phone: string;
  alternatePhone: string;
  whatsapp: string;
  website: string;

  address: string;
  physicalAddress: string;
  postalAddress: string;
  city: string;
  county: string;
  country: string;
  taxPin: string;

  currency: string;
  currencySymbol: string;

  slogan: string;
  invoiceFooter: string;
  footerText: string;

  enableWhiteLabel: boolean;
  removeRubyBranding: boolean;
};

export async function getBranding(): Promise<WorkspaceBranding> {

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("Not authenticated.");
  }

  const profile =
    await getProfile(session.user.id);

  if (!profile) {
    throw new Error("Workspace not found.");
  }

  const {
    data,
    error,
  } = await supabase

    .from("workspace_settings")

    .select("*")

    .eq(
      "workspace_id",
      profile.workspace_id
    )

    .single();

  if (error || !data) {

    return {
      companyName: "Ruby Rental",
      tradingName: "Ruby Rental",
      logo: null,
      invoiceLogo: null,

      primaryColor: "#111827",
      secondaryColor: "#D4AF37",
      accentColor: "#F8FAFC",

      email: "info@rubyrental.app",
      phone: "",
      alternatePhone: "",
      whatsapp: "",
      website: "",

      address: "",
      physicalAddress: "",
      postalAddress: "",
      city: "",
      county: "",
      country: "Kenya",
      taxPin: "",

      currency: "KES",
      currencySymbol: "KSh",

      slogan: "Professional Property Management",
      invoiceFooter: "",
      footerText: "",

      enableWhiteLabel: false,
      removeRubyBranding: false,
    };

  }

  return {
    companyName:
      data.company_name ??
      "Ruby Rental",

    tradingName:
      data.trading_name ??
      data.company_name ??
      "Ruby Rental",

    logo:
      data.logo_url ?? null,

    invoiceLogo:
      data.invoice_logo_url ??
      data.logo_url ??
      null,

    primaryColor:
      data.primary_color ??
      "#111827",

    secondaryColor:
      data.secondary_color ??
      "#D4AF37",

    accentColor:
      data.accent_color ??
      "#F8FAFC",

    email:
      data.email ?? "",

    phone:
      data.phone ?? "",

    alternatePhone:
      data.alternate_phone ?? "",

    whatsapp:
      data.whatsapp ?? "",

    website:
      data.website ?? "",

    address:
      data.physical_address ??
      data.address ??
      "",

    physicalAddress:
      data.physical_address ?? "",

    postalAddress:
      data.postal_address ?? "",

    city:
      data.city ?? "",

    county:
      data.county ?? "",

    country:
      data.country ?? "Kenya",

    taxPin:
      data.tax_pin ?? "",

    currency:
      data.currency ?? "KES",

    currencySymbol:
      data.currency_symbol ??
      data.currency ??
      "KSh",

    slogan:
      data.slogan ?? "",

    invoiceFooter:
      data.invoice_footer ?? "",

    footerText:
      data.footer_text ?? "",

    enableWhiteLabel:
      Boolean(data.enable_white_label),

    removeRubyBranding:
      Boolean(data.remove_ruby_branding),
  };

}
