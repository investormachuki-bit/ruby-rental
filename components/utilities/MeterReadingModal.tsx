"use client";

import { useEffect, useState } from "react";
import { saveMeterReading } from "@/services/utilities/saveMeterReading";
import { getLatestReading } from "@/services/utilities/getLatestReading";

type Props = {
  workspaceId: string;
  propertyId: string;
  unitId: string;

  utilityType: "Water" | "Electricity";

  unitRate: number;

  onClose: () => void;
  onSaved: () => void;
};

export default function MeterReadingModal({
  workspaceId,
  propertyId,
  unitId,
  utilityType,
  unitRate,
  onClose,
  onSaved,
}: Props) {
  const [loading, setLoading] = useState(false);

  const [previousReading, setPreviousReading] =
    useState(0);

  const [currentReading, setCurrentReading] =
    useState(0);

  useEffect(() => {
    loadPreviousReading();
  }, []);

  async function loadPreviousReading() {
    const latest =
      await getLatestReading(
        unitId,
        utilityType
      );

    if (latest) {
      setPreviousReading(
        Number(latest.current_reading)
      );

      setCurrentReading(
        Number(latest.current_reading)
      );
    }
  }

  const unitsUsed =
    currentReading - previousReading;

  const amount =
    unitsUsed * unitRate;
    const [readingDate, setReadingDate] =
    useState(
      new Date().toISOString().split("T")[0]
    );

  const [notes, setNotes] =
    useState("");

  async function handleSave() {
    if (currentReading < previousReading) {
      alert(
        "Current reading cannot be less than the previous reading."
      );
      return;
    }

    try {
      setLoading(true);

      await saveMeterReading({
        workspace_id: workspaceId,
        property_id: propertyId,
        unit_id: unitId,

        utility_type: utilityType,

        current_reading: currentReading,

        reading_date: readingDate,

        unit_rate: unitRate,

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

          <p className="mt-1 text-gray-500">
            Enter the latest meter reading.
          </p>

        </div>

        <div className="space-y-5 p-6">

          <div>

            <label className="mb-2 block font-medium">
              Reading Date
            </label>

            <input
              type="date"
              value={readingDate}
              onChange={(e) =>
                setReadingDate(e.target.value)
              }
              className="w-full rounded-xl border p-3"
            />

          </div>

          <div>

            <label className="mb-2 block font-medium">
              Previous Reading
            </label>

            <input
              value={previousReading}
              readOnly
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
                  Number(e.target.value)
                )
              }
              className="w-full rounded-xl border p-3"
            />

          </div>

          <div className="grid grid-cols-2 gap-4">

            <div className="rounded-xl bg-gray-50 p-4">

              <p className="text-sm text-gray-500">
                Units Used
              </p>

              <h3 className="mt-2 text-2xl font-bold">
                {unitsUsed}
              </h3>

            </div>

            <div className="rounded-xl bg-green-50 p-4">

              <p className="text-sm text-gray-500">
                Amount
              </p>

              <h3 className="mt-2 text-2xl font-bold text-green-700">
                KSh{" "}
                {amount.toLocaleString()}
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
                setNotes(e.target.value)
              }
              className="w-full rounded-xl border p-3"
              placeholder="Optional notes..."
            />

          </div>

        </div>

        <div className="flex justify-end gap-3 border-t p-6">

          <button
            onClick={onClose}
            className="rounded-xl border px-6 py-3"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={handleSave}
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
