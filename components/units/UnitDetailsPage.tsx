"use client";

import { useEffect, useState } from "react";
import Breadcrumb from "@/components/common/Breadcrumb";
import EditUnitModal from "@/components/units/EditUnitModal";
import { getUnit } from "@/services/units/getUnit";
import { Unit } from "@/types/unit";

type Props = {
  unitId: string;
};

export default function UnitDetailsPage({
  unitId,
}: Props) {
  const [unit, setUnit] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
    loadUnit();
  }, []);

  async function loadUnit() {
    try {
      setLoading(true);

      const data = await getUnit(unitId);

      setUnit(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        Loading...
      </div>
    );
  }

  if (!unit) {
    return (
      <div className="p-8">
        Unit not found.
      </div>
    );
  }

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

          <p className="mt-2 text-lg text-gray-500">
            {unit.floor_name}
          </p>

        </div>

        <div className="grid gap-6 lg:grid-cols-2">

          <div className="rounded-2xl border bg-white p-6 shadow-sm">

            <h2 className="mb-5 text-xl font-semibold">
              Unit Information
            </h2>

            <div className="space-y-4">

              <Info
                label="Status"
                value={unit.status}
              />

              <Info
                label="Monthly Rent"
                value={`KSh ${Number(
                  unit.monthly_rent
                ).toLocaleString()}`}
              />

              <Info
                label="Deposit"
                value={`KSh ${Number(
                  unit.deposit
                ).toLocaleString()}`}
              />

              <Info
                label="Water"
                value={unit.water_type}
              />

              <Info
                label="Electricity"
                value={unit.electricity_type}
              />

              <Info
                label="Garbage Fee"
                value={`KSh ${Number(
                  unit.garbage_fee
                ).toLocaleString()}`}
              />

              <Info
                label="Parking Fee"
                value={`KSh ${Number(
                  unit.parking_fee
                ).toLocaleString()}`}
              />

              <Info
                label="Internet Fee"
                value={`KSh ${Number(
                  unit.internet_fee
                ).toLocaleString()}`}
              />

              <Info
                label="Service Charge"
                value={`KSh ${Number(
                  unit.service_charge
                ).toLocaleString()}`}
              />

            </div>

          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">

            <h2 className="mb-5 text-xl font-semibold">
              Actions
            </h2>

            <div className="space-y-3">

              <button className="w-full rounded-xl bg-black py-3 font-semibold text-white">
                👤 Assign Occupant
              </button>

              <button
                onClick={() =>
                  setShowEdit(true)
                }
                className="w-full rounded-xl border py-3 font-semibold hover:bg-gray-100"
              >
                ✏ Edit Unit
              </button>

            </div>

          </div>

        </div>

      </main>

      {showEdit && (
        <EditUnitModal
          unit={unit as Unit}
          onClose={() =>
            setShowEdit(false)
          }
          onSaved={() => {
            setShowEdit(false);
            loadUnit();
          }}
        />
      )}
    </>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex justify-between border-b pb-3">

      <span className="text-gray-500">
        {label}
      </span>

      <strong>{value}</strong>

    </div>
  );
}
