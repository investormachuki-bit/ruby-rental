"use client";

import { useEffect, useState } from "react";

import { saveMeterReading } from "@/services/utilities/saveMeterReading";
import { getLatestReading } from "@/services/utilities/getLatestReading";

type Props = {
  meter: any;

  workspaceId: string;
  propertyId: string;
  unitId: string;

  utilityType: "Water" | "Electricity";

  unitRate: number;

  onClose: () => void;
  onSaved: () => void;
};

export default function MeterReadingModal({
  meter,

  workspaceId,
  propertyId,
  unitId,

  utilityType,

  unitRate,

  onClose,
  onSaved,
}: Props) {
  const [loading, setLoading] =
    useState(false);

  const [
    previousReading,
    setPreviousReading,
  ] = useState(0);

  const [
    currentReading,
    setCurrentReading,
  ] = useState(0);

  const [readingDate, setReadingDate] =
    useState(
      new Date()
        .toISOString()
        .split("T")[0]
    );

  const [notes, setNotes] =
    useState("");

  useEffect(() => {
    loadPreviousReading();
  }, []);

  async function loadPreviousReading() {
    const latest =
      await getLatestReading(
        unitId,
        utilityType
      );

    // Existing readings
    if (latest) {
      const last =
        Number(
          latest.current_reading
        );

      setPreviousReading(last);

      setCurrentReading(last);

      return;
    }

    // First reading
    const opening =
      Number(
        meter.opening_reading ?? 0
      );

    setPreviousReading(opening);

    setCurrentReading(opening);
  }

  const unitsUsed =
    currentReading -
    previousReading;

  const amount =
    unitsUsed * unitRate;

  async function handleSave() {
    if (
      currentReading <
      previousReading
    ) {
      alert(
        "Current reading cannot be less than the previous reading."
      );

      return;
    }

    try {
      setLoading(true);

      await saveMeterReading({
        meter_id: meter.id,

        workspace_id:
          workspaceId,

        property_id:
          propertyId,

        unit_id: unitId,

        utility_type:
          utilityType,

        current_reading:
          currentReading,

        reading_date:
          readingDate,

        unit_rate:
          unitRate,

        notes,
      });

      alert(
        `${utilityType} reading saved successfully.`
      );

      onSaved();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">

      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">

        <div className="border-b p-6">

          <h2 className="text-2xl font-bold">
            Record {utilityType} Reading
          </h2>

          <p className="mt-2 text-gray-500">
            Meter Number:
            {" "}
            <strong>
              {meter.meter_number ||
                "Not Assigned"}
            </strong>
          </p>

        </div>

        <div className="space-y-5 p-6">
                    {!meter.latest_reading && (
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">

              <p className="font-medium text-blue-900">
                Initial Meter Reading
              </p>

              <p className="mt-2 text-sm text-blue-700">
                No previous readings were found.
                The opening reading configured for
                this meter will be used as the
                starting point.
              </p>

            </div>
          )}

          <div>

            <label className="mb-2 block font-medium">
              Reading Date
            </label>

            <input
              type="date"
              value={readingDate}
              onChange={(e) =>
                setReadingDate(
                  e.target.value
                )
              }
              className="w-full rounded-xl border p-3"
            />

          </div>

          <div className="grid grid-cols-2 gap-4">

            <div>

              <label className="mb-2 block font-medium">
                Previous Reading
              </label>

              <input
                readOnly
                value={previousReading}
                className="w-full rounded-xl border bg-gray-100 p-3"
              />

            </div>

            <div>

              <label className="mb-2 block font-medium">
                Current Reading
              </label>

              <input
                type="number"
                value={currentReading}
                onChange={(e) =>
                  setCurrentReading(
                    Number(
                      e.target.value
                    )
                  )
                }
                className="w-full rounded-xl border p-3"
              />

            </div>

          </div>

          <div className="grid grid-cols-2 gap-4">

            <div className="rounded-xl bg-gray-50 p-4">

              <p className="text-sm text-gray-500">
                Units Used
              </p>

              <h3 className="mt-2 text-2xl font-bold">
                {unitsUsed < 0
                  ? 0
                  : unitsUsed}
              </h3>

            </div>

            <div className="rounded-xl bg-green-50 p-4">

              <p className="text-sm text-gray-500">
                Amount
              </p>

              <h3 className="mt-2 text-2xl font-bold text-green-700">
                KSh{" "}
                {amount < 0
                  ? "0"
                  : amount.toLocaleString()}
              </h3>

            </div>

          </div>

          <div>

            <label className="mb-2 block font-medium">
              Notes
            </label>

            <textarea
              rows={3}
              value={notes}
              onChange={(e) =>
                setNotes(
                  e.target.value
                )
              }
              placeholder="Optional notes..."
              className="w-full rounded-xl border p-3"
            />

          </div>

        </div>

        <div className="flex justify-end gap-3 border-t p-6">

          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border px-6 py-3"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            className="rounded-xl bg-black px-6 py-3 font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {loading
              ? "Saving..."
              : "Save Reading"}
          </button>

        </div>

      </div>

    </div>
  );
}
