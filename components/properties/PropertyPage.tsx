"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  Building2,
  Home,
  DollarSign,
  Plus,
} from "lucide-react";

import Breadcrumb from "@/components/common/Breadcrumb";

import PageContainer from "@/components/ui/PageContainer";
import PageHeader from "@/components/ui/PageHeader";
import Section from "@/components/ui/Section";
import StatCard from "@/components/ui/StatCard";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import SearchInput from "@/components/ui/SearchInput";
import Loading from "@/components/ui/Loading";
import EmptyState from "@/components/ui/EmptyState";

import { getProperties } from "@/services/properties/getAll";

import PropertyForm from "./PropertyForm";

type Property = {
  id: string;
  name: string;
  property_type: string;
  county: string | null;
  town: string | null;
  address: string | null;
  description: string | null;
  is_active: boolean;

  total_units: number;
  occupied_units: number;
  vacant_units: number;

  monthly_income: number;
  occupancy_rate: number;
};

export default function PropertyPage() {
  const [properties, setProperties] =
    useState<Property[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [showForm, setShowForm] =
    useState(false);

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    loadProperties();
  }, []);

  async function loadProperties() {
    try {
      setLoading(true);

      const data =
        await getProperties();

      setProperties(data ?? []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function handleSuccess() {
    setShowForm(false);
    loadProperties();
  }

  const filteredProperties =
    useMemo(() => {
      return properties.filter(
        (property) =>
          property.name
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          property.property_type
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          (property.county ?? "")
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          (property.town ?? "")
            .toLowerCase()
            .includes(search.toLowerCase())
      );
    }, [properties, search]);

  const totalMonthlyIncome =
    properties.reduce(
      (sum, property) =>
        sum + property.monthly_income,
      0
    );

  const totalUnits =
    properties.reduce(
      (sum, property) =>
        sum + property.total_units,
      0
    );

  const occupiedUnits =
    properties.reduce(
      (sum, property) =>
        sum + property.occupied_units,
      0
    );

  const vacantUnits =
    properties.reduce(
      (sum, property) =>
        sum + property.vacant_units,
      0
    );

  const overallOccupancy =
    totalUnits === 0
      ? 0
      : Math.round(
          (occupiedUnits /
            totalUnits) *
            100
        );

  return (
    <PageContainer>

      <Breadcrumb
        items={[
          {
            label: "Dashboard",
            href: "/",
          },
          {
            label: "Properties",
          },
        ]}
      />

      <PageHeader
        title="Properties"
        description="Manage all your rental properties."
      >
        <Button
          variant="primary"
          onClick={() =>
            setShowForm(true)
          }
        >
          <Plus
            size={18}
            className="mr-2"
          />

          New Property

        </Button>
      </PageHeader>

      <Section>
              <Section>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">

          <StatCard
            title="Properties"
            value={properties.length}
            subtitle="Registered properties"
            icon={
              <Building2 className="h-6 w-6 text-[#D4AF37]" />
            }
          />

          <StatCard
            title="Occupancy"
            value={`${overallOccupancy}%`}
            subtitle="Portfolio occupancy"
            icon={
              <Home className="h-6 w-6 text-green-600" />
            }
            valueClassName="text-green-600"
          />

          <StatCard
            title="Vacant Units"
            value={vacantUnits}
            subtitle="Available units"
            icon={
              <Home className="h-6 w-6 text-amber-500" />
            }
            valueClassName="text-amber-500"
          />

          <StatCard
            title="Monthly Income"
            value={`KSh ${totalMonthlyIncome.toLocaleString()}`}
            subtitle="Expected monthly income"
            icon={
              <DollarSign className="h-6 w-6 text-[#D4AF37]" />
            }
            valueClassName="text-[#D4AF37]"
          />

        </div>

      </Section>

      <Section>

        <Card>

          <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <h2 className="text-2xl font-bold text-gray-900">

                Property Portfolio

              </h2>

              <p className="mt-2 text-gray-500">

                Search and manage all your rental properties.

              </p>

            </div>

            <div className="w-full lg:w-96">

              <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="Search properties..."
              />

            </div>

          </div>

          {loading ? (

            <Loading
              title="Loading Properties"
              description="Preparing your property portfolio..."
            />

          ) : filteredProperties.length === 0 ? (

            <EmptyState
              title="No Properties Found"
              description={
                search
                  ? "No properties match your search."
                  : "Create your first property to start managing your rental portfolio."
              }
            />

          ) : (
                  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

              {filteredProperties.map(
                (property) => (

                  <Card
                    key={property.id}
                    className="overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:border-[#D4AF37] hover:shadow-xl"
                  >

                    <div className="flex items-start justify-between">

                      <div>

                        <h2 className="text-2xl font-bold text-gray-900">

                          {property.name}

                        </h2>

                        <p className="mt-1 text-sm text-gray-500">

                          {property.property_type}

                        </p>

                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          property.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {property.is_active
                          ? "Active"
                          : "Inactive"}
                      </span>

                    </div>

                    <div className="mt-6 space-y-3 text-sm text-gray-600">

                      <p>

                        <strong>County:</strong>{" "}

                        {property.county || "-"}

                      </p>

                      <p>

                        <strong>Town:</strong>{" "}

                        {property.town || "-"}

                      </p>

                      <p>

                        <strong>Address:</strong>{" "}

                        {property.address || "-"}

                      </p>

                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-6 border-t border-gray-100 pt-6">

                      <div>

                        <p className="text-xs uppercase tracking-wide text-gray-500">

                          Units

                        </p>

                        <p className="mt-2 text-3xl font-bold">

                          {property.total_units}

                        </p>

                      </div>

                      <div>

                        <p className="text-xs uppercase tracking-wide text-gray-500">

                          Occupied

                        </p>

                        <p className="mt-2 text-3xl font-bold text-green-600">

                          {property.occupied_units}

                        </p>

                      </div>

                      <div>

                        <p className="text-xs uppercase tracking-wide text-gray-500">

                          Vacant

                        </p>

                        <p className="mt-2 text-3xl font-bold text-amber-500">

                          {property.vacant_units}

                        </p>

                      </div>

                      <div>

                        <p className="text-xs uppercase tracking-wide text-gray-500">

                          Monthly Income

                        </p>

                        <p className="mt-2 text-lg font-bold text-[#D4AF37]">

                          KSh{" "}

                          {property.monthly_income.toLocaleString()}

                        </p>

                      </div>

                    </div>

                    <div className="mt-6">

                      <div className="mb-2 flex items-center justify-between">

                        <span className="text-sm text-gray-500">

                          Occupancy

                        </span>

                        <span className="font-semibold">

                          {property.occupancy_rate}%

                        </span>

                      </div>

                      <div className="h-3 overflow-hidden rounded-full bg-gray-200">

                        <div
                          className="h-full rounded-full bg-green-600 transition-all"
                          style={{
                            width: `${property.occupancy_rate}%`,
                          }}
                        />

                      </div>

                    </div>

                    <div className="mt-8 flex gap-3">

                      <Link
                        href={`/properties/${property.id}`}
                        className="flex-1"
                      >

                        <Button
                          variant="primary"
                          className="w-full rounded-2xl"
                        >

                          Open Property

                        </Button>

                      </Link>

                      <Button
                        variant="secondary"
                        className="rounded-2xl"
                      >

                        ⋮

                      </Button>

                    </div>

                  </Card>

                )
              )}

            </div>

          )}

        </Card>

      </Section>
             {/* Create Property Modal */}

      {showForm && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-gray-200 bg-white shadow-2xl">

            <div className="border-b border-gray-200 px-8 py-6">

              <h2 className="text-2xl font-bold text-gray-900">

                New Property

              </h2>

              <p className="mt-2 text-gray-500">

                Add a new property to your rental portfolio.

              </p>

            </div>

            <div className="p-8">

              <PropertyForm
                onSuccess={handleSuccess}
                onCancel={() =>
                  setShowForm(false)
                }
              />

            </div>

          </div>

        </div>

      )}

    </PageContainer>
  );
} 
