import { getAllPayments } from "@/services/payments/getAll";
import { getExpenses } from "@/services/expenses/getExpenses";

export type CashFlowSummary = {
  totalIncome: number;
  totalExpenses: number;
  netCashFlow: number;
  payments: number;
  expenses: number;
};

export async function getCashFlow(): Promise<CashFlowSummary> {

  const [
    payments,
    expenses,
  ] = await Promise.all([
    getAllPayments(),
    getExpenses(),
  ]);

  const totalIncome =
    payments.reduce(
      (sum, payment: any) =>
        sum + Number(payment.amount ?? 0),
      0
    );

  const totalExpenses =
    expenses.reduce(
      (sum, expense) =>
        sum + Number(expense.amount ?? 0),
      0
    );

  return {
    totalIncome,
    totalExpenses,
    netCashFlow:
      totalIncome - totalExpenses,
    payments: payments.length,
    expenses: expenses.length,
  };

}
