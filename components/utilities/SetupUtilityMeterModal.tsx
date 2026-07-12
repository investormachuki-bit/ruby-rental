"use client";

import { useState } from "react";
import { updateUtilityMeter } from "@/services/utilities/updateUtilityMeter";

type Props = {
  meter: any;
  onClose: () => void;
  onSaved: () => void;
};

export default function SetupUtilityMeterModal({
  meter,
  onClose,
  onSaved,
}: Props) {
  const [loading, setLoading] =
    useState(false);

  const [meterNumber, setMeterNumber] =
    useState(
      meter.meter_number ?? ""
    );

  const [
    openingReading,
    setOpeningReading,
  ] = useState(
    Number(
      meter.opening_reading ?? 0
    )
  );

  const [unitRate, setUnitRate] =
    useState(
      Number(
        meter.unit_rate ?? 0
      )
    );

  const [
    meterLocation,
    setMeterLocation,
  ] = useState(
    meter.meter_location ?? ""
  );

  const [notes, setNotes] =
    useState(
      meter.notes ?? ""
    );

  async function handleSave() {
    if (!meterNumber.trim()) {
      alert(
        "Meter number is required."
      );
      return;
    }

    try {
      setLoading(true);

      await updateUtilityMeter(
        meter.id,
        {
          meter_number:
            meterNumber.trim(),

          opening_reading:
            openingReading,

          unit_rate: unitRate,

          meter_location:
            meterLocation,

          notes,
        }
      );

      alert(
        `${meter.utility_type} meter activated successfully.`
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

      <div className="w-full max-w-xl rounded-2xl bg-white shadow-xl">

        <div className="border-b p-6">

          <h2 className="text-2xl font-bold">
            Setup {meter.utility_type} Meter
          </h2>

          <p className="mt-2 text-gray-500">
            Configure this meter before recording
            readings.
          </p>

        </div>

        <div className="space-y-5 p-6">
                    <div>

            <label className="mb-2 block font-medium">
              Meter Number
            </label>

            <input
              value={meterNumber}
              onChange={(e) =>
                setMeterNumber(
                  e.target.value
                )
              }
              placeholder="WM001245"
              className="w-full rounded-xl border p-3"
            />

          </div>

          <div className="grid grid-cols-2 gap-4">

            <div>

              <label className="mb-2 block font-medium">
                Opening Reading
              </label>

              <input
                type="number"
                value={openingReading}
                onChange={(e) =>
                  setOpeningReading(
                    Number(
                      e.target.value
                    )
                  )
                }
                className="w-full rounded-xl border p-3"
              />

            </div>

            <div>

              <label className="mb-2 block font-medium">
                Unit Rate
              </label>

              <input
                type="number"
                value={unitRate}
                onChange={(e) =>
                  setUnitRate(
                    Number(
                      e.target.value
                    )
                  )
                }
                className="w-full rounded-xl border p-3"
              />

            </div>

          </div>

          <div>

            <label className="mb-2 block font-medium">
              Meter Location
            </label>

            <input
              value={meterLocation}
              onChange={(e) =>
                setMeterLocation(
                  e.target.value
                )
              }
              placeholder="Outside Block A"
              className="w-full rounded-xl border p-3"
            />

          </div>

          <div>

            <label className="mb-2 block font-medium">
              Notes
            </label>

            <textarea
              rows={4}
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

          <div className="rounded-xl border bg-amber-50 p-4">

            <p className="font-medium text-amber-900">
              First Time Setup
            </p>

            <p className="mt-2 text-sm text-amber-700">
              The opening reading will be used as
              the previous reading for the very
              first meter reading. After that,
              Ruby Rental will automatically use
              the latest recorded reading.
            </p>

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
              ? "Activating..."
              : "Activate Meter"}
          </button>

        </div>

      </div>

    </div>
  );
}
