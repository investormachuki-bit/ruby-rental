"use client";

import { useState } from "react";

export type ChargeScope = "property" | "unit";

export type RecurringChargeFormValues = {
  propertyId: string;
  scope: ChargeScope;

  unitId?: string;
  leaseId?: string;

  chargeName: string;
  customChargeName?: string;

  description?: string;

  amount: number;

  billingFrequency: string;

  startsOn: string;
  endsOn?: string;

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
  "Daily",
  "Weekly",
  "Monthly",
  "Quarterly",
  "Biannual",
  "Annual",
  "One Time",
];

const COMMON_CHARGES = [
  "Garbage Collection",
  "Parking",
  "Security",
  "Water",
  "Sewer",
  "Cleaning",
  "Internet",
  "Maintenance Fee",
  "Service Charge",
  "Other",
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

      scope:
        initialValues?.scope ??
        "property",

      unitId:
        initialValues?.unitId ?? "",

      leaseId:
        initialValues?.leaseId ?? "",

      chargeName:
        initialValues?.chargeName ?? "",

      customChargeName:
        initialValues?.customChargeName ??
        "",

      description:
        initialValues?.description ?? "",

      amount:
        initialValues?.amount ?? 0,

      billingFrequency:
        initialValues?.billingFrequency ??
        "Monthly",

      startsOn:
        initialValues?.startsOn ??
        new Date()
          .toISOString()
          .split("T")[0],

      endsOn:
        initialValues?.endsOn ?? "",

      isMandatory:
        initialValues?.isMandatory ??
        true,

      isActive:
        initialValues?.isActive ??
        true,
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

      chargeName:
        values.chargeName === "Other"
          ? values.customChargeName ?? ""
          : values.chargeName,

      amount: Number(values.amount),
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8"
    >
      {/* PROPERTY ASSIGNMENT */}

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-lg font-semibold">
          Property Assignment
        </h2>

        <div className="grid gap-5 md:grid-cols-2">

          <div>
            <label className="mb-2 block text-sm font-medium">
              Property *
            </label>

            <select
              className="w-full rounded-lg border p-3"
              value={values.propertyId}
              onChange={(e) =>
                update(
                  "propertyId",
                  e.target.value
                )
              }
              required
            >
              <option value="">
                Select Property
              </option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Applies To *
            </label>

            <div className="space-y-3 rounded-lg border p-4">

              <label className="flex items-center gap-3">

                <input
                  type="radio"
                  checked={
                    values.scope ===
                    "property"
                  }
                  onChange={() =>
                    update(
                      "scope",
                      "property"
                    )
                  }
                />

                <span>
                  Entire Property (All Units)
                </span>

              </label>

              <label className="flex items-center gap-3">

                <input
                  type="radio"
                  checked={
                    values.scope ===
                    "unit"
                  }
                  onChange={() =>
                    update(
                      "scope",
                      "unit"
                    )
                  }
                />

                <span>
                  Specific Unit
                </span>

              </label>

            </div>
          </div>

          {values.scope === "unit" && (
            <>
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Unit *
                </label>

                <select
                  className="w-full rounded-lg border p-3"
                  value={values.unitId}
                  onChange={(e) =>
                    update(
                      "unitId",
                      e.target.value
                    )
                  }
                >
                  <option value="">
                    Select Unit
                  </option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Tenant
                </label>

                <input
                  className="w-full rounded-lg border bg-gray-100 p-3"
                  value="Will auto-fill"
                  readOnly
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Lease Status
                </label>

                <input
                  className="w-full rounded-lg border bg-gray-100 p-3"
                  value="Will auto-fill"
                  readOnly
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* CHARGE DETAILS */}

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-lg font-semibold">
          Charge Details
        </h2>

        <div className="grid gap-5 md:grid-cols-2">

          <div>
            <label className="mb-2 block text-sm font-medium">
              Charge Name *
            </label>

            <select
              className="w-full rounded-lg border p-3"
              value={values.chargeName}
              onChange={(e) =>
                update(
                  "chargeName",
                  e.target.value
                )
              }
              required
            >
              <option value="">
                Select Charge
              </option>

              {COMMON_CHARGES.map(
                (charge) => (
                  <option
                    key={charge}
                    value={charge}
                  >
                    {charge}
                  </option>
                )
              )}
            </select>

            {values.chargeName ===
              "Other" && (
              <input
                className="mt-3 w-full rounded-lg border p-3"
                placeholder="Enter custom charge name"
                value={
                  values.customChargeName
                }
                onChange={(e) =>
                  update(
                    "customChargeName",
                    e.target.value
                  )
                }
                required
              />
            )}
          </div>
                    <div>
            <label className="mb-2 block text-sm font-medium">
              Amount (KES) *
            </label>

            <input
              type="number"
              min="0"
              step="0.01"
              className="w-full rounded-lg border p-3"
              placeholder="0.00"
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
            <label className="mb-2 block text-sm font-medium">
              Billing Frequency *
            </label>

            <select
              className="w-full rounded-lg border p-3"
              value={values.billingFrequency}
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

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium">
              Description
            </label>

            <textarea
              rows={4}
              className="w-full rounded-lg border p-3"
              placeholder="Optional description..."
              value={values.description}
              onChange={(e) =>
                update(
                  "description",
                  e.target.value
                )
              }
            />
          </div>

        </div>
      </div>

      {/* BILLING SCHEDULE */}

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-lg font-semibold">
          Billing Schedule
        </h2>

        <div className="grid gap-5 md:grid-cols-2">

          <div>
            <label className="mb-2 block text-sm font-medium">
              Starts On *
            </label>

            <input
              type="date"
              className="w-full rounded-lg border p-3"
              value={values.startsOn}
              onChange={(e) =>
                update(
                  "startsOn",
                  e.target.value
                )
              }
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Ends On
            </label>

            <input
              type="date"
              className="w-full rounded-lg border p-3"
              value={values.endsOn}
              onChange={(e) =>
                update(
                  "endsOn",
                  e.target.value
                )
              }
            />
          </div>

        </div>
      </div>

      {/* SETTINGS */}

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-lg font-semibold">
          Settings
        </h2>

        <div className="space-y-4">

          <label className="flex items-center gap-3">

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

            <span>
              Mandatory Charge
            </span>

          </label>

          <label className="flex items-center gap-3">

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

            <span>
              Active
            </span>

          </label>

        </div>
      </div>
            <div className="flex items-center justify-end gap-3 pt-2">

        <button
          type="button"
          className="rounded-lg border border-gray-300 px-6 py-3 font-medium transition hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Saving..."
            : "Save Recurring Charge"}
        </button>

      </div>

    </form>
  );
}
