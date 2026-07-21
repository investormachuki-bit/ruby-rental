"use client";

import { useEffect, useState } from "react";

import MeterReadingTable from "./MeterReadingTable";
import MeterReadingForm from "./MeterReadingForm";
import MeterReadingDetails from "./MeterReadingDetails";
import BulkReadingDialog from "./BulkReadingDialog";

import {
  getMeterReadings,
  GetMeterReadingsFilters,
} from "@/services/meterReadings/getMeterReadings";

export default function MeterReadingsPage() {

  const [loading, setLoading] =
    useState(true);

  const [readings, setReadings] =
    useState<any[]>([]);

  const [selectedReading, setSelectedReading] =
    useState<any | null>(null);

  const [showForm, setShowForm] =
    useState(false);

  const [showDetails, setShowDetails] =
    useState(false);

  const [showBulkDialog, setShowBulkDialog] =
    useState(false);

  const [filters, setFilters] =
    useState<GetMeterReadingsFilters>({

      meter_type: "Water",

    });

  async function loadReadings() {

    try {

      setLoading(true);

      const data =
        await getMeterReadings(
          filters
        );

      setReadings(data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  }

  useEffect(() => {

    loadReadings();

  }, [filters]);

  function handleCreate() {

    setSelectedReading(null);

    setShowForm(true);

  }

  function handleEdit(
    reading: any
  ) {

    setSelectedReading(reading);

    setShowForm(true);

  }

  function handleView(
    reading: any
  ) {

    setSelectedReading(reading);

    setShowDetails(true);

  }

  async function handleSaved() {

    setShowForm(false);

    await loadReadings();

  }

  function handleBulkImport() {

    setShowBulkDialog(true);

  }

  return (

    <div className="space-y-6">

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>

          <h1 className="text-3xl font-bold">

            Meter Readings

          </h1>

          <p className="text-gray-500">

            Record and manage water and electricity meter readings.

          </p>

        </div>

        <div className="flex gap-3">

          <button
            onClick={handleBulkImport}
            className="rounded-xl border px-5 py-3 font-medium hover:bg-gray-100"
          >

            Bulk Reading

          </button>

          <button
            onClick={handleCreate}
            className="rounded-xl bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
          >

            Add Reading

          </button>

        </div>

      </div>

      <div className="rounded-2xl border bg-white p-4">

        <div className="grid gap-4 md:grid-cols-4">

          <select
            className="rounded-xl border p-3"
            value={filters.meter_type ?? ""}
            onChange={(e) =>
              setFilters({
                ...filters,
                meter_type: e.target.value as
                  | "Water"
                  | "Electricity",
              })
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

      </div>

      <MeterReadingTable
        readings={readings}
        loading={loading}
        onView={handleView}
        onEdit={handleEdit}
      />
            {showForm && (

        <MeterReadingForm
          reading={selectedReading}
          onSuccess={handleSaved}
          onCancel={() => {
            setShowForm(false);
            setSelectedReading(null);
          }}
        />

      )}

      {showDetails && selectedReading && (

        <MeterReadingDetails
          reading={selectedReading}
          onClose={() => {
            setShowDetails(false);
            setSelectedReading(null);
          }}
          onEdit={() => {
            setShowDetails(false);
            setShowForm(true);
          }}
        />

      )}

      {showBulkDialog && (

        <BulkReadingDialog
          onSuccess={async () => {

            setShowBulkDialog(false);

            await loadReadings();

          }}
          onCancel={() =>
            setShowBulkDialog(false)
          }
        />

      )}

    </div>

  );

}
