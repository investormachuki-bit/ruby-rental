"use client";

import { useState } from "react";

import { createUtilityMeter } from "@/services/utilities/createUtilityMeter";

type Props = {
  workspaceId: string;
  propertyId: string;
  unitId: string;
  onClose: () => void;
  onSaved: () => void;
};

export default function CreateUtilityMeterModal({
  workspaceId,
  propertyId,
  unitId,
  onClose,
  onSaved,
}: Props) {

  const [loading, setLoading] =
    useState(false);

  const [utilityType, setUtilityType] =
    useState("Water");

  const [meterNumber, setMeterNumber] =
    useState("");

  const [openingReading, setOpeningReading] =
    useState(0);

  const [unitRate, setUnitRate] =
    useState(0);

  const [meterLocation, setMeterLocation] =
    useState("");

  const [notes, setNotes] =
    useState("");

  async function handleSave() {

    if (!meterNumber.trim()) {

      alert("Meter number is required.");

      return;

    }

    try {

      setLoading(true);

      await createUtilityMeter({

        workspace_id: workspaceId,

        property_id: propertyId,

        unit_id: unitId,

        utility_type: utilityType,

        meter_number: meterNumber.trim(),

        opening_reading: openingReading,

        unit_rate: unitRate,

        meter_location: meterLocation,

        notes,

      });

      alert("Utility meter created successfully.");

      onSaved();

    } catch (error: any) {

      alert(error.message);

    } finally {

      setLoading(false);

    }

  }

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">

      <div className="max-h-[95vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-xl">

        <div className="border-b p-6">

          <h2 className="text-2xl font-bold">

            Add Utility Meter

          </h2>

          <p className="mt-2 text-gray-500">

            Register a new utility meter for this unit.

          </p>

        </div>

        <div className="space-y-5 p-6">

          <div>

            <label className="mb-2 block font-medium">

              Utility Type

            </label>

            <select
              value={utilityType}
              onChange={(e) =>
                setUtilityType(e.target.value)
              }
              className="w-full rounded-xl border p-3"
            >

              <option>Water</option>

              <option>Electricity</option>

              <option>Gas</option>

              <option>Internet</option>

            </select>

          </div>

          <div>

            <label className="mb-2 block font-medium">

              Meter Number

            </label>

            <input
              value={meterNumber}
              onChange={(e) =>
                setMeterNumber(e.target.value)
              }
              className="w-full rounded-xl border p-3"
              placeholder="WM0001"
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
                    Number(e.target.value)
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
                    Number(e.target.value)
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
              className="w-full rounded-xl border p-3"
              placeholder="Outside Block A"
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
                setNotes(e.target.value)
              }
              className="w-full rounded-xl border p-3"
            />

          </div>

        </div>

        <div className="flex flex-col-reverse gap-3 border-t p-6 sm:flex-row sm:justify-end">

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
              : "Create Meter"}

          </button>

        </div>

      </div>

    </div>

  );

}
