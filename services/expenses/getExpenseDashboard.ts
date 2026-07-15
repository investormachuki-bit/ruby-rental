import { getExpenses } from "./getExpenses";

export type ExpenseDashboard = {
  totalExpenses: number;

  totalPaid: number;

  totalPending: number;

  thisMonth: number;

  expenseCount: number;

  paidCount: number;

  pendingCount: number;
};

export async function getExpenseDashboard(): Promise<ExpenseDashboard> {

  const expenses = await getExpenses();

  const now = new Date();

  const currentMonth = now.getMonth();

  const currentYear = now.getFullYear();

  let totalExpenses = 0;

  let totalPaid = 0;

  let totalPending = 0;

  let thisMonth = 0;

  let paidCount = 0;

  let pendingCount = 0;

  for (const expense of expenses) {

    totalExpenses += expense.amount;

    if (expense.status === "Paid") {

      totalPaid += expense.amount;

      paidCount++;

    } else {

      totalPending += expense.amount;

      pendingCount++;

    }

    const expenseDate = new Date(expense.expense_date);

    if (
      expenseDate.getMonth() === currentMonth &&
      expenseDate.getFullYear() === currentYear
    ) {

      thisMonth += expense.amount;

    }

  }

  return {

    totalExpenses,

    totalPaid,

    totalPending,

    thisMonth,

    expenseCount: expenses.length,

    paidCount,

    pendingCount,

  };

}
