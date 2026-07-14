"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Users,
  Home,
  Building2,
  DollarSign,
  Plus,
} from "lucide-react";
import AppShell from "@/components/layout/AppShell";

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

import CreateOccupantModal from "@/components/occupants/CreateOccupantModal";
import OccupantsList from "@/components/occupants/OccupantsList";

import { getOccupants } from "@/services/occupants/getOccupants";

type Occupant = {
  id: string;
  occupant_code: string;
  full_name: string;
  phone: string;
  property_name?: string | null;
  unit_number?: string | null;
  move_in_date?: string | null;
  status: string;
  monthly_rent?: number;
};

export default function OccupantsPage() {
  const [occupants, setOccupants] =
    useState<Occupant[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [showCreateModal, setShowCreateModal] =
    useState(false);

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    loadOccupants();
  }, []);

  async function loadOccupants() {
    try {
      setLoading(true);

      const data = await getOccupants();

      setOccupants(data ?? []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const filteredOccupants = useMemo(() => {
    const keyword = search.toLowerCase();

    return occupants.filter((occupant) => {
      return (
        occupant.full_name
          ?.toLowerCase()
          .includes(keyword) ||

        occupant.phone
          ?.toLowerCase()
          .includes(keyword) ||

        occupant.occupant_code
          ?.toLowerCase()
          .includes(keyword) ||

        (occupant.property_name ?? "")
          .toLowerCase()
          .includes(keyword) ||

        (occupant.unit_number ?? "")
          .toLowerCase()
          .includes(keyword)
      );
    });
  }, [occupants, search]);

  const activeOccupants =
    occupants.filter(
      (o) => o.status === "Active"
    ).length;

  const unassignedOccupants =
    occupants.filter(
      (o) => !o.unit_number
    ).length;

  const expectedMonthlyRent =
    occupants.reduce(
      (sum, occupant) =>
        sum + (occupant.monthly_rent ?? 0),
      0
    );
    return (
  <AppShell>

    <PageContainer>
      <PageContainer>

        <Breadcrumb
          items={[
            {
              label: "Dashboard",
              href: "/",
            },
            {
              label: "Occupants",
            },
          ]}
        />

        <PageHeader
          title="Occupants"
          description="Manage tenants and occupants."
        >
          <Button
            variant="primary"
            onClick={() =>
              setShowCreateModal(true)
            }
          >
            <Plus
              size={18}
              className="mr-2"
            />

            New Occupant

          </Button>
        </PageHeader>

        {/* Summary Cards */}

        <Section>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">

            <StatCard
              title="Occupants"
              value={occupants.length}
              subtitle="Registered occupants"
              icon={
                <Users className="h-6 w-6 text-[#D4AF37]" />
              }
            />

            <StatCard
              title="Active"
              value={activeOccupants}
              subtitle="Currently occupying"
              valueClassName="text-green-600"
              icon={
                <Home className="h-6 w-6 text-green-600" />
              }
            />

            <StatCard
              title="Not Assigned"
              value={unassignedOccupants}
              subtitle="Without a unit"
              valueClassName="text-amber-500"
              icon={
                <Building2 className="h-6 w-6 text-amber-500" />
              }
            />

            <StatCard
              title="Monthly Rent"
              value={`KSh ${expectedMonthlyRent.toLocaleString()}`}
              subtitle="Expected collections"
              valueClassName="text-[#D4AF37]"
              icon={
                <DollarSign className="h-6 w-6 text-[#D4AF37]" />
              }
            />

          </div>

        </Section>
                {/* Occupants */}

        <Section>

          <Card>

            <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

              <div>

                <h2 className="text-2xl font-bold text-gray-900">

                  Occupants

                </h2>

                <p className="mt-2 text-gray-500">

                  Search and manage every occupant across your rental portfolio.

                </p>

              </div>

              <div className="w-full lg:w-96">

                <SearchInput
                  value={search}
                  onChange={setSearch}
                  placeholder="Search occupants..."
                />

              </div>

            </div>

            {loading ? (

              <Loading
                title="Loading Occupants"
                description="Preparing occupant records..."
              />

            ) : filteredOccupants.length === 0 ? (

              <EmptyState
                title="No Occupants Found"
                description={
                  search
                    ? "No occupants match your search."
                    : "Create your first occupant to start managing tenants."
                }
              />

            ) : (

              <OccupantsList
                occupants={filteredOccupants}
              />

            )}

          </Card>

        </Section>
                    </PageContainer>

      {showCreateModal && (

        <CreateOccupantModal
          onClose={() =>
            setShowCreateModal(false)
          }
          onSaved={() => {
            setShowCreateModal(false);
            loadOccupants();
          }}
        />

      )}

    </AppShell>

  );
}
