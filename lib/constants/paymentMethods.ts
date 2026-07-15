export const PAYMENT_METHODS = [
  "Cash",
  "M-Pesa",
  "Bank",
  "Card",
  "Cheque",
  "Other",
] as const;

export type PaymentMethod =
  (typeof PAYMENT_METHODS)[number];
