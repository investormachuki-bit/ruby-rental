"use client";

import { useEffect, useState } from "react";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import TextArea from "@/components/ui/Textarea";
import Card from "@/components/ui/Card";

import {
  EmployeeFormValues,
  RoleOption,
} from "@/types/employees";

type EmployeeDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    values: EmployeeFormValues
  ) => Promise<void>;
  roles: RoleOption[];
  initialValues?: EmployeeFormValues | null;
  loading?: boolean;
};

const emptyValues: EmployeeFormValues = {
  full_name: "",
  phone: "",
  email: "",
  designation: "",
  role_id: "",
  notes: "",
};

export default function EmployeeDialog({
  open,
  onClose,
  onSubmit,
  roles,
  initialValues,
  loading = false,
}: EmployeeDialogProps) {
  const [values, setValues] =
    useState<EmployeeFormValues>(
      initialValues ?? emptyValues
    );

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setValues(
        initialValues ?? emptyValues
      );
      setError(null);
    }
  }, [open, initialValues]);

  if (!open) {
    return null;
  }

  function updateField(
    field: keyof EmployeeFormValues,
    value: string
  ) {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(
    event: React.FormEvent
  ) {
    event.preventDefault();

    setError(null);

    if (!values.full_name.trim()) {
      setError("Employee name is required.");
      return;
    }

    if (!values.phone.trim()) {
      setError("Phone number is required.");
      return;
    }

    if (!values.role_id) {
      setError("Please select a role.");
      return;
    }

    try {
      await onSubmit({
        ...values,
        full_name:
          values.full_name.trim(),
        phone:
          values.phone.trim(),
        email:
          values.email.trim(),
        designation:
          values.designation.trim(),
        notes:
          values.notes.trim(),
      });
    } catch (error: unknown) {
      console.error(
        "Employee save failed:",
        error
      );

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(
          "Unable to save employee. Please try again."
        );
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

      <Card className="max-h-[90vh] w-full max-w-xl overflow-y-auto">

        <div className="mb-6">

          <h2 className="text-xl font-semibold text-gray-900">
            {initialValues
              ? "Edit Employee"
              : "Add Employee"}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {initialValues
              ? "Update employee information."
              : "Add a staff member to your workspace."}
          </p>

        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <Input
            label="Full Name *"
            value={values.full_name}
            onChange={(event) =>
              updateField(
                "full_name",
                event.target.value
              )
            }
            disabled={loading}
            autoFocus
          />

          <div className="grid gap-5 sm:grid-cols-2">

            <Input
              label="Phone *"
              value={values.phone}
              onChange={(event) =>
                updateField(
                  "phone",
                  event.target.value
                )
              }
              disabled={loading}
              type="tel"
            />

            <Input
              label="Email"
              value={values.email}
              onChange={(event) =>
                updateField(
                  "email",
                  event.target.value
                )
              }
              disabled={loading}
              type="email"
            />

          </div>

          <div className="grid gap-5 sm:grid-cols-2">

            <Input
              label="Designation"
              value={values.designation}
              onChange={(event) =>
                updateField(
                  "designation",
                  event.target.value
                )
              }
              disabled={loading}
              placeholder="e.g. Property Manager"
            />

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Role *
              </label>

              <select
                value={values.role_id}
                onChange={(event) =>
                  updateField(
                    "role_id",
                    event.target.value
                  )
                }
                disabled={loading}
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200 disabled:bg-gray-100"
              >
                <option value="">
                  Select role
                </option>

                {roles.map((role) => (
                  <option
                    key={role.id}
                    value={role.id}
                  >
                    {role.name}
                  </option>
                ))}
              </select>
            </div>

          </div>

          <TextArea
            label="Notes"
            rows={3}
            value={values.notes}
            onChange={(event) =>
              updateField(
                "notes",
                event.target.value
              )
            }
            disabled={loading}
            placeholder="Optional notes"
          />

          <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">

            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              loading={loading}
            >
              {initialValues
                ? "Save Changes"
                : "Add Employee"}
            </Button>

          </div>

        </form>

      </Card>

    </div>
  );
}