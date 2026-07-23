"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Home,
  Building2,
  CheckCircle,
  AlertCircle,
  Plus,
  Layers3,
} from "lucide-react";

import AppShell from "@/components/layout/AppShell";

import Breadcrumb from "@/components/common/Breadcrumb";

import PageContainer from "@/components/ui/PageContainer";
import PageHeader from "@/components/ui/PageHeader";
import Section from "@/components/ui/Section";
import StatCard from "@/components/ui/StatCard";
import Card from "@/components/ui/Card";
import Loading from "@/components/ui/Loading";

import UnitsList from "@/components/units/UnitsList";
import BulkUnitGenerator from "@/components/units/BulkUnitGenerator";

import { getUnits } from "@/services/units/getUnits";
import { getProperties } from "@/services/properties/getProperties";

import { Unit } from "@/types/unit";
import AddUnitModal from "@/components/units/AddUnitModal";

export default function UnitsPage() {

  const [loading, setLoading] =
    useState(true);

  const [units, setUnits] =
    useState<Unit[]>([]);

  const [properties, setProperties] =
    useState<any[]>([]);

  const [
    showBulkGenerator,
    setShowBulkGenerator,
  ] = useState(false);
  const [
  showAddUnit,
  setShowAddUnit,
] = useState(false);

  const [selectedUnit, setSelectedUnit] =
  useState<Unit | null>(null);

const [showCreateLease, setShowCreateLease] =
  useState(false);

  useEffect(() => {

    loadPage();

  }, []);

  async function loadPage() {

    try {

      setLoading(true);

      const [
        unitData,
        propertyData,
      ] = await Promise.all([

        getUnits(),

        getProperties(),

      ]);

      setUnits(unitData);

      setProperties(propertyData);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  }

  const occupiedUnits =
    useMemo(
      () =>
        units.filter(
          (unit) =>
            unit.status ===
            "Occupied"
        ).length,
      [units]
    );

  const vacantUnits =
    useMemo(
      () =>
        units.filter(
          (unit) =>
            unit.status ===
            "Vacant"
        ).length,
      [units]
    );

  const propertyCount =
    useMemo(
      () =>
        new Set(
          units.map(
            (unit) =>
              unit.property_id
          )
        ).size,
      [units]
    );
    return (

    <AppShell>

      <PageContainer>

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

        <PageHeader
          title="Units"
          description="Manage every rental unit across all your properties."
        >

          <div className="flex flex-wrap gap-3">

            <button
              onClick={() =>
                setShowBulkGenerator(true)
              }
              className="flex items-center gap-2 rounded-xl bg-black px-5 py-3 font-semibold text-white transition hover:bg-gray-800"
            >

              <Layers3
                className="h-5 w-5"
              />

              Bulk Generate

            </button>

            <button
  onClick={() =>
    setShowAddUnit(true)
  }
  className="flex items-center gap-2 rounded-xl border border-[#D4AF37] px-5 py-3 font-semibold text-[#D4AF37] transition hover:bg-[#D4AF37] hover:text-black"
>

              <Plus
                className="h-5 w-5"
              />

              Add Unit

            </button>

          </div>

        </PageHeader>

        <Section>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">

            <StatCard
              title="Total Units"
              value={units.length}
              subtitle="Registered units"
              icon={
                <Home className="h-6 w-6 text-[#D4AF37]" />
              }
            />

            <StatCard
              title="Occupied"
              value={occupiedUnits}
              subtitle="Currently occupied"
              valueClassName="text-green-600"
              icon={
                <CheckCircle className="h-6 w-6 text-green-600" />
              }
            />

            <StatCard
              title="Vacant"
              value={vacantUnits}
              subtitle="Ready for leasing"
              valueClassName="text-amber-500"
              icon={
                <AlertCircle className="h-6 w-6 text-amber-500" />
              }
            />

            <StatCard
              title="Properties"
              value={propertyCount}
              subtitle="With registered units"
              icon={
                <Building2 className="h-6 w-6 text-[#D4AF37]" />
              }
            />

          </div>

        </Section>

        <Section>

          <Card>

            <div className="mb-6">

              <h2 className="text-2xl font-bold text-gray-900">

                Rental Units

              </h2>

              <p className="mt-2 text-gray-500">

                View and manage all units across your portfolio.

              </p>

            </div>

            {loading ? (

              <Loading
                title="Loading Units"
                description="Preparing your rental units..."
              />

            ) : (

              <UnitsList
  units={units}
  onAssign={(unit) => {
    setSelectedUnit(unit);
    setShowCreateLease(true);
  }}
/>

            )}

          </Card>

        </Section>
                {/* Bulk Generator */}

        {showBulkGenerator && (

          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">

            <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white shadow-2xl">

              <div className="border-b p-6">

                <h2 className="text-3xl font-bold">

                  Bulk Unit Generator

                </h2>

                <p className="mt-2 text-gray-500">

                  Generate multiple rental units for one of your properties.

                </p>

              </div>

              <div className="p-6">

                <BulkUnitGenerator

                  properties={properties}

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

          </div>

        )}

        {showAddUnit && (

  <AddUnitModal

    open={showAddUnit}

    onClose={() =>
      setShowAddUnit(false)
    }

    onSuccess={() => {

      setShowAddUnit(false);

      loadPage();

    }}

  />

)}
        {showCreateLease && selectedUnit && (

  <CreateLeaseModal
    propertyId={selectedUnit.property_id}
    unitId={selectedUnit.id}
    onSuccess={() => {

      setShowCreateLease(false);
      setSelectedUnit(null);
      loadPage();

    }}
    onCancel={() => {

      setShowCreateLease(false);
      setSelectedUnit(null);

    }}
  />

)}

      </PageContainer>

    </AppShell>

  );

}
