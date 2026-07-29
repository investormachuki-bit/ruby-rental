export type CompanyDocumentInfo = {
  company_name: string;
  trading_name: string | null;

  logo_url: string | null;

  company_stamp_url: string | null;

  signature_url: string | null;

  phone: string | null;

  email: string | null;

  website: string | null;

  physical_address: string | null;

  postal_address: string | null;

  city: string | null;

  country: string | null;

  currency: string;

  currency_symbol: string;

  invoice_footer: string | null;

  receipt_footer: string | null;

  footer_text: string | null;

  tax_enabled: boolean;

  tax_name: string;

  tax_rate: number;
};

export type DocumentTheme = {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
};

export type DocumentOptions = {
  showLogo?: boolean;
  showStamp?: boolean;
  showSignature?: boolean;
  showFooter?: boolean;
};
