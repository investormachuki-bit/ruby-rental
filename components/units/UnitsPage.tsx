"use client";

import { useEffect, useState } from "react";

import Breadcrumb from "@/components/common/Breadcrumb";
import UnitsList from "@/components/units/UnitsList";

import { getUnits } from "@/services/units/getUnits";

import { Unit } from "@/types/unit";

export default function UnitsPage() {
  const [loading, setLoading] =
    useState(true);

  const [units, setUnits] =
    useState<Unit[]>([]);

  useEffect(() => {
    loadUnits();
  }, []);

  async function loadUnits() {
    try {
      setLoading(true);

      const data = await getUnits();

      setUnits(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="space-y-6">

      <Breadcrumb
        items={[
          {
            label: "Dashboard",
            href: "/",
          },
          {
            label: "Units",
          },
        ]}
      />

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-4xl font-bold">
            Units
          </h1>

          <p className="mt-2 text-gray-500">
            View and manage all rental units.
          </p>

        </div>

        <div className="rounded-xl border bg-white px-5 py-4 shadow-sm">

          <p className="text-sm text-gray-500">
            Total Units
          </p>

          <h2 className="text-2xl font-bold">
            {units.length}
          </h2>

        </div>

      </div>

      {loading ? (

        <div className="rounded-xl border bg-white p-10 text-center">

          Loading units...

        </div>

      ) : (

        <UnitsList
          units={units}
        />

      )}

    </main>
  );
}
