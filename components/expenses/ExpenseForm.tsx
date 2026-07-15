"use client";

import { useEffect, useState } from "react";

import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import PropertyUnitSelector from "@/components/ui/PropertyUnitSelector";

import { PAYMENT_METHODS } from "@/lib/constants/paymentMethods";
import { EXPENSE_CATEGORIES } from "@/lib/constants/expenseCategories";
import { EXPENSE_STATUS } from "@/lib/constants/expenseStatus";

import {
  CreateExpenseInput,
  createExpense,
} from "@/services/expenses/createExpense";

import { updateExpense } from "@/services/expenses/updateExpense";
import { Expense } from "@/services/expenses/getExpenses";

type ExpenseFormData = Expense;
type Props = {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  expense?: ExpenseFormData;
};

export default function ExpenseForm({
  open,
  onClose,
  onSaved,
  expense,
}: Props) {

  const initialForm: CreateExpenseInput = {
    property_id: null,
    unit_id: null,
    expense_date: new Date()
      .toISOString()
      .split("T")[0],
    category: "Other",
    amount: 0,
    vendor: "",
    description: "",
    receipt_url: "",
    payment_method: "Cash",
    reference: "",
    status: "Paid",
  };

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [form, setForm] =
    useState<CreateExpenseInput>(
      initialForm
    );

  function update<
    K extends keyof CreateExpenseInput
  >(
    key: K,
    value: CreateExpenseInput[K]
  ) {

    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

  }

  function resetForm() {

    setError("");

    setForm({
      ...initialForm,
      expense_date: new Date()
        .toISOString()
        .split("T")[0],
    });

  }

  useEffect(() => {

    if (!open) return;

    if (!expense) {

      resetForm();

      return;

    }

    setError("");

    setForm({
      property_id: expense.property_id,
      unit_id: expense.unit_id,
      expense_date: expense.expense_date,
      category: expense.category,
      amount: expense.amount,
      vendor: expense.vendor ?? "",
      description: expense.description ?? "",
      receipt_url: expense.receipt_url ?? "",
      payment_method: expense.payment_method,
      reference: expense.reference ?? "",
      status: expense.status,
    });

  }, [open, expense]);
  async function handleSubmit() {

  try {

    setError("");

    if (!form.property_id) {

      setError(
        "Please select a property."
      );

      return;

    }

    if (!form.expense_date) {

      setError(
        "Expense date is required."
      );

      return;

    }

    if (form.amount <= 0) {

      setError(
        "Amount must be greater than zero."
      );

      return;

    }

    if (!form.category) {

      setError(
        "Please select a category."
      );

      return;

    }

    if (!form.payment_method) {

      setError(
        "Please select a payment method."
      );

      return;

    }

    if (!form.status) {

      setError(
        "Please select a status."
      );

      return;

    }

    setLoading(true);

    if (expense) {

      await updateExpense(
        expense.id,
        form
      );

    } else {

      await createExpense(form);

    }

    resetForm();

    onSaved();

    onClose();

  } catch (err) {

    setError(

      err instanceof Error

        ? err.message

        : expense
          ? "Failed to update expense."
          : "Failed to save expense."

    );

  } finally {

    setLoading(false);

  }

}
  return (

  <Modal
    open={open}
    title={
      expense
        ? "Edit Expense"
        : "Add Expense"
    }
    onClose={() => {

      resetForm();

      onClose();

    }}
    footer={
      <>
        <Button
          variant="secondary"
          onClick={() => {

            resetForm();

            onClose();

          }}
          disabled={loading}
        >
          Cancel
        </Button>

        <Button
          loading={loading}
          onClick={handleSubmit}
        >
          {expense
            ? "Update Expense"
            : "Save Expense"}
        </Button>
      </>
    }
  >

    <div className="space-y-5">

      {error && (

        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">

          {error}

        </div>

      )}

      <PropertyUnitSelector
        propertyId={form.property_id}
        unitId={form.unit_id}
        onPropertyChange={(value) =>
          update("property_id", value)
        }
        onUnitChange={(value) =>
          update("unit_id", value)
        }
      />

      <Input
        label="Expense Date"
        type="date"
        value={form.expense_date}
        onChange={(e) =>
          update(
            "expense_date",
            e.target.value
          )
        }
      />

      <Select
        label="Category"
        value={form.category}
        options={EXPENSE_CATEGORIES.map(
          (item) => ({
            label: item,
            value: item,
          })
        )}
        onChange={(e) =>
          update(
            "category",
            e.target
              .value as CreateExpenseInput["category"]
          )
        }
      />

      <Input
        label="Amount"
        type="number"
        value={String(form.amount)}
        onChange={(e) =>
          update(
            "amount",
            Number(e.target.value)
          )
        }
      />

      <Input
        label="Vendor"
        value={form.vendor ?? ""}
        onChange={(e) =>
          update(
            "vendor",
            e.target.value
          )
        }
      />

      <Select
        label="Payment Method"
        value={form.payment_method}
        options={PAYMENT_METHODS.map(
          (item) => ({
            label: item,
            value: item,
          })
        )}
        onChange={(e) =>
          update(
            "payment_method",
            e.target
              .value as CreateExpenseInput["payment_method"]
          )
        }
      />

      <Input
        label="Reference"
        value={form.reference ?? ""}
        onChange={(e) =>
          update(
            "reference",
            e.target.value
          )
        }
      />

      <Select
        label="Status"
        value={form.status}
        options={EXPENSE_STATUS.map(
          (item) => ({
            label: item,
            value: item,
          })
        )}
        onChange={(e) =>
          update(
            "status",
            e.target
              .value as CreateExpenseInput["status"]
          )
        }
      />

      <Textarea
        label="Description"
        value={form.description ?? ""}
        onChange={(e) =>
          update(
            "description",
            e.target.value
          )
        }
      />

    </div>

  </Modal>

);

}
