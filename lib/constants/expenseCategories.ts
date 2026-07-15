export const EXPENSE_CATEGORIES = [
  "Repairs",
  "Maintenance",
  "Cleaning",
  "Security",
  "Water",
  "Electricity",
  "Garbage Collection",
  "Internet",
  "Staff Salaries",
  "Fuel",
  "Office Supplies",
  "Marketing",
  "Government Fees",
  "Insurance",
  "Other",
] as const;

export type ExpenseCategory =
  (typeof EXPENSE_CATEGORIES)[number];
