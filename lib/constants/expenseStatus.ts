export const EXPENSE_STATUS = [
  "Paid",
  "Pending",
] as const;

export type ExpenseStatus =
  (typeof EXPENSE_STATUS)[number];
