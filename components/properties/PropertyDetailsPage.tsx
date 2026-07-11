"use client";

import { useEffect, useState } from "react";
import BulkUnitGenerator from "@/components/units/BulkUnitGenerator";
import { getPropertyDetails } from "@/services/properties/getPropertyDetails";
import { getPropertyUnitStats } from "@/services/units/getPropertyUnitStats";

type Props = {
  propertyId: string;
};

export default function PropertyDetailsPage({
  propertyId,
}: Props) {
  const [property, setProperty] = useState<any>(null);

  const [stats, setStats] = useState({
    totalUnits: 0,
    occupied: 0,
    vacant: 0,
    monthlyIncome: 0,
  });

  const [loading, setLoading] = useState(true);

  const [showBulkGenerator, setShowBulkGenerator] =
    useState(false);

  useEffect(() => {
    loadPage();
  }, []);

  async function loadPage() {
    try {
      const [propertyData, statsData] =
        await Promise.all([
          getPropertyDetails(propertyId),
          getPropertyUnitStats(propertyId),
        ]);

      setProperty(propertyData);
      setStats(statsData);
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

  return (
    <main className="space-y-8 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          {property.name}
        </h1>

        <p className="mt-1 text-gray-500">
          {property.property_type}
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-gray-500">
            Total Units
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {stats.totalUnits}
          </h2>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-gray-500">
            Occupied
          </p>

          <h2 className="mt-2 text-3xl font-bold text-green-600">
            {stats.occupied}
          </h2>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-gray-500">
            Vacant
          </p>

          <h2 className="mt-2 text-3xl font-bold text-orange-500">
            {stats.vacant}
          </h2>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-gray-500">
            Monthly Income
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            KSh{" "}
            {stats.monthlyIncome.toLocaleString()}
          </h2>
        </div>

      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-4">

        <button className="rounded-xl bg-black px-6 py-3 font-semibold text-white hover:bg-gray-800">
          + Add Unit
        </button>

        <button
          onClick={() =>
            setShowBulkGenerator(true)
          }
          className="rounded-xl border px-6 py-3 font-semibold hover:bg-gray-100"
        >
          ⚡ Bulk Generate Units
        </button>

      </div>

      {/* Recent Activity */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">
          Recent Activity
        </h2>

        <p className="mt-3 text-gray-500">
          No activity yet.
        </p>
      </div>

      {/* Bulk Generator Modal */}
      {showBulkGenerator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">

            <h2 className="mb-5 text-2xl font-bold">
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
    </main>
  );
}
