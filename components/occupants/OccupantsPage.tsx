"use client";

import { useEffect, useState } from "react";

import {
  Users,
  Home,
  DoorOpen,
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
import OccupantsTable from "@/components/occupants/OccupantsTable";

import { getOccupants } from "@/services/occupants/getOccupants";

export default function OccupantsPage() {

  const [occupants, setOccupants] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [
    showCreateModal,
    setShowCreateModal,
  ] = useState(false);

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    loadOccupants();
  }, []);

  async function loadOccupants() {

    try {

      setLoading(true);

      const data =
        await getOccupants();

      setOccupants(data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  }

  const filteredOccupants =
    occupants.filter((occupant) => {

      const keyword =
        search.toLowerCase();

      return (

        occupant.full_name
          ?.toLowerCase()
          .includes(keyword) ||

        occupant.phone
          ?.toLowerCase()
          .includes(keyword) ||

        occupant.occupant_code
          ?.toLowerCase()
          .includes(keyword)

      );

    });

  const activeOccupants =
    occupants.filter(
      (o) => o.status === "Active"
    ).length;

  const monthlyRent =
    occupants.reduce(
      (sum, o) =>
        sum +
        Number(
          o.monthly_rent ?? 0
        ),
      0
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
              label: "Occupants",
            },
          ]}
        />

        <PageHeader
          title="Occupants"
          description="Manage tenants and occupants."
        >

          <Button
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

        <Section>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">

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
              title="Vacant"
              value={
                occupants.length -
                activeOccupants
              }
              subtitle="Not assigned"
              valueClassName="text-amber-500"
              icon={
                <DoorOpen className="h-6 w-6 text-amber-500" />
              }
            />

            <StatCard
              title="Monthly Rent"
              value={`KSh ${monthlyRent.toLocaleString()}`}
              subtitle="Expected collections"
              icon={
                <DollarSign className="h-6 w-6 text-[#D4AF37]" />
              }
            />

          </div>

        </Section>

        <Section>

          <Card>

            <div className="mb-6">

              <h2 className="text-2xl font-bold">

                Occupants

              </h2>

              <p className="mt-2 text-gray-500">

                Search and manage all occupants.

              </p>

            </div>

            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search occupants..."
            />

            <div className="mt-6">

              {loading ? (

                <Loading
                  title="Loading Occupants"
                  description="Preparing occupant records..."
                />

              ) : filteredOccupants.length === 0 ? (

                <EmptyState
                  title="No Occupants Found"
                  description="Create your first occupant to start managing tenants."
                />

              ) : (

                <OccupantsTable
                  occupants={filteredOccupants}
                />

              )}

            </div>

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
