"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Users,
  Home,
  UserMinus,
  Building2,
  Plus,
  Search,
} from "lucide-react";

import AppShell from "@/components/layout/AppShell";

import Breadcrumb from "@/components/common/Breadcrumb";

import PageContainer from "@/components/ui/PageContainer";
import PageHeader from "@/components/ui/PageHeader";
import Section from "@/components/ui/Section";
import StatCard from "@/components/ui/StatCard";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Loading from "@/components/ui/Loading";
import EmptyState from "@/components/ui/EmptyState";

import CreateOccupantModal from "@/components/occupants/CreateOccupantModal";
import OccupantsList from "@/components/occupants/OccupantsList";
import { getTenants } from "@/services/tenants/getTenants";

type Occupant = {
  id: string;
  occupant_code: string;
  full_name: string;
  phone: string;
  property_name?: string | null;
  unit_number?: string |null;
  move_in_date?: string | null;
  status: string;
  monthly_rent?: number;
};

export default function OccupantsPage() {

  const [occupants, setOccupants] =
    useState<Occupant[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [
    showCreateModal,
    setShowCreateModal,
  ] = useState(false);

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("All");

  useEffect(() => {
    loadOccupants();
  }, []);

  async function loadOccupants() {

    try {

      setLoading(true);

      const data =
  await getTenants();

      setOccupants(data ?? []);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  }

  const filteredOccupants =
    useMemo(() => {

      const keyword =
        search.toLowerCase();

      return occupants.filter((occupant) => {

        const matchesSearch =

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
            .includes(keyword);

        const matchesStatus =

          status === "All" ||

          occupant.status === status;

        return (
          matchesSearch &&
          matchesStatus
        );

      });

    }, [
      occupants,
      search,
      status,
    ]);

  const currentTenants =
    occupants.filter(
      (o) => o.status === "Active"
    ).length;

  const formerTenants =
    occupants.filter(
      (o) => o.status !== "Active"
    ).length;

  const unassignedTenants =
    occupants.filter(
      (o) => !o.unit_number
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
              label: "Tenants",
            },
          ]}
        />

        <PageHeader
          title="Tenants"
          description="Manage tenants across your rental portfolio."
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

            New Tenant

          </Button>

        </PageHeader>

        {/* Summary */}

        <Section>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">

            <StatCard
              title="Total Tenants"
              value={occupants.length}
              subtitle="Registered tenants"
              icon={
                <Users className="h-6 w-6 text-[#D4AF37]" />
              }
            />

            <StatCard
              title="Current"
              value={currentTenants}
              subtitle="Currently occupying units"
              valueClassName="text-green-600"
              icon={
                <Home className="h-6 w-6 text-green-600" />
              }
            />

            <StatCard
              title="Former"
              value={formerTenants}
              subtitle="Previous tenants"
              valueClassName="text-blue-600"
              icon={
                <UserMinus className="h-6 w-6 text-blue-600" />
              }
            />

            <StatCard
              title="Unassigned"
              value={unassignedTenants}
              subtitle="No active lease"
              valueClassName="text-amber-500"
              icon={
                <Building2 className="h-6 w-6 text-amber-500" />
              }
            />

          </div>

        </Section>
                {/* Tenants */}

        <Section>

          <Card>

            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

              <div>

                <h2 className="text-2xl font-bold text-gray-900">

                  Tenants

                </h2>

                <p className="mt-2 text-gray-500">

                  Search and manage every tenant across your rental portfolio.

                </p>

              </div>

              <div className="flex flex-col gap-3 sm:flex-row">

                <div className="relative">

                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    placeholder="Search tenant..."
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                    className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 focus:border-[#D4AF37] focus:outline-none lg:w-80"
                  />

                </div>

                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value)
                  }
                  className="rounded-xl border border-gray-300 bg-white px-4 py-3 focus:border-[#D4AF37] focus:outline-none"
                >

                  <option value="All">

                    All Tenants

                  </option>

                  <option value="Active">

                    Current

                  </option>

                  <option value="Inactive">

                    Former

                  </option>

                </select>

              </div>

            </div>

            {loading ? (

              <Loading
                title="Loading Tenants"
                description="Preparing tenant records..."
              />

            ) : filteredOccupants.length === 0 ? (

              <EmptyState
                title="No Tenants Found"
                description={
                  search
                    ? "No tenants match your search."
                    : "Create your first tenant to start managing your rental portfolio."
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
