"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import Breadcrumb from "@/components/common/Breadcrumb";

import CreateLeaseModal from "@/components/leases/CreateLeaseModal";

import MeterReadingModal from "@/components/utilities/MeterReadingModal";
import SetupUtilityMeterModal from "@/components/utilities/SetupUtilityMeterModal";

import {
  Home,
  Coins,
  Ruler,
  BedDouble,
  Bath,
  Pencil,
  UserPlus,
  Wrench,
  FileText,
} from "lucide-react";

import { getUnit } from "@/services/units/getUnit";
import { getUtilityMeters } from "@/services/utilities/getUtilityMeters";
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
        unitData,
        utilityMeters,
      ] = await Promise.all([

        getUnit(unitId),

        getUtilityMeters(unitId),

      ]);

      setUnit(unitData);

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

        Loading unit...

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

      <main className="mx-auto w-full max-w-7xl space-y-8 p-4 sm:p-6">

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
                {/* Header */}

        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <div className="flex items-center gap-3">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D4AF37]/10">

                <Home className="h-7 w-7 text-[#D4AF37]" />

              </div>

              <div>

                <h1 className="text-4xl font-bold">

                  {unit.unit_number}

                </h1>

                <p className="mt-1 text-gray-500">

                  {unit.unit_type ?? "Rental Unit"}

                  {unit.floor_number !== null &&
                    unit.floor_number !== undefined &&
                    ` • Floor ${unit.floor_number}`}

                </p>

              </div>

            </div>

          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">

            {unit.status === "Vacant" ? (

              <button
                onClick={() =>
                  setShowCreateLease(true)
                }
                className="flex items-center gap-2 rounded-xl bg-black px-5 py-3 font-semibold text-white transition hover:bg-gray-800"
              >

                <UserPlus size={18} />

                Create Lease

              </button>

            ) : (

              <button
                onClick={handleViewLease}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
              >

                <FileText size={18} />

                View Lease

              </button>

            )}

            <button
              onClick={() =>
                router.push(
                  `/units/${unit.id}/edit`
                )
              }
              className="flex items-center gap-2 rounded-xl border px-5 py-3 font-semibold transition hover:bg-gray-100"
            >

              <Pencil size={18} />

              Edit Unit

            </button>

          </div>

        </div>

        {/* KPI Cards */}

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-2xl border bg-white p-6 shadow-sm">

            <div className="mb-4 flex items-center justify-between">

              <span className="text-gray-500">

                Monthly Rent

              </span>

              <Coins className="text-[#D4AF37]" />

            </div>

            <h2 className="text-3xl font-bold">

              KSh{" "}

              {Number(
                unit.monthly_rent
              ).toLocaleString()}

            </h2>

          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">

            <div className="mb-4 flex items-center justify-between">

              <span className="text-gray-500">

                Deposit

              </span>

              <Coins className="text-[#D4AF37]" />

            </div>

            <h2 className="text-3xl font-bold">

              KSh{" "}

              {Number(
                unit.deposit
              ).toLocaleString()}

            </h2>

          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">

            <div className="mb-4 flex items-center justify-between">

              <span className="text-gray-500">

                Bedrooms

              </span>

              <BedDouble className="text-[#D4AF37]" />

            </div>

            <h2 className="text-3xl font-bold">

              {unit.bedrooms}

            </h2>

          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">

            <div className="mb-4 flex items-center justify-between">

              <span className="text-gray-500">

                Bathrooms

              </span>

              <Bath className="text-[#D4AF37]" />

            </div>

            <h2 className="text-3xl font-bold">

              {unit.bathrooms}

            </h2>

          </div>

        </div>

        {/* Basic Information */}

        <div className="rounded-2xl border bg-white p-6 shadow-sm">

          <h2 className="mb-6 text-2xl font-bold">

            Basic Information

          </h2>

          <div className="grid gap-6 md:grid-cols-2">

            <Info
              label="Property"
              value={unit.property.name}
            />

            <Info
              label="Unit Number"
              value={unit.unit_number}
            />

            <Info
              label="Unit Type"
              value={
                unit.unit_type ??
                "-"
              }
            />

            <Info
              label="Floor Number"
              value={
                unit.floor_number != null
                  ? String(unit.floor_number)
                  : "-"
              }
            />

            <Info
              label="Bedrooms"
              value={String(unit.bedrooms)}
            />

            <Info
              label="Bathrooms"
              value={String(unit.bathrooms)}
            />

            <Info
              label="Size"
              value={`${unit.size_sqm} Sq. M`}
            />

            <Info
              label="Status"
              value={unit.status}
            />

          </div>

        </div>
                {/* Financial Information */}

        <div className="grid gap-6 lg:grid-cols-2">

          <div className="rounded-2xl border bg-white p-6 shadow-sm lg:col-span-2">

            <h2 className="mb-6 text-2xl font-bold">
              Financial Information
            </h2>

            <div className="grid gap-6 md:grid-cols-2">

              <Info
                label="Monthly Rent"
                value={`KSh ${Number(unit.monthly_rent).toLocaleString()}`}
              />

              <Info
                label="Deposit"
                value={`KSh ${Number(unit.deposit).toLocaleString()}`}
              />

              <Info
                label="Status"
                value={unit.status}
              />

              <Info
                label="Occupancy"
                value={unit.occupant?.full_name ?? "Vacant"}
              />

            </div>

          </div>

        </div>

        {/* Utility Meters */}

        <div className="rounded-2xl border bg-white p-6 shadow-sm">

          <div className="mb-6 flex items-center justify-between">

            <div>

              <h2 className="text-2xl font-bold">

                Utility Meters

              </h2>

              <p className="mt-1 text-gray-500">

                Manage all utility meters assigned to this unit.

              </p>

            </div>

          </div>

          {meters.length === 0 && (

            <div className="rounded-xl border border-dashed p-8 text-center text-gray-500">

              No utility meters have been configured for this unit.

            </div>

          )}

          <div className="space-y-6">

            {meters.map((meter) => (

              <div
                key={meter.id}
                className="w-full rounded-2xl border bg-white p-4 shadow-sm sm:p-6"
              >

                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

                  <div>

                    <h3 className="text-xl font-bold">

                      {meter.utility_type === "Water"
                        ? "🚰 Water Meter"
                        : meter.utility_type ===
                          "Electricity"
                        ? "⚡ Electricity Meter"
                        : meter.utility_type ===
                          "Gas"
                        ? "🔥 Gas Meter"
                        : "🌐 Internet"}

                    </h3>

                    <p className="mt-2 text-gray-500">

                      Meter Number:

                      <strong className="ml-2 text-gray-900">

                        {meter.meter_number ||
                          "Not Assigned"}

                      </strong>

                    </p>

                  </div>

                  <div className="flex flex-wrap gap-3">

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
                        className="w-full rounded-xl bg-black px-5 py-3 font-semibold text-white transition hover:bg-gray-800 sm:w-auto"
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
                        className="w-full rounded-xl bg-black px-5 py-3 font-semibold text-white transition hover:bg-gray-800 sm:w-auto"
                      >

                        Record Reading

                      </button>

                    )}

                    <button className="w-full rounded-xl border px-5 py-3 font-semibold transition hover:bg-gray-100 sm:w-auto">

                      History

                    </button>

                  </div>

                </div>

                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

                  <Info
                    label="Status"
                    value={meter.status}
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

              </div>

            ))}

          </div>

        </div>
                {/* Current Occupancy */}

        <div className="grid gap-6 lg:grid-cols-2">

          <div className="rounded-2xl border bg-white p-6 shadow-sm">

            <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold">

              <Home className="h-6 w-6 text-[#D4AF37]" />

              Occupancy

            </h2>

            <div className="space-y-4">

              <Info
                label="Current Status"
                value={unit.status}
              />

              <Info
                label="Current Occupant"
                value={
                  unit.occupant?.full_name ??
                  "No Occupant"
                }
              />

              <Info
                label="Active Lease"
                value={
                  unit.status === "Occupied"
                    ? "Available"
                    : "None"
                }
              />

            </div>

          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">

            <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold">

              <Wrench className="h-6 w-6 text-[#D4AF37]" />

              Maintenance

            </h2>

            <div className="rounded-xl border border-dashed p-8 text-center text-gray-500">

              Maintenance history will appear here.

            </div>

          </div>

        </div>

        {/* Payment History */}

        <div className="rounded-2xl border bg-white p-6 shadow-sm">

          <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold">

            <Coins className="h-6 w-6 text-[#D4AF37]" />

            Payment History

          </h2>

          <div className="rounded-xl border border-dashed p-10 text-center text-gray-500">

            Rent payments will appear here.

          </div>

        </div>

      </main>

      {/* Create Lease */}

      {showCreateLease && (

        <CreateLeaseModal
          propertyId={unit.property.id}
          unitId={unit.id}
          onCancel={() =>
            setShowCreateLease(false)
          }
          onSuccess={() => {

            setShowCreateLease(false);

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

    <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3">

      <span className="text-gray-500">

        {label}

      </span>

      <strong className="max-w-[60%] break-words text-right">

        {value}

      </strong>

    </div>

  );

}
