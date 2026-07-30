import { supabase } from "@/lib/supabase";
import { getProfile } from "@/services/auth/getProfile";

export type WorkspaceBranding = {
  companyName: string;
  tradingName: string;
  logo: string | null;

  primaryColor: string;
  secondaryColor: string;
  accentColor: string;

  email: string;
  phone: string;
  website: string;

  address: string;
  taxPin: string;

  currency: string;

  slogan: string;
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

      primaryColor: "#111827",

      secondaryColor: "#D4AF37",

      accentColor: "#F8FAFC",

      email: "info@rubyrental.app",

      phone: "",

      website: "www.rubyrental.app",

      address: "",

      taxPin: "",

      currency: "KES",

      slogan:
        "Professional Property Management",

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

    website:
      data.website ?? "",

    address:
      data.address ?? "",

    taxPin:
      data.tax_pin ?? "",

    currency:
      data.currency ?? "KES",

    slogan:
      data.slogan ??
      "",

  };

}
