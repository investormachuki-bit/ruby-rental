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
