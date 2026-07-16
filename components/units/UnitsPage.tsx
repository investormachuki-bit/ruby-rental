"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Home,
  CheckCircle,
  AlertCircle,
  Wrench,
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
import Button from "@/components/ui/Button";
import FilterBar from "@/components/ui/FilterBar";

import UnitsList from "@/components/units/UnitsList";
import UnitForm from "@/components/units/UnitForm";
import BulkUnitGenerator from "@/components/units/BulkUnitGenerator";

import { getUnits } from "@/services/units/getUnits";

import { Unit } from "@/types/unit";

export default function UnitsPage() {

  const [loading, setLoading] =
    useState(true);

  const [units, setUnits] =
    useState<Unit[]>([]);

  const [search, setSearch] =
    useState("");

  const [showUnitForm, setShowUnitForm] =
    useState(false);

  const [showBulkGenerator, setShowBulkGenerator] =
    useState(false);

  useEffect(() => {

    loadUnits();

  }, []);

  async function loadUnits() {

    try {

      setLoading(true);

      const data =
        await getUnits();

      setUnits(data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  }

  const filteredUnits =
    useMemo(() => {

      const keyword =
        search.toLowerCase();

      return units.filter((unit) => {

        return (

          unit.unit_number
            .toLowerCase()
            .includes(keyword) ||

          (unit.unit_type ?? "")
            .toLowerCase()
            .includes(keyword)

        );

      });

    }, [units, search]);

  const occupiedUnits =
    units.filter(
      (unit) =>
        unit.status === "Occupied"
    ).length;

  const vacantUnits =
    units.filter(
      (unit) =>
        unit.status === "Vacant"
    ).length;

  const maintenanceUnits =
    units.filter(
      (unit) =>
        unit.status === "Maintenance"
    ).length;
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
        title="Unit Management"
        description="Manage all rental units."
      >

        <div className="flex gap-3">

          <Button
            variant="secondary"
            onClick={() =>
              setShowBulkGenerator(true)
            }
          >

            <Layers3
              size={18}
              className="mr-2"
            />

            Bulk Generate

          </Button>

          <Button
            onClick={() =>
              setShowUnitForm(true)
            }
          >

            <Plus
              size={18}
              className="mr-2"
            />

            Add Unit

          </Button>

        </div>

      </PageHeader>

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
            title="Maintenance"
            value={maintenanceUnits}
            subtitle="Units under maintenance"
            valueClassName="text-red-600"
            icon={
              <Wrench className="h-6 w-6 text-red-600" />
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

              View and manage every rental unit across your portfolio.

            </p>

          </div>

          <FilterBar
            search={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search units..."
          />

          <div className="mt-6">

            {loading ? (

              <Loading
                title="Loading Units"
                description="Preparing your rental units..."
              />

            ) : (

              <UnitsList
                units={filteredUnits}
              />

            )}

          </div>

        </Card>

      </Section>
            {showUnitForm && (

        <UnitForm
          onSuccess={() => {
            setShowUnitForm(false);
            loadUnits();
          }}
          onCancel={() =>
            setShowUnitForm(false)
          }
        />

      )}

      {showBulkGenerator && (

        <BulkUnitGenerator
          onSuccess={() => {
            setShowBulkGenerator(false);
            loadUnits();
          }}
          onCancel={() =>
            setShowBulkGenerator(false)
          }
        />

      )}

    </PageContainer>

  </AppShell>

);
}
