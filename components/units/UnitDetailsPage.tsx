"use client";

import { useEffect, useState } from "react";

import Breadcrumb from "@/components/common/Breadcrumb";

import EditUnitModal from "@/components/units/EditUnitModal";
import CreateLeaseModal from "@/components/leases/CreateLeaseModal";

import MeterReadingModal from "@/components/utilities/MeterReadingModal";
import SetupUtilityMeterModal from "@/components/utilities/SetupUtilityMeterModal";

import { getUnit } from "@/services/units/getUnit";
import { getUtilityMeters } from "@/services/utilities/getUtilityMeters";

import { Unit } from "@/types/unit";
import { useRouter } from "next/navigation";

import { getUnitActiveLease } from "@/services/leases/getUnitActiveLease";

type Props = {
  unitId: string;
};

export default function UnitDetailsPage({
  unitId,
}: Props) {
  const router = useRouter();

  const [loading, setLoading] =
    useState(true);

  const [unit, setUnit] =
    useState<any>(null);

  const [meters, setMeters] =
    useState<any[]>([]);

  const [selectedMeter, setSelectedMeter] =
    useState<any>(null);

  const [showEdit, setShowEdit] =
    useState(false);

  const [
    showCreateLease,
    setShowCreateLease,
  ] = useState(false);

  const [
    showSetupMeter,
    setShowSetupMeter,
  ] = useState(false);

  const [
    showReadingModal,
    setShowReadingModal,
  ] = useState(false);

  useEffect(() => {

    loadPage();

  }, []);

  async function loadPage() {

    try {

      setLoading(true);

      const [
        propertyUnit,
        utilityMeters,
      ] = await Promise.all([

        getUnit(unitId),

        getUtilityMeters(unitId),

      ]);

      setUnit(propertyUnit);

      setMeters(utilityMeters);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  }
async function handleViewLease() {

  try {

    const lease =
      await getUnitActiveLease(
        unit.id
      );

    if (!lease) {

      alert(
        "This unit has no active lease."
      );

      return;

    }

    router.push(
      `/leases/${lease.id}`
    );

  } catch (error) {

    console.error(error);

    alert(
      "Unable to open lease."
    );

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

            {meters.length === 0 && (

              <div className="rounded-xl border border-dashed p-6 text-center text-gray-500">

                No utility meters found.

              </div>

            )}

            {meters.map((meter) => (

              <div
                key={meter.id}
                className="mb-6 rounded-2xl border p-5"
              >

                <div className="flex items-start justify-between">

                  <div>

                    <h3 className="text-lg font-semibold">

                      {meter.utility_type === "Water"
                        ? "🚰 Water"
                        : meter.utility_type ===
                          "Electricity"
                        ? "⚡ Electricity"
                        : meter.utility_type}

                    </h3>

                    <div className="mt-2">

                      {meter.status ===
                      "Pending Setup" ? (

                        <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800">

                          🟡 Pending Setup

                        </span>

                      ) : (

                        <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">

                          🟢 Active

                        </span>

                      )}

                    </div>

                  </div>

                  {meter.status ===
                  "Pending Setup" ? (

                    <button
                      onClick={() => {

                        setSelectedMeter(
                          meter
                        );

                        setShowSetupMeter(
                          true
                        );

                      }}
                      className="rounded-xl bg-black px-4 py-2 text-white hover:bg-gray-800"
                    >

                      Setup Meter

                    </button>

                  ) : (

                    <button
                      onClick={() => {

                        setSelectedMeter(
                          meter
                        );

                        setShowReadingModal(
                          true
                        );

                      }}
                      className="rounded-xl bg-black px-4 py-2 text-white hover:bg-gray-800"
                    >

                      Record Reading

                    </button>

                  )}

                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2">

                  <Info
                    label="Meter Number"
                    value={
                      meter.meter_number ||
                      "Not Assigned"
                    }
                  />

                  <Info
                    label="Rate"
                    value={`KSh ${Number(
                      meter.unit_rate
                    ).toLocaleString()}`}
                  />

                  <Info
                    label="Opening Reading"
                    value={String(
                      Number(
                        meter.opening_reading
                      )
                    )}
                  />

                  <Info
                    label="Current Reading"
                    value={
                      meter.latest_reading
                        ? String(
                            meter.latest_reading.current_reading
                          )
                        : "-"
                    }
                  />

                  <Info
                    label="Last Bill"
                    value={
                      meter.latest_reading
                        ? `KSh ${Number(
                            meter.latest_reading.amount
                          ).toLocaleString()}`
                        : "-"
                    }
                  />

                  <Info
                    label="Location"
                    value={
                      meter.meter_location ||
                      "-"
                    }
                  />

                </div>

                {meter.status ===
                  "Active" && (

                  <div className="mt-5 flex flex-wrap gap-3">

                    <button className="rounded-xl border px-4 py-2 hover:bg-gray-100">

                      📜 History

                    </button>

                    <button className="rounded-xl border px-4 py-2 hover:bg-gray-100">

                      🔄 Replace Meter

                    </button>

                  </div>

                )}

              </div>

            ))}

          </div>

        </div>
                      {/* Actions */}

        <div className="rounded-2xl border bg-white p-6 shadow-sm">

          <h2 className="mb-5 text-xl font-semibold">
            Actions
          </h2>

          <div className="grid gap-3 md:grid-cols-2">

            {unit.status === "Vacant" ? (

              <button
                onClick={() =>
                  setShowCreateLease(true)
                }
                className="rounded-xl bg-black py-3 font-semibold text-white transition hover:bg-gray-800"
              >
                👤 Create Lease
              </button>

            ) : (

              <button
  onClick={handleViewLease}
  className="rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
>
  📄 View Lease
</button>

            )}

            <button
              onClick={() =>
                setShowEdit(true)
              }
              className="rounded-xl border py-3 font-semibold transition hover:bg-gray-100"
            >
              ✏ Edit Unit
            </button>

          </div>

          {/* Quick Status */}

          <div className="mt-6 rounded-xl bg-gray-50 p-5">

            <h3 className="mb-4 text-lg font-semibold">
              Unit Status
            </h3>

            <div className="grid gap-4 md:grid-cols-3">

              <div>

                <p className="text-xs uppercase text-gray-500">
                  Occupancy
                </p>

                <p className="mt-1 font-semibold">

                  {unit.status}

                </p>

              </div>

              <div>

                <p className="text-xs uppercase text-gray-500">
                  Monthly Rent
                </p>

                <p className="mt-1 font-semibold">

                  KSh{" "}
                  {Number(
                    unit.monthly_rent
                  ).toLocaleString()}

                </p>

              </div>

              <div>

                <p className="text-xs uppercase text-gray-500">
                  Deposit
                </p>

                <p className="mt-1 font-semibold">

                  KSh{" "}
                  {Number(
                    unit.deposit
                  ).toLocaleString()}

                </p>

              </div>

            </div>

          </div>

        </div>

      </main>
            {/* Create Lease */}

      {showCreateLease && (

        <CreateLeaseModal

          propertyId={
            unit.property.id
          }

          unitId={
            unit.id
          }

          onCancel={() =>
            setShowCreateLease(false)
          }

          onSuccess={() => {

            setShowCreateLease(false);

            loadPage();

          }}

        />

      )}

      {/* Edit Unit */}

      {showEdit && (

        <EditUnitModal

          unit={unit as Unit}

          onClose={() =>
            setShowEdit(false)
          }

          onSaved={() => {

            setShowEdit(false);

            loadPage();

          }}

        />

      )}

      {/* Setup Meter */}

      {showSetupMeter &&
        selectedMeter && (

        <SetupUtilityMeterModal

          meter={selectedMeter}

          onClose={() => {

            setShowSetupMeter(false);

            setSelectedMeter(null);

          }}

          onSaved={() => {

            setShowSetupMeter(false);

            setSelectedMeter(null);

            loadPage();

          }}

        />

      )}

      {/* Record Reading */}

      {showReadingModal &&
        selectedMeter && (

        <MeterReadingModal

          meter={selectedMeter}

          workspaceId={
            selectedMeter.workspace_id
          }

          propertyId={
            selectedMeter.property_id
          }

          unitId={
            selectedMeter.unit_id
          }

          utilityType={
            selectedMeter.utility_type
          }

          unitRate={Number(
            selectedMeter.unit_rate
          )}

          onClose={() => {

            setShowReadingModal(false);

            setSelectedMeter(null);

          }}

          onSaved={() => {

            setShowReadingModal(false);

            setSelectedMeter(null);

            loadPage();

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

      <strong className="text-right">

        {value}

      </strong>

    </div>

  );

}
