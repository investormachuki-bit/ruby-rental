"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Building2,
  ChevronRight,
  Coins,
  MoreVertical,
  Pencil,
  Plus,
  User,
  Wrench,
} from "lucide-react";

import AppShell from "@/components/layout/AppShell";

import CreateLeaseModal from "@/components/leases/CreateLeaseModal";

import CreateUtilityMeterModal from "@/components/utilities/CreateUtilityMeterModal";
import SetupUtilityMeterModal from "@/components/utilities/SetupUtilityMeterModal";
import MeterReadingModal from "@/components/utilities/MeterReadingModal";

import { getUnitDetails } from "@/services/units/getUnitDetails";

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

  const [activeTab, setActiveTab] =
    useState("overview");

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

  if (loading) {

    return (

      <AppShell>

        <div className="flex h-[70vh] items-center justify-center">

          Loading...

        </div>

      </AppShell>

    );

  }

  if (!unit) {

    return (

      <AppShell>

        <div className="flex h-[70vh] items-center justify-center">

          Unit not found.

        </div>

      </AppShell>

    );

  }

  return (

    <AppShell>

      <div className="space-y-6">

        {/* Breadcrumbs */}

        <nav className="flex flex-wrap items-center gap-2 text-sm">

          <button
            onClick={() =>
              router.push("/dashboard")
            }
            className="text-gray-500 transition hover:text-black"
          >

            Dashboard

          </button>

          <ChevronRight className="h-4 w-4 text-gray-400" />

          <button
            onClick={() =>
              router.push("/properties")
            }
            className="text-gray-500 transition hover:text-black"
          >

            Properties

          </button>

          <ChevronRight className="h-4 w-4 text-gray-400" />

          <button
            onClick={() =>
              router.push(
                `/properties/${unit.property.id}`
              )
            }
            className="text-gray-500 transition hover:text-black"
          >

            {unit.property.name}

          </button>

          <ChevronRight className="h-4 w-4 text-gray-400" />

          <span className="font-semibold text-black">

            Unit {unit.unit_number}

          </span>

        </nav>

        {/* Header */}

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <div className="flex flex-wrap items-center gap-3">

                <h1 className="text-3xl font-bold tracking-tight">

                  Unit {unit.unit_number}

                </h1>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    unit.status === "Occupied"
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >

                  {unit.status}

                </span>

              </div>

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
                  className="rounded-xl bg-black px-5 py-3 font-medium text-white transition hover:bg-gray-800"
                >

                  <Plus className="mr-2 inline h-4 w-4" />

                  Create Lease

                </button>

              )}

              <button className="rounded-xl border border-slate-200 px-5 py-3 font-medium hover:bg-slate-50">

                <Pencil className="mr-2 inline h-4 w-4" />

                Edit Unit

              </button>

              <button className="rounded-xl border border-slate-200 p-3 hover:bg-slate-50">

                <MoreVertical className="h-5 w-5" />

              </button>

            </div>

          </div>

        </div>
                {/* Summary Cards */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-500">

                  Monthly Rent

                </p>

                <h2 className="mt-2 text-2xl font-bold">

                  KSh {Number(unit.monthly_rent ?? 0).toLocaleString()}

                </h2>

              </div>

              <div className="rounded-xl bg-amber-50 p-3">

                <Coins className="h-6 w-6 text-amber-600" />

              </div>

            </div>

          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-500">

                  Deposit

                </p>

                <h2 className="mt-2 text-2xl font-bold">

                  KSh {Number(unit.deposit ?? 0).toLocaleString()}

                </h2>

              </div>

              <div className="rounded-xl bg-blue-50 p-3">

                <Building2 className="h-6 w-6 text-blue-600" />

              </div>

            </div>

          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-500">

                  Occupancy

                </p>

                <h2 className="mt-2 text-xl font-semibold">

                  {unit.occupant
                    ? unit.occupant.full_name
                    : "Vacant"}

                </h2>

              </div>

              <div className="rounded-xl bg-green-50 p-3">

                <User className="h-6 w-6 text-green-600" />

              </div>

            </div>

          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-500">

                  Utility Meters

                </p>

                <h2 className="mt-2 text-2xl font-bold">

                  {meters.length}

                </h2>

              </div>

              <div className="rounded-xl bg-purple-50 p-3">

                <Wrench className="h-6 w-6 text-purple-600" />

              </div>

            </div>

          </div>

        </div>

        {/* Tabs */}

        <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">

          <div className="flex min-w-max gap-2 overflow-x-auto">

            {[
              {
                id: "overview",
                label: "Overview",
              },
              {
                id: "utilities",
                label: "Utilities",
              },
              {
                id: "lease",
                label: "Lease",
              },
              {
                id: "payments",
                label: "Payments",
              },
              {
                id: "maintenance",
                label: "Maintenance",
              },
            ].map((tab) => (

              <button
                key={tab.id}
                onClick={() =>
                  setActiveTab(tab.id)
                }
                className={`rounded-xl px-5 py-3 text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-black text-white shadow"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >

                {tab.label}

              </button>

            ))}

          </div>

        </div>

        {/* Tab Content */}
                {activeTab === "overview" && (

          <div className="grid gap-6 lg:grid-cols-2">

            {/* Basic Information */}

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

              <div className="border-b border-slate-200 px-6 py-4">

                <h2 className="text-lg font-semibold">

                  Basic Information

                </h2>

                <p className="mt-1 text-sm text-slate-500">

                  General information about this rental unit.

                </p>

              </div>

              <div className="divide-y divide-slate-100">

                <InfoRow
                  label="Unit Number"
                  value={unit.unit_number}
                />

                <InfoRow
                  label="Property"
                  value={unit.property?.name}
                />

                <InfoRow
                  label="Unit Type"
                  value={unit.unit_type ?? "-"}
                />

                <InfoRow
                  label="Bedrooms"
                  value={unit.bedrooms ?? "-"}
                />

                <InfoRow
                  label="Bathrooms"
                  value={unit.bathrooms ?? "-"}
                />

                <InfoRow
                  label="Floor"
                  value={unit.floor ?? "-"}
                />

                <InfoRow
                  label="Status"
                  value={unit.status}
                />

              </div>

            </div>

            {/* Financial Information */}

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

              <div className="border-b border-slate-200 px-6 py-4">

                <h2 className="text-lg font-semibold">

                  Financial Information

                </h2>

                <p className="mt-1 text-sm text-slate-500">

                  Rent and occupancy summary.

                </p>

              </div>

              <div className="divide-y divide-slate-100">

                <InfoRow
                  label="Monthly Rent"
                  value={`KSh ${Number(
                    unit.monthly_rent ?? 0
                  ).toLocaleString()}`}
                />

                <InfoRow
                  label="Deposit"
                  value={`KSh ${Number(
                    unit.deposit ?? 0
                  ).toLocaleString()}`}
                />

                <InfoRow
                  label="Occupancy"
                  value={
                    unit.occupant
                      ? "Occupied"
                      : "Vacant"
                  }
                />

                <InfoRow
                  label="Current Tenant"
                  value={
                    unit.occupant?.full_name ??
                    "No Active Tenant"
                  }
                />

                <InfoRow
                  label="Lease Status"
                  value={
                    unit.lease?.status ??
                    "No Active Lease"
                  }
                />

                <InfoRow
                  label="Lease Ends"
                  value={
                    unit.lease?.end_date ?? "-"
                  }
                />

              </div>

            </div>

          </div>

        )}
        {activeTab === "utilities" && (

  <div className="space-y-6">

    {/* Header */}

    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">

      <div>

        <h2 className="text-xl font-semibold">

          Utility Meters

        </h2>

        <p className="mt-1 text-sm text-slate-500">

          Manage water, electricity and other utility meters assigned to this unit.

        </p>

      </div>

      <button
        onClick={() => setShowCreateMeter(true)}
        className="inline-flex items-center justify-center rounded-xl bg-black px-5 py-3 font-medium text-white hover:bg-gray-800"
      >

        <Plus className="mr-2 h-4 w-4" />

        Add Utility

      </button>

    </div>

    {/* Empty State */}

    {meters.length === 0 && (

      <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">

        <Wrench className="mx-auto mb-4 h-10 w-10 text-slate-400" />

        <h3 className="text-lg font-semibold">

          No Utility Meters

        </h3>

        <p className="mt-2 text-slate-500">

          Create the first utility meter for this unit.

        </p>

      </div>

    )}

    {/* Utility Cards */}

    <div className="grid gap-5 lg:grid-cols-2">

      {meters.map((meter) => {

        const configured =
          meter.status !== "Pending Setup";

        return (

          <div
            key={meter.id}
            className="rounded-2xl border border-slate-200 bg-white shadow-sm"
          >

            {/* Card Header */}

            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">

              <div>

                <h3 className="font-semibold">

                  {meter.utility_type}

                </h3>

                <p className="mt-1 text-sm text-slate-500">

                  {meter.status}

                </p>

              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  configured
                    ? "bg-green-100 text-green-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >

                {configured
                  ? "Active"
                  : "Pending"}

              </span>

            </div>

            {/* Card Body */}

            <div className="space-y-4 p-6">

              <InfoRow
                label="Meter Number"
                value={
                  meter.meter_number ?? "-"
                }
              />

              <InfoRow
                label="Current Reading"
                value={
                  meter.current_reading ?? "-"
                }
              />

              <InfoRow
                label="Last Reading"
                value={
                  meter.last_reading_date ?? "-"
                }
              />

            </div>

            {/* Actions */}

            <div className="flex gap-3 border-t border-slate-100 p-5">

              {!configured ? (

                <button
                  onClick={() => {

                    setSelectedMeter(meter);

                    setShowSetupMeter(true);

                  }}
                  className="flex-1 rounded-xl bg-black px-4 py-3 font-medium text-white hover:bg-gray-800"
                >

                  Configure

                </button>

              ) : (

                <>

                  <button
                    onClick={() => {

                      setSelectedMeter(meter);

                      setShowSetupMeter(true);

                    }}
                    className="flex-1 rounded-xl border border-slate-300 px-4 py-3 hover:bg-slate-50"
                  >

                    Edit

                  </button>

                  <button
                    onClick={() => {

                      setSelectedMeter(meter);

                      setShowReadingModal(true);

                    }}
                    className="flex-1 rounded-xl bg-black px-4 py-3 font-medium text-white hover:bg-gray-800"
                  >

                    Record Reading

                  </button>

                </>

              )}

            </div>

          </div>

        );

      })}

    </div>

  </div>

)}
        {/* ==============================
    LEASE TAB
============================== */}

{activeTab === "lease" && (

  <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

    <div className="border-b border-slate-200 px-6 py-4">

      <h2 className="text-lg font-semibold">

        Lease Information

      </h2>

    </div>

    {unit.lease ? (

      <div className="divide-y divide-slate-100">

        <InfoRow
          label="Tenant"
          value={unit.occupant?.full_name}
        />

        <InfoRow
          label="Lease Start"
          value={unit.lease.start_date}
        />

        <InfoRow
          label="Lease End"
          value={unit.lease.end_date}
        />

        <InfoRow
          label="Status"
          value={unit.lease.status}
        />

      </div>

    ) : (

      <div className="py-16 text-center">

        <h3 className="text-lg font-semibold">

          No Active Lease

        </h3>

        <p className="mt-2 text-slate-500">

          This unit currently has no active lease.

        </p>

        <button
          onClick={() => setShowCreateLease(true)}
          className="mt-6 rounded-xl bg-black px-5 py-3 text-white"
        >

          Create Lease

        </button>

      </div>

    )}

  </div>

)}

{/* ==============================
    PAYMENTS TAB
============================== */}

{activeTab === "payments" && (

  <div className="rounded-2xl border border-slate-200 bg-white py-20 text-center shadow-sm">

    <Coins className="mx-auto h-12 w-12 text-slate-300" />

    <h2 className="mt-4 text-xl font-semibold">

      Payments Module

    </h2>

    <p className="mt-2 text-slate-500">

      Payment history, invoices and balances will appear here.

    </p>

  </div>

)}

{/* ==============================
    MAINTENANCE TAB
============================== */}

{activeTab === "maintenance" && (

  <div className="rounded-2xl border border-slate-200 bg-white py-20 text-center shadow-sm">

    <Wrench className="mx-auto h-12 w-12 text-slate-300" />

    <h2 className="mt-4 text-xl font-semibold">

      Maintenance Module

    </h2>

    <p className="mt-2 text-slate-500">

      Maintenance requests and history will appear here.

    </p>

  </div>

)}

{/* ==============================
    MODALS
============================== */}

<CreateLeaseModal
  open={showCreateLease}
  onClose={() => setShowCreateLease(false)}
  onSuccess={loadPage}
/>

<CreateUtilityMeterModal
  open={showCreateMeter}
  workspaceId={unit.workspace_id}
  propertyId={unit.property.id}
  unitId={unit.id}
  onClose={() => setShowCreateMeter(false)}
  onCreated={loadPage}
/>

{selectedMeter && (

  <SetupUtilityMeterModal
    meter={selectedMeter}
    open={showSetupMeter}
    onClose={() => setShowSetupMeter(false)}
    onSaved={loadPage}
  />

)}

{selectedMeter && (

  <MeterReadingModal
    meter={selectedMeter}
    open={showReadingModal}
    onClose={() => setShowReadingModal(false)}
    onSaved={loadPage}
  />

)}

      </div>

    </AppShell>

  );

}
