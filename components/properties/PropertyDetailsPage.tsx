"use client";

import { useEffect, useState } from "react";

import Breadcrumb from "@/components/common/Breadcrumb";
import KpiCard from "@/components/common/KpiCard";
import BulkUnitGenerator from "@/components/units/BulkUnitGenerator";
import UnitsList from "@/components/units/UnitsList";

import { Property } from "@/types/property";
import { Unit } from "@/types/unit";

import { getPropertyDetails } from "@/services/properties/getPropertyDetails";
import { getPropertyUnitStats } from "@/services/units/getPropertyUnitStats";
import { getPropertyUnits } from "@/services/units/getPropertyUnits";

type Props = {
  propertyId: string;
};

export default function PropertyDetailsPage({
  propertyId,
}: Props) {
  const [property, setProperty] =
    useState<Property | null>(null);

  const [units, setUnits] =
    useState<Unit[]>([]);

  const [stats, setStats] = useState({
    totalUnits: 0,
    occupied: 0,
    vacant: 0,
    monthlyIncome: 0,
  });

  const [loading, setLoading] =
    useState(true);

  const [showBulkGenerator, setShowBulkGenerator] =
    useState(false);

  useEffect(() => {
    loadPage();
  }, []);

  async function loadPage() {
    try {
      setLoading(true);

      const [
        propertyData,
        statsData,
        unitsData,
      ] = await Promise.all([
        getPropertyDetails(propertyId),
        getPropertyUnitStats(propertyId),
        getPropertyUnits(propertyId),
      ]);

      setProperty(propertyData);
      setStats(statsData);
      setUnits(unitsData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        Loading property...
      </div>
    );
  }

  if (!property) {
    return (
      <div className="p-8">
        Property not found.
      </div>
    );
  }

  const occupancy =
    stats.totalUnits === 0
      ? 0
      : Math.round(
          (stats.occupied /
            stats.totalUnits) *
            100
        );

  return (
    <>
      <main className="space-y-8 p-6">

        <Breadcrumb
          items={[
            {
              label: "Dashboard",
              href: "/",
            },
            {
              label: "Properties",
              href: "/properties",
            },
            {
              label: property.name,
            },
          ]}
        />

        {/* Header */}

        <div>

          <h1 className="text-4xl font-bold">
            {property.name}
          </h1>

          <p className="mt-2 text-lg text-gray-500">
            {property.property_type}
          </p>

        </div>

        {/* KPI Cards */}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

          <KpiCard
            title="Total Units"
            value={stats.totalUnits}
            icon="🏠"
            color="blue"
          />

          <KpiCard
            title="Occupied"
            value={stats.occupied}
            icon="👥"
            color="green"
          />

          <KpiCard
            title="Vacant"
            value={stats.vacant}
            icon="🚪"
            color="orange"
          />

          <KpiCard
            title="Expected Monthly Rent"
            value={`KSh ${stats.monthlyIncome.toLocaleString()}`}
            icon="💰"
            color="purple"
          />

        </div>

        {/* Occupancy */}

        <div className="rounded-2xl border bg-white p-6 shadow-sm">

          <div className="mb-4 flex items-center justify-between">

            <h2 className="text-xl font-semibold">
              Occupancy
            </h2>

            <span className="text-lg font-bold">
              {occupancy}%
            </span>

          </div>

          <div className="h-3 overflow-hidden rounded-full bg-gray-200">

            <div
              className="h-full rounded-full bg-green-500 transition-all"
              style={{
                width: `${occupancy}%`,
              }}
            />

          </div>

          <div className="mt-4 flex justify-between text-sm text-gray-600">

            <span>
              {stats.occupied} Occupied
            </span>

            <span>
              {stats.vacant} Vacant
            </span>

          </div>

        </div>

        {/* Actions */}

        <div className="flex flex-wrap gap-4">

          <button className="rounded-xl bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800">
            + Add Unit
          </button>

          <button
            onClick={() =>
              setShowBulkGenerator(true)
            }
            className="rounded-xl border px-6 py-3 font-semibold transition hover:bg-gray-100"
          >
            ⚡ Bulk Generate Units
          </button>

        </div>

        {/* Units */}

        <UnitsList units={units} />

      </main>

      {/* Bulk Generator */}

      {showBulkGenerator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">

            <h2 className="mb-6 text-2xl font-bold">
              Bulk Generate Units
            </h2>

            <BulkUnitGenerator
              propertyId={propertyId}
              onSuccess={() => {
                setShowBulkGenerator(false);
                loadPage();
              }}
              onCancel={() =>
                setShowBulkGenerator(false)
              }
            />

          </div>

        </div>
      )}

    </>
  );
}
