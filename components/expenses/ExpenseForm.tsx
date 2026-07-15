"use client";

import { useState } from "react";

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

type Props = {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
};

export default function ExpenseForm({
  open,
  onClose,
  onSaved,
}: Props) {

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] =
    useState<CreateExpenseInput>({
      property_id: null,
      unit_id: null,
      expense_date:
        new Date()
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
    });

  function update(
    key: keyof CreateExpenseInput,
    value: any
  ) {

    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

  }

  async function handleSubmit() {

    try {

      setLoading(true);

      await createExpense(form);

      onSaved();

      onClose();

    } finally {

      setLoading(false);

    }

  }

  return (

    <Modal
      open={open}
      title="Add Expense"
      onClose={onClose}
      footer={
        <>
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            loading={loading}
            onClick={handleSubmit}
          >
            Save Expense
          </Button>
        </>
      }
    >

      <div className="space-y-5">

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
          onChange={(value) =>
            update("expense_date", value)
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
          onChange={(value) =>
            update("category", value)
          }
        />

        <Input
          label="Amount"
          type="number"
          value={form.amount}
          onChange={(value) =>
            update(
              "amount",
              Number(value)
            )
          }
        />

        <Input
          label="Vendor"
          value={form.vendor ?? ""}
          onChange={(value) =>
            update("vendor", value)
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
          onChange={(value) =>
            update(
              "payment_method",
              value
            )
          }
        />

        <Input
          label="Reference"
          value={form.reference ?? ""}
          onChange={(value) =>
            update(
              "reference",
              value
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
          onChange={(value) =>
            update("status", value)
          }
        />

        <Textarea
          label="Description"
          value={form.description ?? ""}
          onChange={(value) =>
            update(
              "description",
              value
            )
          }
        />

      </div>

    </Modal>

  );

}
