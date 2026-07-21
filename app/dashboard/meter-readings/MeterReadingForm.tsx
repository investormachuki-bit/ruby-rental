"use client";

import { useEffect, useMemo, useState } from "react";

import { getProperties } from "@/services/properties";
import { getUnits } from "@/services/units";

import { createMeterReading } from "@/services/meterReadings/createMeterReading";
import { updateMeterReading } from "@/services/meterReadings/updateMeterReading";
import { getLatestReading } from "@/services/meterReadings/getLatestReading";

type Props = {
  reading?: any | null;
  onSuccess: () => void;
  onCancel: () => void;
};

export default function MeterReadingForm({
  reading,
  onSuccess,
  onCancel,
}: Props) {

  const isEditing = !!reading;

  const [saving, setSaving] =
    useState(false);

  const [properties, setProperties] =
    useState<any[]>([]);

  const [units, setUnits] =
    useState<any[]>([]);

  const [propertyId, setPropertyId] =
    useState(reading?.property_id ?? "");

  const [unitId, setUnitId] =
    useState(reading?.unit_id ?? "");

  const [meterType, setMeterType] =
    useState<"Water" | "Electricity">(
      reading?.meter_type ?? "Water"
    );

  const [billingPeriod, setBillingPeriod] =
    useState(
      reading?.billing_period ?? ""
    );

  const [readingDate, setReadingDate] =
    useState(
      reading?.reading_date ??
      new Date().toISOString().split("T")[0]
    );

  const [previousReading, setPreviousReading] =
    useState(
      reading?.previous_reading ?? 0
    );

  const [currentReading, setCurrentReading] =
    useState(
      reading?.current_reading ?? 0
    );

  const [ratePerUnit, setRatePerUnit] =
    useState(
      reading?.rate_per_unit ?? 0
    );

  useEffect(() => {

    async function loadData() {

      try {

        const [
          propertiesData,
          unitsData,
        ] = await Promise.all([
          getProperties(),
          getUnits(),
        ]);

        setProperties(
          propertiesData ?? []
        );

        setUnits(
          unitsData ?? []
        );

      } catch (error) {

        console.error(error);

      }

    }

    loadData();

  }, []);

  const filteredUnits =
    useMemo(() => {

      if (!propertyId) {
        return [];
      }

      return units.filter(
        (unit) =>
          unit.property_id === propertyId
      );

    }, [
      units,
      propertyId,
    ]);

  useEffect(() => {

    async function loadPreviousReading() {

      if (
        isEditing ||
        !unitId
      ) {
        return;
      }

      try {

        const latest =
          await getLatestReading(
            unitId,
            meterType
          );

        setPreviousReading(
          latest?.current_reading ?? 0
        );

      } catch (error) {

        console.error(error);

      }

    }

    loadPreviousReading();

  }, [
    unitId,
    meterType,
    isEditing,
  ]);

  const unitsConsumed =
    useMemo(() => {

      const consumed =
        currentReading -
        previousReading;

      return consumed > 0
        ? consumed
        : 0;

    }, [
      currentReading,
      previousReading,
    ]);

  const amount =
    useMemo(() => {

      return (
        unitsConsumed *
        ratePerUnit
      );

    }, [
      unitsConsumed,
      ratePerUnit,
    ]);
    async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {

    e.preventDefault();

    if (!propertyId) {
      alert("Please select a property.");
      return;
    }

    if (!unitId) {
      alert("Please select a unit.");
      return;
    }

    if (currentReading < previousReading) {
      alert(
        "Current reading cannot be less than the previous reading."
      );
      return;
    }

    if (ratePerUnit <= 0) {
      alert(
        "Rate per unit must be greater than zero."
      );
      return;
    }

    try {

      setSaving(true);

      if (isEditing) {

        await updateMeterReading({

          id: reading.id,

          current_reading: currentReading,

          rate_per_unit: ratePerUnit,

          reading_date: readingDate,

        });

      } else {

        await createMeterReading({

          property_id: propertyId,

          unit_id: unitId,

          meter_type: meterType,

          previous_reading: previousReading,

          current_reading: currentReading,

          rate_per_unit: ratePerUnit,

          reading_date: readingDate,

          billing_period: billingPeriod,

        });

      }

      onSuccess();

    } catch (error) {

      console.error(error);

      alert(
        "Unable to save meter reading."
      );

    } finally {

      setSaving(false);

    }

  }

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-xl">

        <div className="border-b p-6">

          <h2 className="text-2xl font-bold">

            {isEditing
              ? "Edit Meter Reading"
              : "New Meter Reading"}

          </h2>

          <p className="mt-1 text-gray-500">

            Record water and electricity meter readings.

          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 p-6"
        >

          <div className="grid gap-5 md:grid-cols-2">

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
                disabled={isEditing}
                required
              >

                <option value="">
                  Select Property
                </option>

                {properties.map((property) => (

                  <option
                    key={property.id}
                    value={property.id}
                  >

                    {property.name}

                  </option>

                ))}

              </select>

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium">
                Unit
              </label>

              <select
                className="w-full rounded-xl border p-3"
                value={unitId}
                onChange={(e) =>
                  setUnitId(e.target.value)
                }
                disabled={!propertyId || isEditing}
                required
              >

                <option value="">
                  Select Unit
                </option>

                {filteredUnits.map((unit) => (

                  <option
                    key={unit.id}
                    value={unit.id}
                  >

                    {unit.unit_number}

                  </option>

                ))}

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
                Rate Per Unit (KSh)
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

          <div className="grid gap-5 rounded-xl bg-gray-50 p-5 md:grid-cols-2">

            <div>

              <label className="mb-2 block text-sm font-medium">
                Previous Reading
              </label>

              <input
                type="number"
                className="w-full rounded-xl border bg-gray-100 p-3"
                value={previousReading}
                readOnly
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium">
                Current Reading
              </label>

              <input
                type="number"
                className="w-full rounded-xl border p-3"
                value={currentReading}
                onChange={(e) =>
                  setCurrentReading(
                    Number(e.target.value)
                  )
                }
                required
              />

            </div>

          </div>

          <div className="grid gap-4 rounded-xl bg-blue-50 p-5 md:grid-cols-2">

            <div>

              <p className="text-sm text-gray-500">
                Units Consumed
              </p>

              <p className="mt-2 text-3xl font-bold text-blue-700">

                {unitsConsumed.toLocaleString()}

              </p>

            </div>

            <div>

              <p className="text-sm text-gray-500">
                Estimated Amount
              </p>

              <p className="mt-2 text-3xl font-bold text-green-700">

                KSh {amount.toLocaleString()}

              </p>

            </div>

          </div>
                    <div className="flex justify-end gap-3 border-t pt-6">

            <button
              type="button"
              onClick={onCancel}
              disabled={saving}
              className="rounded-xl border border-gray-300 px-6 py-3 font-medium hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : isEditing
                ? "Update Reading"
                : "Save Reading"}
            </button>

          </div>

        </form>

      </div>

    </div>

  );

}
          
