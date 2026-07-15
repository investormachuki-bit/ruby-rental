"use client";

import { Expense } from "@/services/expenses/getExpenses";

import ExpenseCard from "./ExpenseCard";

type ExpensesListProps = {
  expenses: Expense[];

  onRefresh: () => void;
};

export default function ExpensesList({
  expenses,
  onRefresh,
}: ExpensesListProps) {

  return (

    <div className="space-y-4">

      {expenses.map((expense) => (

        <ExpenseCard
          key={expense.id}
          expense={expense}
          onRefresh={onRefresh}
        />

      ))}

    </div>

  );

}
