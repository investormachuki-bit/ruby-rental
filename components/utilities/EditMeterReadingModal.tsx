"use client";

import { useState } from "react";

import { updateMeterReading } from "@/services/utilities/updateMeterReading";

type Props = {
  reading: any;
  onClose: () => void;
  onSaved: () => void;
};

export default function EditMeterReadingModal({
  reading,
  onClose,
  onSaved,
}: Props) {
  const [loading, setLoading] =
    useState(false);

  const [
    currentReading,
    setCurrentReading,
  ] = useState(
    Number(
      reading.current_reading
    )
  );

  const [notes, setNotes] =
    useState(
      reading.notes ?? ""
    );

  const previousReading =
    Number(
      reading.previous_reading
    );

  const unitsUsed =
    currentReading -
    previousReading;

  const amount =
    unitsUsed *
    Number(reading.unit_rate);

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

      await updateMeterReading(
        reading.id,
        {
          current_reading:
            currentReading,

          notes,
        }
      );

      alert(
        "Reading updated successfully."
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

      <div className="max-h-[95vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-xl">

        <div className="border-b p-4 sm:p-6">

          <h2 className="text-2xl font-bold">
            Edit Meter Reading
          </h2>

          <p className="mt-2 text-gray-500">
            Update the recorded meter reading.
          </p>

        </div>

        <div className="space-y-5 p-4 sm:p-6">

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
                  Number(e.target.value)
                )
              }
              className="w-full rounded-xl border p-3"
            />

          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

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

              <h3 className="mt-2 break-words text-2xl font-bold text-green-700">
                KSh{" "}
                {(amount < 0
                  ? 0
                  : amount).toLocaleString()}
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

        <div className="flex flex-col-reverse gap-3 border-t p-4 sm:flex-row sm:justify-end sm:p-6">

          <button
            onClick={onClose}
            disabled={loading}
            className="w-full rounded-xl border px-6 py-3 sm:w-auto"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full rounded-xl bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800 disabled:opacity-50 sm:w-auto"
          >
            {loading
              ? "Saving..."
              : "Save Changes"}
          </button>

        </div>

      </div>

    </div>
  );
}
