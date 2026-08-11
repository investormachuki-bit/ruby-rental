"use client";

import { useEffect, useState } from "react";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import TextArea from "@/components/ui/Textarea";
import Card from "@/components/ui/Card";

import {
  Employee,
  EmployeeFormValues,
  RoleOption,
} from "@/types/employees";

type EmployeeDialogProps = {
  open: boolean;
  employee: Employee | null;
  roles: RoleOption[];
  onClose: () => void;
  onSave: (
    values: EmployeeFormValues
  ) => Promise<void>;
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
  employee,
  roles,
  onClose,
  onSave,
}: EmployeeDialogProps) {
  const [values, setValues] =
    useState<EmployeeFormValues>(
      emptyValues
    );

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    if (employee) {
      setValues({
        full_name: employee.full_name ?? "",
        phone: employee.phone ?? "",
        email: employee.email ?? "",
        designation:
          employee.designation ?? "",
        role_id: employee.role_id ?? "",
        notes: "",
      });
    } else {
      setValues(emptyValues);
    }

    setError(null);
  }, [open, employee]);

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
      setError(
        "Employee name is required."
      );
      return;
    }

    if (!values.phone.trim()) {
      setError(
        "Phone number is required."
      );
      return;
    }

    if (!values.role_id) {
      setError(
        "Please select a role."
      );
      return;
    }

    setSaving(true);

    try {
      await onSave({
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

      onClose();
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
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

      <Card className="max-h-[90vh] w-full max-w-xl overflow-y-auto">

        <div className="mb-6">

          <h2 className="text-xl font-semibold text-gray-900">
            {employee
              ? "Edit Employee"
              : "Add Employee"}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {employee
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
            disabled={saving}
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
              disabled={saving}
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
              disabled={saving}
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
              disabled={saving}
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
                disabled={saving}
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
            disabled={saving}
            placeholder="Optional notes"
          />

          <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">

            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              loading={saving}
            >
              {employee
                ? "Save Changes"
                : "Add Employee"}
            </Button>

          </div>

        </form>

      </Card>

    </div>
  );
}