"use client";

import { useEffect, useState } from "react";

import { Plus, Receipt } from "lucide-react";

import AppShell from "@/components/layout/AppShell";

import PageHeader from "@/components/ui/PageHeader";
import StatCard from "@/components/ui/StatCard";
import FilterBar from "@/components/ui/FilterBar";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import Loading from "@/components/ui/Loading";

import {
  Expense,
  getExpenses,
} from "@/services/expenses/getExpenses";

import {
  ExpenseDashboard,
  getExpenseDashboard,
} from "@/services/expenses/getExpenseDashboard";

import ExpensesList from "./ExpensesList";

export default function ExpensesPage() {

  const [expenses, setExpenses] =
    useState<Expense[]>([]);

  const [dashboard, setDashboard] =
    useState<ExpenseDashboard | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  async function loadData() {

    try {

      setLoading(true);

      const [
        expenseData,
        dashboardData,
      ] = await Promise.all([
        getExpenses(),
        getExpenseDashboard(),
      ]);

      setExpenses(expenseData);

      setDashboard(dashboardData);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  }

  useEffect(() => {

    loadData();

  }, []);

  const filteredExpenses =
    expenses.filter((expense) => {

      const query =
        search.toLowerCase();

      return (

        expense.expense_number
          .toLowerCase()
          .includes(query) ||

        expense.category
          .toLowerCase()
          .includes(query) ||

        (expense.vendor ?? "")
          .toLowerCase()
          .includes(query) ||

        (expense.reference ?? "")
          .toLowerCase()
          .includes(query)

      );

    });

  return (

    <AppShell>

      <div className="space-y-6">

        <PageHeader
          title="Expenses"
          description="Track and manage business expenses."
        >

          <Button>

            <Plus size={18} />

            Add Expense

          </Button>

        </PageHeader>

        {loading ? (

          <Loading />

        ) : (

          <>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

              <StatCard
                title="Total Expenses"
                value={
                  dashboard?.totalExpenses ?? 0
                }
              />

              <StatCard
                title="This Month"
                value={
                  dashboard?.thisMonth ?? 0
                }
              />

              <StatCard
                title="Paid"
                value={
                  dashboard?.totalPaid ?? 0
                }
              />

              <StatCard
                title="Pending"
                value={
                  dashboard?.totalPending ?? 0
                }
              />

            </div>

            <FilterBar
              search={search}
              onSearchChange={setSearch}
              searchPlaceholder="Search expenses..."
            />

            {filteredExpenses.length === 0 ? (

              <EmptyState
                icon={<Receipt size={48} />}
                title="No expenses found"
                description="Start by recording your first expense."
              />

            ) : (

              <ExpensesList
                expenses={filteredExpenses}
                onRefresh={loadData}
              />

            )}

          </>

        )}

      </div>

    </AppShell>

  );

}
