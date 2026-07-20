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

import CreateTenantModal from "@/components/tenants/CreateTenantModal";
import TenantsList from "@/components/tenants/TenantsList";

import { getTenants } from "@/services/tenants/getTenants";

type Tenant = {
  id: string;
  tenant_code: string;
  full_name: string;
  phone: string;
  property_name?: string | null;
  unit_number?: string | null;
  move_in_date?: string | null;
  status: string;
  monthly_rent?: number;
};

export default function TenantsPage() {
  const [tenants, setTenants] =
    useState<Tenant[]>([]);

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
    loadTenants();
  }, []);

  async function loadTenants() {
    try {
      setLoading(true);

      const data = await getTenants();

      setTenants(data ?? []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const filteredTenants = useMemo(() => {
    const keyword =
      search.toLowerCase();

    return tenants.filter((tenant) => {
      const matchesSearch =
        tenant.full_name
          ?.toLowerCase()
          .includes(keyword) ||
        tenant.phone
          ?.toLowerCase()
          .includes(keyword) ||
        tenant.tenant_code
          ?.toLowerCase()
          .includes(keyword) ||
        (tenant.property_name ?? "")
          .toLowerCase()
          .includes(keyword) ||
        (tenant.unit_number ?? "")
          .toLowerCase()
          .includes(keyword);

      const matchesStatus =
        status === "All" ||
        tenant.status === status;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    tenants,
    search,
    status,
  ]);

  const currentTenants =
    tenants.filter(
      (tenant) =>
        tenant.status === "Active"
    ).length;

  const formerTenants =
    tenants.filter(
      (tenant) =>
        tenant.status !== "Active"
    ).length;

  const unassignedTenants =
    tenants.filter(
      (tenant) =>
        !tenant.unit_number
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
              value={tenants.length}
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
                      setSearch(
                        e.target.value
                      )
                    }
                    className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 focus:border-[#D4AF37] focus:outline-none lg:w-80"
                  />
                </div>

                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(
                      e.target.value
                    )
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
            ) : filteredTenants.length ===
              0 ? (
              <EmptyState
                title="No Tenants Found"
                description={
                  search
                    ? "No tenants match your search."
                    : "Create your first tenant to start managing your rental portfolio."
                }
              />
            ) : (
              <TenantsList
                tenants={
                  filteredTenants
                }
              />
            )}
          </Card>
        </Section>
      </PageContainer>

      {showCreateModal && (
        <CreateTenantModal
          onClose={() =>
            setShowCreateModal(false)
          }
          onSaved={() => {
            setShowCreateModal(false);
            loadTenants();
          }}
        />
      )}
    </AppShell>
  );
}
