"use client";

import { useState } from "react";

export type RecurringChargeFormValues = {
  propertyId: string;
  unitId?: string;
  leaseId?: string;

  chargeName: string;
  description?: string;

  amount: number;

  billingFrequency: string;

  isMandatory: boolean;
  isActive: boolean;
};

type Props = {
  initialValues?: Partial<RecurringChargeFormValues>;

  loading?: boolean;

  onSubmit: (
    values: RecurringChargeFormValues
  ) => Promise<void>;
};

const BILLING_FREQUENCIES = [
  "Monthly",
  "Quarterly",
  "Biannual",
  "Annual",
  "One Time",
];

export default function RecurringChargeForm({
  initialValues,
  loading = false,
  onSubmit,
}: Props) {
  const [values, setValues] =
    useState<RecurringChargeFormValues>({
      propertyId:
        initialValues?.propertyId ?? "",

      unitId:
        initialValues?.unitId ?? "",

      leaseId:
        initialValues?.leaseId ?? "",

      chargeName:
        initialValues?.chargeName ?? "",

      description:
        initialValues?.description ?? "",

      amount:
        initialValues?.amount ?? 0,

      billingFrequency:
        initialValues?.billingFrequency ??
        "Monthly",

      isMandatory:
        initialValues?.isMandatory ?? true,

      isActive:
        initialValues?.isActive ?? true,
    });

  function update(
    key: keyof RecurringChargeFormValues,
    value: any
  ) {
    setValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    await onSubmit({
      ...values,
      amount: Number(values.amount),
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">
            Property ID
          </label>

          <input
            className="w-full rounded-lg border p-3"
            value={values.propertyId}
            onChange={(e) =>
              update(
                "propertyId",
                e.target.value
              )
            }
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Unit ID
          </label>

          <input
            className="w-full rounded-lg border p-3"
            value={values.unitId}
            onChange={(e) =>
              update(
                "unitId",
                e.target.value
              )
            }
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Lease ID
          </label>

          <input
            className="w-full rounded-lg border p-3"
            value={values.leaseId}
            onChange={(e) =>
              update(
                "leaseId",
                e.target.value
              )
            }
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Charge Name
          </label>

          <input
            className="w-full rounded-lg border p-3"
            value={values.chargeName}
            onChange={(e) =>
              update(
                "chargeName",
                e.target.value
              )
            }
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Amount
          </label>

          <input
            type="number"
            min="0"
            step="0.01"
            className="w-full rounded-lg border p-3"
            value={values.amount}
            onChange={(e) =>
              update(
                "amount",
                e.target.value
              )
            }
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Billing Frequency
          </label>

          <select
            className="w-full rounded-lg border p-3"
            value={
              values.billingFrequency
            }
            onChange={(e) =>
              update(
                "billingFrequency",
                e.target.value
              )
            }
          >
            {BILLING_FREQUENCIES.map(
              (frequency) => (
                <option
                  key={frequency}
                  value={frequency}
                >
                  {frequency}
                </option>
              )
            )}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Description
        </label>

        <textarea
          rows={4}
          className="w-full rounded-lg border p-3"
          value={values.description}
          onChange={(e) =>
            update(
              "description",
              e.target.value
            )
          }
        />
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={values.isMandatory}
            onChange={(e) =>
              update(
                "isMandatory",
                e.target.checked
              )
            }
          />

          Mandatory Charge
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={values.isActive}
            onChange={(e) =>
              update(
                "isActive",
                e.target.checked
              )
            }
          />

          Active
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-black px-6 py-3 font-medium text-white disabled:opacity-50"
      >
        {loading
          ? "Saving..."
          : "Save Recurring Charge"}
      </button>
    </form>
  );
}
