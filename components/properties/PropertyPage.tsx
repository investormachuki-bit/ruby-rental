"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  Building2,
  Home,
  DollarSign,
  Plus,
  Pencil,
  Archive,
  Trash2,
} from "lucide-react";

import AppShell from "@/components/layout/AppShell";

import Breadcrumb from "@/components/common/Breadcrumb";

import PageContainer from "@/components/ui/PageContainer";
import PageHeader from "@/components/ui/PageHeader";
import Section from "@/components/ui/Section";
import StatCard from "@/components/ui/StatCard";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import FilterBar from "@/components/ui/FilterBar";
import Select from "@/components/ui/Select";
import Badge from "@/components/ui/Badge";
import Loading from "@/components/ui/Loading";
import EmptyState from "@/components/ui/EmptyState";
import Modal from "@/components/ui/Modal";
import ActionMenu from "@/components/ui/ActionMenu";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

import { getProperties } from "@/services/properties/getAll";
import { archiveProperty } from "@/services/properties/update";
import { deleteProperty } from "@/services/properties/delete";

import { Property } from "@/types/property";

import PropertyForm from "./PropertyForm";

type PropertyListItem = {
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

const PROPERTY_TYPE_OPTIONS = [
  { label: "All Types", value: "All" },
  { label: "Apartment", value: "Apartment" },
  { label: "Residential", value: "Residential" },
  { label: "Commercial", value: "Commercial" },
  { label: "Mixed Use", value: "Mixed Use" },
];

const STATUS_OPTIONS = [
  { label: "All Statuses", value: "All" },
  { label: "Active", value: "Active" },
  { label: "Archived", value: "Archived" },
];

export default function PropertyPage() {
  const [properties, setProperties] =
    useState<PropertyListItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [showCreateForm, setShowCreateForm] =
    useState(false);

  const [editingProperty, setEditingProperty] =
    useState<Property | null>(null);

  const [archivingProperty, setArchivingProperty] =
    useState<PropertyListItem | null>(null);

  const [deletingProperty, setDeletingProperty] =
    useState<PropertyListItem | null>(null);

  const [actionLoading, setActionLoading] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [typeFilter, setTypeFilter] =
    useState("All");

  const [statusFilter, setStatusFilter] =
    useState("All");

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

  function handleFormSuccess() {
    setShowCreateForm(false);
    setEditingProperty(null);
    loadProperties();
  }

  function closeFormModal() {
    setShowCreateForm(false);
    setEditingProperty(null);
  }

  function toProperty(
    item: PropertyListItem
  ): Property {
    return {
      id: item.id,
      workspace_id: "",
      name: item.name,
      property_type: item.property_type,
      county: item.county,
      town: item.town,
      address: item.address,
      description: item.description,
      is_active: item.is_active,
      created_at: "",
      updated_at: "",
    };
  }

  async function handleArchive() {
    if (!archivingProperty) return;

    try {
      setActionLoading(true);

      await archiveProperty(
        archivingProperty.id
      );

      setArchivingProperty(null);
      loadProperties();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to archive property.";

      alert(message);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDelete() {
    if (!deletingProperty) return;

    try {
      setActionLoading(true);

      await deleteProperty(
        deletingProperty.id
      );

      setDeletingProperty(null);
      loadProperties();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to delete property.";

      alert(message);
    } finally {
      setActionLoading(false);
    }
  }

  const filteredProperties =
    useMemo(() => {
      const keyword =
        search.toLowerCase();

      return properties.filter(
        (property) => {
          const matchesSearch =
            !keyword ||
            property.name
              .toLowerCase()
              .includes(keyword) ||
            property.property_type
              .toLowerCase()
              .includes(keyword) ||
            (property.county ?? "")
              .toLowerCase()
              .includes(keyword) ||
            (property.town ?? "")
              .toLowerCase()
              .includes(keyword) ||
            (property.address ?? "")
              .toLowerCase()
              .includes(keyword);

          const matchesType =
            typeFilter === "All" ||
            property.property_type ===
              typeFilter;

          const matchesStatus =
            statusFilter === "All" ||
            (statusFilter === "Active" &&
              property.is_active) ||
            (statusFilter === "Archived" &&
              !property.is_active);

          return (
            matchesSearch &&
            matchesType &&
            matchesStatus
          );
        }
      );
    }, [
      properties,
      search,
      typeFilter,
      statusFilter,
    ]);

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
          (occupiedUnits / totalUnits) * 100
        );

  const formOpen =
    showCreateForm ||
    editingProperty !== null;

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
              setShowCreateForm(true)
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

            <div className="mb-6">

              <h2 className="text-2xl font-bold text-gray-900">

                Property Portfolio

              </h2>

              <p className="mt-2 text-gray-500">

                Search and manage all your rental properties.

              </p>

            </div>

            <FilterBar
              search={search}
              onSearchChange={setSearch}
              searchPlaceholder="Search properties..."
              filters={
                <>
                  <Select
                    value={typeFilter}
                    onChange={(e) =>
                      setTypeFilter(
                        e.target.value
                      )
                    }
                    options={
                      PROPERTY_TYPE_OPTIONS
                    }
                    className="min-w-[160px]"
                  />

                  <Select
                    value={statusFilter}
                    onChange={(e) =>
                      setStatusFilter(
                        e.target.value
                      )
                    }
                    options={STATUS_OPTIONS}
                    className="min-w-[160px]"
                  />
                </>
              }
            />

            <div className="mt-6">

              {loading ? (

                <Loading
                  title="Loading Properties"
                  description="Preparing your property portfolio..."
                />

              ) : filteredProperties.length === 0 ? (

                <EmptyState
                  title="No Properties Found"
                  description={
                    search ||
                    typeFilter !== "All" ||
                    statusFilter !== "All"
                      ? "No properties match your search or filters."
                      : "Create your first property to start managing your rental portfolio."
                  }
                />

              ) : (

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

                  {filteredProperties.map((property) => (

                    <Card
                      key={property.id}
                      className="transition-all duration-200 hover:-translate-y-1 hover:border-[#D4AF37] hover:shadow-xl"
                    >

                      <div className="flex items-start justify-between gap-3">

                        <div>

                          <h2 className="text-2xl font-bold text-gray-900">

                            {property.name}

                          </h2>

                          <p className="mt-1 text-sm text-gray-500">

                            {property.property_type}

                          </p>

                        </div>

                        <div className="flex items-center gap-2">

                          <Badge
                            variant={
                              property.is_active
                                ? "success"
                                : "danger"
                            }
                          >

                            {property.is_active
                              ? "Active"
                              : "Archived"}

                          </Badge>

                          <ActionMenu
                            actions={[
                              {
                                label: "Edit",
                                icon: (
                                  <Pencil size={16} />
                                ),
                                onClick: () =>
                                  setEditingProperty(
                                    toProperty(
                                      property
                                    )
                                  ),
                              },
                              ...(property.is_active
                                ? [
                                    {
                                      label:
                                        "Archive",
                                      icon: (
                                        <Archive
                                          size={16}
                                        />
                                      ),
                                      onClick: () =>
                                        setArchivingProperty(
                                          property
                                        ),
                                    },
                                  ]
                                : []),
                              {
                                label: "Delete",
                                icon: (
                                  <Trash2
                                    size={16}
                                  />
                                ),
                                danger: true,
                                onClick: () =>
                                  setDeletingProperty(
                                    property
                                  ),
                              },
                            ]}
                          />

                        </div>

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

                      <div className="mt-8">

                        <Link
                          href={`/properties/${property.id}`}
                          className="block"
                        >

                          <Button
                            variant="primary"
                            className="w-full rounded-2xl"
                          >

                            Open Property

                          </Button>

                        </Link>

                      </div>

                    </Card>

                  ))}

                </div>

              )}

            </div>

          </Card>

        </Section>

        <Modal
          open={formOpen}
          title={
            editingProperty
              ? "Edit Property"
              : "New Property"
          }
          description={
            editingProperty
              ? "Update property details."
              : "Add a new property to your rental portfolio."
          }
          onClose={closeFormModal}
          size="lg"
        >
          <PropertyForm
            property={
              editingProperty ?? undefined
            }
            onSuccess={handleFormSuccess}
            onCancel={closeFormModal}
          />
        </Modal>

        <ConfirmDialog
          open={archivingProperty !== null}
          title="Archive Property"
          message={`Archive "${archivingProperty?.name}"? It will be marked inactive but remain in your records.`}
          confirmText="Archive"
          loading={actionLoading}
          onConfirm={handleArchive}
          onCancel={() =>
            setArchivingProperty(null)
          }
        />

        <ConfirmDialog
          open={deletingProperty !== null}
          title="Delete Property"
          message={`Permanently delete "${deletingProperty?.name}"? This action cannot be undone.`}
          confirmText="Delete"
          loading={actionLoading}
          onConfirm={handleDelete}
          onCancel={() =>
            setDeletingProperty(null)
          }
        />

      </PageContainer>

    </AppShell>
  );
}
