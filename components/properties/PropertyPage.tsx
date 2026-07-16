"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  Building2,
  Home,
  Plus,
  Pencil,
  Archive,
  Eye,
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

import { Property } from "@/types/property";

import PropertyForm from "./PropertyForm";

type PropertyListItem = {
  id: string;
  code?: string;

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
};

const PROPERTY_TYPE_OPTIONS = [
  {
    label: "All Types",
    value: "All",
  },
  {
    label: "Apartment",
    value: "Apartment",
  },
  {
    label: "Residential",
    value: "Residential",
  },
  {
    label: "Commercial",
    value: "Commercial",
  },
  {
    label: "Mixed Use",
    value: "Mixed Use",
  },
];

const STATUS_OPTIONS = [
  {
    label: "All Statuses",
    value: "All",
  },
  {
    label: "Active",
    value: "Active",
  },
  {
    label: "Archived",
    value: "Archived",
  },
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

  const [actionLoading, setActionLoading] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [typeFilter, setTypeFilter] =
    useState("All");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [townFilter, setTownFilter] =
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

      property_type:
        item.property_type,

      county: item.county,

      town: item.town,

      address: item.address,

      description:
        item.description,

      is_active:
        item.is_active,

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
      alert(
        error instanceof Error
          ? error.message
          : "Unable to archive property."
      );
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
            (property.code ?? "")
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

          const matchesTown =
            townFilter === "All" ||
            property.town === townFilter;

          return (
            matchesSearch &&
            matchesType &&
            matchesStatus &&
            matchesTown
          );
        }
      );
    }, [
      properties,
      search,
      typeFilter,
      statusFilter,
      townFilter,
    ]);

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

  const townOptions = [
    {
      label: "All Towns",
      value: "All",
    },
    ...Array.from(
      new Set(
        properties
          .map((p) => p.town)
          .filter(Boolean)
      )
    ).map((town) => ({
      label: town as string,
      value: town as string,
    })),
  ];

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
        title="Property Management"
        description="Manage all your rental properties."
      >

        <Button
          onClick={() =>
            setShowCreateForm(true)
          }
        >
          <Plus
            size={18}
            className="mr-2"
          />

          Add Property

        </Button>

      </PageHeader>

      <Section>
<div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

  <StatCard
    title="Properties"
    value={properties.length}
    subtitle="Registered Properties"
    icon={
      <Building2 className="h-6 w-6 text-[#D4AF37]" />
    }
  />

  <StatCard
    title="Total Units"
    value={totalUnits}
    subtitle="Units Across Portfolio"
    icon={
      <Home className="h-6 w-6 text-blue-600" />
    }
  />

  <StatCard
    title="Occupied Units"
    value={occupiedUnits}
    subtitle="Currently Occupied"
    icon={
      <Home className="h-6 w-6 text-green-600" />
    }
    valueClassName="text-green-600"
  />

  <StatCard
    title="Vacant Units"
    value={vacantUnits}
    subtitle="Available Units"
    icon={
      <Home className="h-6 w-6 text-amber-500" />
    }
    valueClassName="text-amber-500"
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

              Search and manage your rental properties.

            </p>

          </div>

          <FilterBar
            search={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search by name, code or town..."
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
                  className="min-w-[170px]"
                />

                <Select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(
                      e.target.value
                    )
                  }
                  options={STATUS_OPTIONS}
                  className="min-w-[170px]"
                />

                <Select
                  value={townFilter}
                  onChange={(e) =>
                    setTownFilter(
                      e.target.value
                    )
                  }
                  options={townOptions}
                  className="min-w-[170px]"
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
                description="Create your first property to start managing your portfolio."
              />

            ) : (

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filteredProperties.map((property) => (

  <Card
    key={property.id}
    className="transition-all duration-200 hover:-translate-y-1 hover:border-[#D4AF37] hover:shadow-xl"
  >

    <div className="flex items-start justify-between">

      <div>

        <h2 className="text-xl font-bold text-gray-900">
          {property.name}
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          {property.code ?? "No Code"}
        </p>

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
      label: "View",
      icon: <Eye size={16} />,
      onClick: () => {
        window.location.href = `/properties/${property.id}`;
      },
    },
    {
      label: "Edit",
      icon: <Pencil size={16} />,
      onClick: () =>
        setEditingProperty(
          toProperty(property)
        ),
    },
    {
      label: "Archive",
      icon: <Archive size={16} />,
      onClick: () =>
        setArchivingProperty(property),
    },
  ]}
/>

      </div>

    </div>

    <div className="mt-5 space-y-3">

  <div>

    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
      Property Code
    </p>

    <p className="mt-1 font-medium text-gray-900">
      {property.code ?? "PROP-0001"}
    </p>

  </div>

  <div>

    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
      Location
    </p>

    <p className="mt-1 text-gray-700">
      {property.address || "-"}
    </p>

    <p className="text-sm text-gray-500">
      {[property.town, property.county]
        .filter(Boolean)
        .join(", ")}
    </p>

  </div>

</div>
<div className="mt-6 grid grid-cols-3 gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-5">

  <div className="text-center">

    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
      Units
    </p>

    <p className="mt-2 text-3xl font-bold text-gray-900">
      {property.total_units}
    </p>

  </div>

  <div className="text-center border-x border-gray-200">

    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
      Occupied
    </p>

    <p className="mt-2 text-3xl font-bold text-green-600">
      {property.occupied_units}
    </p>

  </div>

  <div className="text-center">

    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
      Vacant
    </p>

    <p className="mt-2 text-3xl font-bold text-amber-500">
      {property.vacant_units}
    </p>

  </div>

</div>

    <div className="mt-6">

      <Link
        href={`/properties/${property.id}`}
      >

        <Button
          fullWidth
        >

          View Property

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
            : "Add Property"
        }
        description={
          editingProperty
            ? "Update property details."
            : "Create a new property."
        }
        onClose={closeFormModal}
        size="lg"
      >

        <PropertyForm
          property={
            editingProperty ??
            undefined
          }
          onSuccess={
            handleFormSuccess
          }
          onCancel={
            closeFormModal
          }
        />

      </Modal>

      <ConfirmDialog
        open={
          archivingProperty !==
          null
        }
        title="Archive Property"
        message={`Archive "${archivingProperty?.name}"?`}
        confirmText="Archive"
        loading={actionLoading}
        onConfirm={handleArchive}
        onCancel={() =>
          setArchivingProperty(
            null
          )
        }
      />

    </PageContainer>

  </AppShell>

);
}
