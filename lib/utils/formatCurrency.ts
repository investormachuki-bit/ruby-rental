export type SupportedCurrency =
  | "KES"
  | "USD"
  | "UGX"
  | "TZS"
  | "RWF";

type FormatCurrencyOptions = {
  currency?: SupportedCurrency;

  locale?: string;

  minimumFractionDigits?: number;

  maximumFractionDigits?: number;
};

export function formatCurrency(
  amount: number,
  options: FormatCurrencyOptions = {}
): string {

  const {
    currency = "KES",
    locale = "en-KE",
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
  } = options;

  return new Intl.NumberFormat(
    locale,
    {
      style: "currency",
      currency,
      minimumFractionDigits,
      maximumFractionDigits,
    }
  ).format(amount);

}
