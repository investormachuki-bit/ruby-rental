export type StatementTransaction = {
  id: string;
  date: string;
  type: "Invoice" | "Payment" | "Credit" | "Adjustment";
  reference: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
};

export type Statement = {
  title: string;
  reference: string;
  openingBalance: number;
  closingBalance: number;
  transactions: StatementTransaction[];
};
