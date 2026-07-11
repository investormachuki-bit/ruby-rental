"use client";

import { useEffect, useState } from "react";
import Breadcrumb from "@/components/common/Breadcrumb";
import { getUnit } from "@/services/units/getUnit";

type Props = {
  unitId: string;
};

export default function UnitDetailsPage({
  unitId,
}: Props) {
  const [unit, setUnit] = useState<any>(null);

  useEffect(() => {
    loadUnit();
  }, []);

  async function loadUnit() {
    const data = await getUnit(unitId);
    setUnit(data);
  }

  if (!unit) {
    return (
      <div className="p-8">
        Loading...
      </div>
    );
  }

  return (
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
            label: unit.property.name,
            href: `/properties/${unit.property.id}`,
          },
          {
            label: unit.unit_number,
          },
        ]}
      />

      <div>

        <h1 className="text-4xl font-bold">
          {unit.unit_number}
        </h1>

        <p className="text-lg text-gray-500">
          {unit.floor_name}
        </p>

      </div>

      <div className="grid gap-4 md:grid-cols-2">

        <div className="rounded-xl border bg-white p-6">

          <h2 className="mb-4 text-xl font-semibold">
            Unit Information
          </h2>

          <div className="space-y-3">

            <div className="flex justify-between">
              <span>Status</span>
              <strong>{unit.status}</strong>
            </div>

            <div className="flex justify-between">
              <span>Monthly Rent</span>
              <strong>
                KSh{" "}
                {Number(
                  unit.monthly_rent
                ).toLocaleString()}
              </strong>
            </div>

            <div className="flex justify-between">
              <span>Deposit</span>
              <strong>
                KSh{" "}
                {Number(
                  unit.deposit
                ).toLocaleString()}
              </strong>
            </div>

            <div className="flex justify-between">
              <span>Water</span>
              <strong>
                {unit.water_type}
              </strong>
            </div>

            <div className="flex justify-between">
              <span>Electricity</span>
              <strong>
                {unit.electricity_type}
              </strong>
            </div>

          </div>

        </div>

        <div className="rounded-xl border bg-white p-6">

          <h2 className="mb-4 text-xl font-semibold">
            Actions
          </h2>

          <div className="space-y-3">

            <button className="w-full rounded-xl bg-black py-3 font-semibold text-white">
              👤 Assign Occupant
            </button>

            <button className="w-full rounded-xl border py-3 font-semibold">
              ✏ Edit Unit
            </button>

          </div>

        </div>

      </div>

    </main>
  );
}
