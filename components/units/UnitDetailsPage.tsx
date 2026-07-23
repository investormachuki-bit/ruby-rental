"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Building2,
  Coins,
  Home,
  Pencil,
  Plus,
  User,
  Wrench,
} from "lucide-react";

import { useRouter } from "next/navigation";

import CreateLeaseModal from "@/components/leases/CreateLeaseModal";
import CreateUtilityMeterModal from "@/components/utilities/CreateUtilityMeterModal";
import MeterReadingModal from "@/components/utilities/MeterReadingModal";
import SetupUtilityMeterModal from "@/components/utilities/SetupUtilityMeterModal";

import { getUnitDetails } from "@/services/units/getUnitDetails";

type Props = {
  unitId: string;
};

export default function UnitDetailsPage({
  unitId,
}: Props) {

  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [unit, setUnit] = useState<any>(null);

  const [meters, setMeters] = useState<any[]>([]);

  const [showCreateLease, setShowCreateLease] =
    useState(false);

  const [showCreateMeter, setShowCreateMeter] =
    useState(false);

  const [showSetupMeter, setShowSetupMeter] =
    useState(false);

  const [showReadingModal, setShowReadingModal] =
    useState(false);

  const [selectedMeter, setSelectedMeter] =
    useState<any>(null);

  useEffect(() => {

    loadPage();

  }, []);

  async function loadPage() {

    try {

      setLoading(true);

      const result =
        await getUnitDetails(unitId);

      setUnit(result.unit);

      setMeters(result.meters ?? []);

    } catch (error: any) {

      alert(error.message);

    } finally {

      setLoading(false);

    }

  }

  function handleViewLease() {

    if (!unit?.lease) {

      alert("No active lease.");

      return;

    }

    router.push(
      `/leases/${unit.lease.id}`
    );

  }

  if (loading) {

    return (

      <div className="flex h-96 items-center justify-center">

        Loading...

      </div>

    );

  }

  if (!unit) {

    return (

      <div className="flex h-96 items-center justify-center">

        Unit not found.

      </div>

    );

  }

  return (

    <>

      <main className="space-y-8">

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <button
              onClick={() => router.back()}
              className="mb-4 flex items-center gap-2 text-gray-500 hover:text-black"
            >

              <ArrowLeft className="h-5 w-5" />

              Back

            </button>

            <h1 className="text-3xl font-bold">

              Unit {unit.unit_number}

            </h1>

            <p className="mt-2 text-gray-500">

              {unit.property.name}

            </p>

          </div>

          <div className="flex flex-wrap gap-3">

            {unit.status === "Vacant" && (

              <button
                onClick={() =>
                  setShowCreateLease(true)
                }
                className="rounded-xl bg-black px-5 py-3 font-semibold text-white hover:bg-gray-800"
              >

                <Plus className="mr-2 inline h-5 w-5" />

                Create Lease

              </button>

            )}

            {unit.status === "Occupied" &&
              unit.lease && (

              <button
                onClick={handleViewLease}
                className="rounded-xl border px-5 py-3 font-semibold hover:bg-gray-100"
              >

                View Lease

              </button>

            )}

          </div>

        </div>

        {/* KPI Cards */}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-2xl border bg-white p-6 shadow-sm">

            <p className="text-gray-500">

              Monthly Rent

            </p>

            <h2 className="mt-2 text-3xl font-bold">

              KSh{" "}
              {Number(
                unit.monthly_rent
              ).toLocaleString()}

            </h2>

          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">

            <p className="text-gray-500">

              Deposit

            </p>

            <h2 className="mt-2 text-3xl font-bold">

              KSh{" "}
              {Number(
                unit.deposit
              ).toLocaleString()}

            </h2>

          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">

            <p className="text-gray-500">

              Status

            </p>

            <h2 className="mt-2 text-3xl font-bold">

              {unit.status}

            </h2>

          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">

            <p className="text-gray-500">

              Occupancy

            </p>

            <h2 className="mt-2 text-3xl font-bold">

              {unit.occupant
                ? unit.occupant.full_name
                : "Vacant"}

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
              value={unit.unit_type}
            />

            <Info
              label="Floor"
              value={
                unit.floor ?? "-"
              }
            />

          </div>

        </div>
                {/* Financial Information */}

        <div className="rounded-2xl border bg-white p-6 shadow-sm">

          <h2 className="mb-6 text-2xl font-bold">

            Financial Information

          </h2>

          <div className="grid gap-6 md:grid-cols-2">

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
              label="Status"
              value={unit.status}
            />

            <Info
              label="Occupancy"
              value={
                unit.occupant
                  ? unit.occupant.full_name
                  : "Vacant"
              }
            />

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

            <button
              onClick={() =>
                setShowCreateMeter(true)
              }
              className="rounded-xl bg-black px-5 py-3 font-semibold text-white transition hover:bg-gray-800"
            >

              {meters.length === 0
                ? "Setup Utility"
                : "Add Utility"}

            </button>

          </div>

          {meters.length === 0 && (

            <div className="rounded-xl border border-dashed p-10 text-center">

              <p className="mb-5 text-gray-500">

                No utility meters have been configured for this unit.

              </p>

              <button
                onClick={() =>
                  setShowCreateMeter(true)
                }
                className="rounded-xl bg-black px-5 py-3 font-semibold text-white transition hover:bg-gray-800"
              >

                Setup First Utility Meter

              </button>

            </div>

          )}

          {meters.length > 0 && (

            <div className="space-y-6">

              {meters.map((meter) => (

                <div
                  key={meter.id}
                  className="rounded-2xl border bg-white p-5 shadow-sm"
                >

                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                    <div>

                      <h3 className="text-xl font-bold">

                        {meter.utility_type} Meter

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

                      <button
                        onClick={() => {

                          setSelectedMeter(meter);

                          setShowSetupMeter(true);

                        }}
                        className="rounded-xl border px-5 py-3 font-semibold hover:bg-gray-100"
                      >

                        <Pencil className="mr-2 inline h-4 w-4" />

                        Configure

                      </button>

                      <button
                        onClick={() => {

                          setSelectedMeter(meter);

                          setShowReadingModal(true);

                        }}
                        className="rounded-xl bg-black px-5 py-3 font-semibold text-white hover:bg-gray-800"
                      >

                        Record Reading

                      </button>

                    </div>

                  </div>

                  <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">

                    <Info
                      label="Status"
                      value={meter.status}
                    />

                    <Info
                      label="Unit Rate"
                      value={`KSh ${Number(
                        meter.unit_rate
                      ).toLocaleString()}`}
                    />

                    <Info
                      label="Opening Reading"
                      value={String(
                        meter.opening_reading
                      )}
                    />

                    <Info
                      label="Current Reading"
                      value={
                        meter.latest_reading
                          ? String(
                              meter.latest_reading
                                .current_reading
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

          )}

        </div>
                {/* Current Occupancy */}

        <div className="grid gap-6 lg:grid-cols-2">

          <div className="rounded-2xl border bg-white p-6 shadow-sm">

            <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold">

              <User className="h-6 w-6 text-[#D4AF37]" />

              Current Occupancy

            </h2>

            <div className="space-y-4">

              <Info
                label="Occupant"
                value={
                  unit.occupant
                    ? unit.occupant.full_name
                    : "Vacant"
                }
              />

              <Info
                label="Phone"
                value={
                  unit.occupant?.phone ??
                  "-"
                }
              />

              <Info
                label="Email"
                value={
                  unit.occupant?.email ??
                  "-"
                }
              />

              <Info
                label="Lease Status"
                value={
                  unit.lease
                    ? unit.lease.status
                    : "No Active Lease"
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

              No maintenance records available.

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

            Payment history will appear here once rent payments are recorded.

          </div>

        </div>

      </main>

      {/* Create Lease */}

      {showCreateLease && (

        <CreateLeaseModal
          propertyId={unit.property.id}
          unitId={unit.id}
          onCancel={() => {

            setShowCreateLease(false);

          }}
          onSuccess={() => {

            setShowCreateLease(false);

            loadPage();

          }}
        />

      )}

      {/* Create Utility Meter */}

      {showCreateMeter && (

        <CreateUtilityMeterModal
          workspaceId={unit.workspace_id}
          propertyId={unit.property.id}
          unitId={unit.id}
          onClose={() => {

            setShowCreateMeter(false);

          }}
          onSaved={() => {

            setShowCreateMeter(false);

            loadPage();

          }}
        />

      )}

      {/* Configure Existing Utility Meter */}

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

      {/* Record Meter Reading */}

      {showReadingModal &&
        selectedMeter && (

        <MeterReadingModal
          meter={selectedMeter}
          workspaceId={selectedMeter.workspace_id}
          propertyId={selectedMeter.property_id}
          unitId={selectedMeter.unit_id}
          utilityType={selectedMeter.utility_type}
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

      <span className="font-semibold text-right">

        {value}

      </span>

    </div>

  );

}
