"use client";

import { useState } from "react";

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import ActionMenu from "@/components/ui/ActionMenu";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

import { CalendarDays, Building2, Home, Store } from "lucide-react";

import { Expense } from "@/services/expenses/getExpenses";
import { deleteExpense } from "@/services/expenses/deleteExpense";

type Props = {
  expense: Expense;

  onRefresh: () => void;
};

export default function ExpenseCard({
  expense,
  onRefresh,
}: Props) {

  const [loading, setLoading] =
    useState(false);

  const [confirmDelete, setConfirmDelete] =
    useState(false);

  async function handleDelete() {

    try {

      setLoading(true);

      await deleteExpense(expense.id);

      setConfirmDelete(false);

      onRefresh();

    } finally {

      setLoading(false);

    }

  }

  return (
    <>
      <Card>

        <div className="flex items-start justify-between gap-4">

          <div className="space-y-3 flex-1">

            <div className="flex flex-wrap items-center gap-2">

              <h3 className="text-lg font-semibold">

                {expense.expense_number}

              </h3>

              <Badge>

                {expense.category}

              </Badge>

              <Badge
                variant={
                  expense.status === "Paid"
                    ? "success"
                    : "warning"
                }
              >

                {expense.status}

              </Badge>

            </div>

            <div className="text-3xl font-bold">

              KES{" "}

              {expense.amount.toLocaleString()}

            </div>

            <div className="grid gap-2 text-sm text-gray-600 md:grid-cols-2">

              <div className="flex items-center gap-2">

                <Building2 size={16} />

                {expense.properties?.name ??
                  "No Property"}

              </div>

              <div className="flex items-center gap-2">

                <Home size={16} />

                {expense.units?.unit_number ??
                  "No Unit"}

              </div>

              <div className="flex items-center gap-2">

                <Store size={16} />

                {expense.vendor ??
                  "No Vendor"}

              </div>

              <div className="flex items-center gap-2">

                <CalendarDays size={16} />

                {expense.expense_date}

              </div>

            </div>

            {expense.reference && (

              <div className="text-sm">

                <span className="font-medium">

                  Reference:

                </span>{" "}

                {expense.reference}

              </div>

            )}

            {expense.description && (

              <p className="text-sm text-gray-600">

                {expense.description}

              </p>

            )}

          </div>

          <ActionMenu
            items={[
              {
                label: "View",
                onClick: () => {},
              },
              {
                label: "Edit",
                onClick: () => {},
              },
              {
                label: "Delete",
                danger: true,
                onClick: () =>
                  setConfirmDelete(true),
              },
            ]}
          />

        </div>

      </Card>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete Expense"
        message="Are you sure you want to delete this expense? This action cannot be undone."
        confirmText="Delete"
        loading={loading}
        onCancel={() =>
          setConfirmDelete(false)
        }
        onConfirm={handleDelete}
      />
    </>
  );

}
