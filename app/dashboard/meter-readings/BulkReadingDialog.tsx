"use client";

import { useEffect, useState } from "react";

import { createMeterReading } from "@/services/meterReadings/createMeterReading";

type BulkRow = {
  unit_id: string;
  unit_name: string;
  previous_reading: number;
  current_reading: number;
};

type Props = {
  onSuccess: () => void;
  onCancel: () => void;
};

export default function BulkReadingDialog({
  onSuccess,
  onCancel,
}: Props) {

  const [saving, setSaving] =
    useState(false);

  const [propertyId, setPropertyId] =
    useState("");

  const [meterType, setMeterType] =
    useState<"Water" | "Electricity">(
      "Water"
    );

  const [billingPeriod, setBillingPeriod] =
    useState("");

  const [readingDate, setReadingDate] =
    useState(
      new Date().toISOString().split("T")[0]
    );

  const [ratePerUnit, setRatePerUnit] =
    useState(0);

  const [rows, setRows] =
    useState<BulkRow[]>([]);

  useEffect(() => {

    // TODO:
    // Load all units for selected property.
    // Populate previous readings using getLatestReading().

  }, [propertyId, meterType]);

  function updateCurrentReading(
    index: number,
    value: number
  ) {

    setRows((prev) =>
      prev.map((row, i) =>
        i === index
          ? {
              ...row,
              current_reading: value,
            }
          : row
      )
    );

  }

  async function handleSubmit(
    e: React.FormEvent
  ) {

    e.preventDefault();

    try {

      setSaving(true);

      for (const row of rows) {

        await createMeterReading({

  property_id: propertyId,

  unit_id: row.unit_id,

  meter_type: meterType,

  previous_reading:
    row.previous_reading,

  current_reading:
    row.current_reading,

  rate_per_unit:
    ratePerUnit,

  reading_date:
    readingDate,

  billing_period:
    billingPeriod,

});
      }

      onSuccess();

    } catch (error) {

      console.error(error);

      alert(
        "Failed to save meter readings."
      );

    } finally {

      setSaving(false);

    }

  }

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

      <div className="w-full max-w-6xl rounded-2xl bg-white shadow-xl">

        <div className="border-b p-6">

          <h2 className="text-2xl font-bold">

            Bulk Meter Readings

          </h2>

          <p className="mt-1 text-gray-500">

            Record readings for multiple units at once.

          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 p-6">
                    <div className="grid gap-4 md:grid-cols-5">

            <div>

              <label className="mb-2 block text-sm font-medium">
                Property
              </label>

              <select
                className="w-full rounded-xl border p-3"
                value={propertyId}
                onChange={(e) =>
                  setPropertyId(e.target.value)
                }
                required
              >
                <option value="">
                  Select Property
                </option>

                {/* TODO: Populate properties */}

              </select>

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium">
                Meter Type
              </label>

              <select
                className="w-full rounded-xl border p-3"
                value={meterType}
                onChange={(e) =>
                  setMeterType(
                    e.target.value as
                      | "Water"
                      | "Electricity"
                  )
                }
              >
                <option value="Water">
                  Water
                </option>

                <option value="Electricity">
                  Electricity
                </option>

              </select>

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium">
                Billing Period
              </label>

              <input
                type="month"
                className="w-full rounded-xl border p-3"
                value={billingPeriod}
                onChange={(e) =>
                  setBillingPeriod(
                    e.target.value
                  )
                }
                required
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium">
                Reading Date
              </label>

              <input
                type="date"
                className="w-full rounded-xl border p-3"
                value={readingDate}
                onChange={(e) =>
                  setReadingDate(
                    e.target.value
                  )
                }
                required
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium">
                Rate / Unit
              </label>

              <input
                type="number"
                step="0.01"
                className="w-full rounded-xl border p-3"
                value={ratePerUnit}
                onChange={(e) =>
                  setRatePerUnit(
                    Number(e.target.value)
                  )
                }
                required
              />

            </div>

          </div>

          <div className="overflow-hidden rounded-xl border">

            <div className="overflow-x-auto">

              <table className="min-w-full">

                <thead className="bg-gray-100">

                  <tr>

                    <th className="px-4 py-3 text-left">
                      Unit
                    </th>

                    <th className="px-4 py-3 text-right">
                      Previous Reading
                    </th>

                    <th className="px-4 py-3 text-right">
                      Current Reading
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {rows.length === 0 ? (

                    <tr>

                      <td
                        colSpan={3}
                        className="px-6 py-10 text-center text-gray-500"
                      >
                        Select a property to load its units.
                      </td>

                    </tr>

                  ) : (

                    rows.map((row, index) => (

                      <tr
                        key={row.unit_id}
                        className="border-t"
                      >

                        <td className="px-4 py-3">

                          {row.unit_name}

                        </td>

                        <td className="px-4 py-3 text-right">

                          {row.previous_reading}

                        </td>

                        <td className="px-4 py-3">

                          <input
                            type="number"
                            className="w-full rounded-lg border p-2 text-right"
                            value={
                              row.current_reading
                            }
                            onChange={(e) =>
                              updateCurrentReading(
                                index,
                                Number(
                                  e.target.value
                                )
                              )
                            }
                            required
                          />

                        </td>

                      </tr>

                    ))

                  )}

                </tbody>

              </table>

            </div>

          </div>

          <div className="flex justify-end gap-3 border-t pt-6">

            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl border px-6 py-3"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                saving ||
                rows.length === 0
              }
              className="rounded-xl bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : `Save ${rows.length} Readings`}
            </button>

          </div>

        </form>

      </div>

    </div>

  );

}
