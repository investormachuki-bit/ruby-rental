"use client";

import { useEffect, useState } from "react";

import Breadcrumb from "@/components/common/Breadcrumb";
import EditUnitModal from "@/components/units/EditUnitModal";
import MeterReadingModal from "@/components/utilities/MeterReadingModal";

import { getUnit } from "@/services/units/getUnit";
import { getLatestReading } from "@/services/utilities/getLatestReading";

import { Unit } from "@/types/unit";

type Props = {
  unitId: string;
};

export default function UnitDetailsPage({
  unitId,
}: Props) {
  const [unit, setUnit] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  const [showEdit, setShowEdit] =
    useState(false);

  const [
    showWaterModal,
    setShowWaterModal,
  ] = useState(false);

  const [
    showElectricityModal,
    setShowElectricityModal,
  ] = useState(false);

  const [latestWater, setLatestWater] =
    useState<any>(null);

  const [
    latestElectricity,
    setLatestElectricity,
  ] = useState<any>(null);

  useEffect(() => {
    loadUnit();
  }, []);

  async function loadUnit() {
    try {
      setLoading(true);

      const data = await getUnit(unitId);

      setUnit(data);

      const water =
        await getLatestReading(
          unitId,
          "Water"
        );

      const electricity =
        await getLatestReading(
          unitId,
          "Electricity"
        );

      setLatestWater(water);
      setLatestElectricity(
        electricity
      );
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

          {/* Unit Information */}

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
                label="Water Type"
                value={unit.water_type}
              />

              <Info
                label="Water Rate"
                value={`KSh ${Number(
                  unit.water_amount
                ).toLocaleString()}`}
              />

              <Info
                label="Electricity Type"
                value={
                  unit.electricity_type
                }
              />

              <Info
                label="Electricity Rate"
                value={`KSh ${Number(
                  unit.electricity_amount
                ).toLocaleString()}`}
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

          {/* Utilities */}

          <div className="rounded-2xl border bg-white p-6 shadow-sm">

            <h2 className="mb-6 text-xl font-semibold">
              Utilities
            </h2>

            {/* Water */}

            <div className="mb-8">

              <div className="flex items-center justify-between">

                <div>

                  <h3 className="font-semibold">
                    🚰 Water
                  </h3>

                  <p className="text-sm text-gray-500">
                    {unit.water_type}
                  </p>

                </div>

                <button
                  onClick={() =>
                    setShowWaterModal(
                      true
                    )
                  }
                  className="rounded-lg bg-black px-4 py-2 text-white"
                >
                  Record Reading
                </button>

              </div>

              <div className="mt-4 grid grid-cols-3 gap-3">

                <div className="rounded-lg bg-gray-50 p-3">

                  <p className="text-xs text-gray-500">
                    Rate
                  </p>

                  <strong>
                    KSh {unit.water_amount}
                  </strong>

                </div>

                <div className="rounded-lg bg-gray-50 p-3">

                  <p className="text-xs text-gray-500">
                    Last Reading
                  </p>

                  <strong>
                    {latestWater?.current_reading ??
                      0}
                  </strong>

                </div>

                <div className="rounded-lg bg-gray-50 p-3">

                  <p className="text-xs text-gray-500">
                    Last Bill
                  </p>

                  <strong>
                    KSh{" "}
                    {Number(
                      latestWater?.amount ??
                        0
                    ).toLocaleString()}
                  </strong>

                </div>

              </div>

            </div>
                        {/* Electricity */}

            <div>

              <div className="flex items-center justify-between">

                <div>

                  <h3 className="font-semibold">
                    ⚡ Electricity
                  </h3>

                  <p className="text-sm text-gray-500">
                    {unit.electricity_type}
                  </p>

                </div>

                <button
                  onClick={() =>
                    setShowElectricityModal(
                      true
                    )
                  }
                  className="rounded-lg bg-black px-4 py-2 text-white"
                >
                  Record Reading
                </button>

              </div>

              <div className="mt-4 grid grid-cols-3 gap-3">

                <div className="rounded-lg bg-gray-50 p-3">

                  <p className="text-xs text-gray-500">
                    Rate
                  </p>

                  <strong>
                    KSh{" "}
                    {unit.electricity_amount}
                  </strong>

                </div>

                <div className="rounded-lg bg-gray-50 p-3">

                  <p className="text-xs text-gray-500">
                    Last Reading
                  </p>

                  <strong>
                    {latestElectricity?.current_reading ??
                      0}
                  </strong>

                </div>

                <div className="rounded-lg bg-gray-50 p-3">

                  <p className="text-xs text-gray-500">
                    Last Bill
                  </p>

                  <strong>
                    KSh{" "}
                    {Number(
                      latestElectricity?.amount ??
                        0
                    ).toLocaleString()}
                  </strong>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* Actions */}

        <div className="rounded-2xl border bg-white p-6 shadow-sm">

          <h2 className="mb-5 text-xl font-semibold">
            Actions
          </h2>

          <div className="grid gap-3 md:grid-cols-2">

            <button className="rounded-xl bg-black py-3 font-semibold text-white hover:bg-gray-800">
              👤 Assign Occupant
            </button>

            <button
              onClick={() =>
                setShowEdit(true)
              }
              className="rounded-xl border py-3 font-semibold hover:bg-gray-100"
            >
              ✏ Edit Unit
            </button>

          </div>

        </div>

      </main>

      {/* Edit Unit */}

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

      {/* Water Reading */}

      {showWaterModal && (
        <MeterReadingModal
          workspaceId={unit.workspace_id}
          propertyId={unit.property_id}
          unitId={unit.id}
          utilityType="Water"
          unitRate={Number(
            unit.water_amount
          )}
          onClose={() =>
            setShowWaterModal(false)
          }
          onSaved={() => {
            setShowWaterModal(false);
            loadUnit();
          }}
        />
      )}

      {/* Electricity Reading */}

      {showElectricityModal && (
        <MeterReadingModal
          workspaceId={unit.workspace_id}
          propertyId={unit.property_id}
          unitId={unit.id}
          utilityType="Electricity"
          unitRate={Number(
            unit.electricity_amount
          )}
          onClose={() =>
            setShowElectricityModal(
              false
            )
          }
          onSaved={() => {
            setShowElectricityModal(
              false
            );
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
    <div className="flex items-center justify-between border-b pb-3">

      <span className="text-gray-500">
        {label}
      </span>

      <strong>{value}</strong>

    </div>
  );
}
