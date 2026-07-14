"use client";

import { useEffect, useState } from "react";

import {
  Home,
  Building2,
  CheckCircle,
  AlertCircle,
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

  const occupiedUnits =
    units.filter(
      (unit) => unit.status === "Occupied"
    ).length;

  const vacantUnits =
    units.filter(
      (unit) => unit.status === "Vacant"
    ).length;

  const propertyCount =
    new Set(
      units.map(
        (unit) => unit.property_id
      )
    ).size;

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
          description="View and manage all rental units."
        />

        {/* Summary */}

        <Section>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">

            <StatCard
              title="Total Units"
              value={units.length}
              subtitle="Registered rental units"
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
              subtitle="Available for leasing"
              valueClassName="text-amber-500"
              icon={
                <AlertCircle className="h-6 w-6 text-amber-500" />
              }
            />

            <StatCard
              title="Properties"
              value={propertyCount}
              subtitle="Properties with units"
              icon={
                <Building2 className="h-6 w-6 text-[#D4AF37]" />
              }
            />

          </div>

        </Section>

        {/* Units */}

        <Section>

          <Card>

            <div className="mb-6">

              <h2 className="text-2xl font-bold text-gray-900">

                Rental Units

              </h2>

              <p className="mt-2 text-gray-500">

                View and manage every rental unit across your portfolio.

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
              />

            )}

          </Card>

        </Section>

      </PageContainer>

    </AppShell>
  );
}
