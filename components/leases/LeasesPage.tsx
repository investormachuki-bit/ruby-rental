"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import {
  FileText,
  CheckCircle,
  Clock,
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
import Loading from "@/components/ui/Loading";
import EmptyState from "@/components/ui/EmptyState";

import CreateLeaseModal from "./CreateLeaseModal";

import { getLeases } from "@/services/leases/getLeases";
import { getProperties } from "@/services/properties/getAll";

import type { LeaseDetails } from "@/types/lease";

type Property = {
  id: string;
  name: string;
};

export default function LeasesPage() {
  const [leases, setLeases] =
    useState<LeaseDetails[]>([]);

  const [properties, setProperties] =
    useState<Property[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [showModal, setShowModal] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("All");

  const [property, setProperty] =
    useState("All");

  const [leaseType, setLeaseType] =
    useState("All");

  // NEW
  const [tab, setTab] =
    useState<"Current" | "History">("Current");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);

      const [
        leaseData,
        propertyData,
      ] = await Promise.all([
        getLeases(),
        getProperties(),
      ]);

      setLeases(leaseData);
      setProperties(propertyData ?? []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function handleSuccess() {
    setShowModal(false);
    loadData();
  }

  const filteredLeases = useMemo(() => {
    return leases.filter((lease) => {
      // Current vs History
      const matchesTab =
        tab === "Current"
          ? lease.status === "Active" ||
            lease.status === "Draft"
          : lease.status === "Renewed" ||
            lease.status === "Expired" ||
            lease.status === "Terminated";

      if (!matchesTab) return false;

      const matchesSearch =
        lease.lease_number
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        lease.property.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        lease.unit.unit_number
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        lease.tenant.full_name
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        status === "All" ||
        lease.status === status;

      const matchesProperty =
        property === "All" ||
        lease.property.id === property;

      const matchesLeaseType = true;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesProperty &&
        matchesLeaseType
      );
    });
  }, [
    leases,
    tab,
    search,
    status,
    property,
    leaseType,
  ]);

  const totalRent =
    filteredLeases.reduce(
      (sum, lease) =>
        sum + lease.rent_amount,
      0
    );

  const activeLeases =
    filteredLeases.filter(
      (lease) =>
        lease.status === "Active"
    ).length;

  const endingSoon =
    filteredLeases.filter((lease) => {
      if (!lease.move_out_date)
        return false;

      const end = new Date(
        lease.move_out_date
      );

      const today = new Date();

      const diff = Math.ceil(
        (end.getTime() -
          today.getTime()) /
          (1000 * 60 * 60 * 24)
      );

      return diff >= 0 && diff <= 30;
    }).length;
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
            label: "Leases",
          },
        ]}
      />

      <PageHeader
        title="Leases"
        description={
          tab === "Current"
            ? "Manage current active and draft leases."
            : "Browse historical lease records."
        }
      >

        <Button
          onClick={() =>
            setShowModal(true)
          }
        >

          <Plus
            size={18}
            className="mr-2"
          />

          New Lease

        </Button>

      </PageHeader>

      {/* Summary Cards */}

      <Section>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">

          <StatCard
            title={
              tab === "Current"
                ? "Current Leases"
                : "Historical Leases"
            }
            value={filteredLeases.length}
            subtitle={
              tab === "Current"
                ? "Active & Draft"
                : "Renewed, Expired & Terminated"
            }
            icon={
              <FileText className="h-6 w-6 text-[#D4AF37]" />
            }
          />

          <StatCard
            title="Active"
            value={activeLeases}
            subtitle="Currently active"
            valueClassName="text-green-600"
            icon={
              <CheckCircle className="h-6 w-6 text-green-600" />
            }
          />

          <StatCard
            title="Ending Soon"
            value={endingSoon}
            subtitle="Within 30 days"
            valueClassName="text-amber-500"
            icon={
              <Clock className="h-6 w-6 text-amber-500" />
            }
          />

          <StatCard
            title="Monthly Rent"
            value={`KSh ${totalRent.toLocaleString()}`}
            subtitle="Expected collections"
            valueClassName="text-[#D4AF37]"
            icon={
              <DollarSign className="h-6 w-6 text-[#D4AF37]" />
            }
          />

        </div>

      </Section>

      {/* Lease Portfolio */}

      <Section>

        <Card>

          <div className="mb-6">

            <h2 className="text-2xl font-bold text-gray-900">

              Lease Portfolio

            </h2>

            <p className="mt-2 text-gray-500">

              {tab === "Current"
                ? "Manage your current lease portfolio."
                : "Review previous lease contracts and history."}

            </p>

            <div className="mt-6 flex w-fit overflow-hidden rounded-xl border border-gray-200">

              <button
                onClick={() =>
                  setTab("Current")
                }
                className={`px-6 py-3 text-sm font-semibold transition ${
                  tab === "Current"
                    ? "bg-black text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >

                Current

              </button>

              <button
                onClick={() =>
                  setTab("History")
                }
                className={`px-6 py-3 text-sm font-semibold transition ${
                  tab === "History"
                    ? "bg-black text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >

                History

              </button>

            </div>

          </div>

                    {/* Filters */}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

            <input
              type="text"
              placeholder={
                tab === "Current"
                  ? "Search current lease, tenant, property or unit..."
                  : "Search lease history..."
              }
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="rounded-xl border border-gray-200 bg-white p-3 outline-none transition focus:border-black"
            />

            <select
              value={property}
              onChange={(e) =>
                setProperty(e.target.value)
              }
              className="rounded-xl border border-gray-200 bg-white p-3"
            >

              <option value="All">
                All Properties
              </option>

              {properties.map((property) => (

                <option
                  key={property.id}
                  value={property.id}
                >
                  {property.name}
                </option>

              ))}

            </select>

            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
              className="rounded-xl border border-gray-200 bg-white p-3"
            >

              <option value="All">
                All Statuses
              </option>

              {tab === "Current" ? (
                <>
                  <option value="Draft">
                    Draft
                  </option>

                  <option value="Active">
                    Active
                  </option>
                </>
              ) : (
                <>
                  <option value="Renewed">
                    Renewed
                  </option>

                  <option value="Expired">
                    Expired
                  </option>

                  <option value="Terminated">
                    Terminated
                  </option>
                </>
              )}

            </select>

            <select
              value={leaseType}
              onChange={(e) =>
                setLeaseType(e.target.value)
              }
              className="rounded-xl border border-gray-200 bg-white p-3"
            >

              <option value="All">
                All Lease Types
              </option>

              <option value="Open-ended">
                Open-ended
              </option>

              <option value="Fixed Term">
                Fixed Term
              </option>

            </select>

          </div>

          <div className="mt-8">

  {loading ? (

    <Loading
      title="Loading Leases"
      description="Preparing lease portfolio..."
    />

  ) : filteredLeases.length === 0 ? (

    <EmptyState
      title={
        tab === "Current"
          ? "No Current Leases"
          : "No Historical Leases"
      }
      description={
        tab === "Current"
          ? "Create your first lease to begin managing tenants."
          : "Historical leases will appear here after renewal, expiry or termination."
      }
    />

  ) : (

    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

      {filteredLeases.map((lease) => (

        <Card
          key={lease.id}
          className="overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-[#D4AF37] hover:shadow-xl"
        >

          <div className="flex items-start justify-between">

            <div>

              <h2 className="text-xl font-bold text-gray-900">
                {lease.tenant.full_name}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {lease.lease_number}
              </p>

            </div>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                lease.status === "Active"
                  ? "bg-green-100 text-green-700"
                  : lease.status === "Draft"
                  ? "bg-gray-100 text-gray-700"
                  : lease.status === "Renewed"
                  ? "bg-blue-100 text-blue-700"
                  : lease.status === "Expired"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {lease.status}
            </span>

          </div>

          <div className="mt-6 space-y-3 text-sm text-gray-600">

            <p>
              🏢 <strong>Property:</strong>{" "}
              {lease.property.name}
            </p>

            <p>
              🏠 <strong>Unit:</strong>{" "}
              {lease.unit.unit_number}
            </p>

            <p>
              💰 <strong>Rent:</strong>{" "}
              KSh {lease.rent_amount.toLocaleString()}
            </p>

            <p>
              📅 <strong>Due Day:</strong>{" "}
              {lease.rent_due_day ?? lease.billing_day}
            </p>

            <p>
              📆 <strong>Period:</strong>{" "}
              {lease.start_date ?? lease.move_in_date}
              {" → "}
              {lease.end_date ??
                lease.move_out_date ??
                "Open-ended"}
            </p>

          </div>

          <div className="mt-8 flex gap-3">

            <Link
              href={`/leases/${lease.id}`}
              className="flex-1"
            >

              <Button
                variant="primary"
                className="w-full"
              >

                {tab === "Current"
                  ? "Open Lease"
                  : "View History"}

              </Button>

            </Link>

            {tab === "Current" && (

              <Button
                variant="secondary"
              >
                ⋮
              </Button>

            )}

          </div>

        </Card>

      ))}

    </div>

  )}

</div>

</Card>

</Section>

</PageContainer>

{showModal && (

  <CreateLeaseModal
    onSuccess={handleSuccess}
    onCancel={() =>
      setShowModal(false)
    }
  />

)}

</AppShell>

);

}
