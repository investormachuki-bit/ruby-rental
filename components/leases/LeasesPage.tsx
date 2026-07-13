"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import Breadcrumb from "@/components/common/Breadcrumb";
import CreateLeaseModal from "./CreateLeaseModal";

import { getLeases } from "@/services/leases/getLeases";
import { getProperties } from "@/services/properties/getAll";

type Lease = {
  id: string;

  lease_number: string;

  lease_type: "Open-ended" | "Fixed Term";

  start_date: string;

  end_date: string | null;

  rent_amount: number;

  rent_due_day: number;

  status: string;

  property: {
    id: string;
    name: string;
  };

  unit: {
    id: string;
    unit_number: string;
  };

  occupant: {
    id: string;
    first_name: string;
    last_name: string;
    phone_number?: string;
  };
};

type Property = {
  id: string;
  name: string;
};

export default function LeasesPage() {

  const [leases, setLeases] =
    useState<Lease[]>([]);

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

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {

    try {

      setLoading(true);

      const [leaseData, propertyData] =
        await Promise.all([
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
    const filteredLeases =
    useMemo(() => {

      return leases.filter((lease) => {

        const matchesSearch =

          lease.lease_number
            .toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||

          lease.property.name
            .toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||

          lease.unit.unit_number
            .toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||

          `${lease.occupant.first_name} ${lease.occupant.last_name}`
            .toLowerCase()
            .includes(
              search.toLowerCase()
            );

        const matchesStatus =
          status === "All" ||
          lease.status === status;

        const matchesProperty =
          property === "All" ||
          lease.property.id === property;

        const matchesLeaseType =
          leaseType === "All" ||
          lease.lease_type ===
            leaseType;

        return (
          matchesSearch &&
          matchesStatus &&
          matchesProperty &&
          matchesLeaseType
        );

      });

    }, [
      leases,
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

  const draftLeases =
    filteredLeases.filter(
      (lease) =>
        lease.status === "Draft"
    ).length;

  const endingSoon =
    filteredLeases.filter(
      (lease) => {

        if (
          !lease.end_date
        )
          return false;

        const end =
          new Date(
            lease.end_date
          );

        const today =
          new Date();

        const diff =
          Math.ceil(
            (
              end.getTime() -
              today.getTime()
            ) /
              (
                1000 *
                60 *
                60 *
                24
              )
          );

        return (
          diff >= 0 &&
          diff <= 30
        );

      }
    ).length;

  return (
    <>
      <div className="space-y-8">

        <Breadcrumb
          items={[
            {
              label:
                "Dashboard",
              href: "/",
            },
            {
              label:
                "Leases",
            },
          ]}
        />

        {/* Header */}

        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <h1 className="text-4xl font-bold">
              Leases
            </h1>

            <p className="mt-2 text-gray-500">
              Manage all active,
              draft and expired
              leases.
            </p>

          </div>

          <button
            onClick={() =>
              setShowModal(true)
            }
            className="rounded-xl bg-black px-6 py-3 font-semibold text-white hover:bg-gray-800"
          >
            + New Lease
          </button>

        </div>

        {/* Executive Cards */}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-2xl border bg-white p-5 shadow-sm">

            <p className="text-sm text-gray-500">
              Total Leases
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              {
                filteredLeases.length
              }
            </h2>

          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-sm">

            <p className="text-sm text-gray-500">
              Active
            </p>

            <h2 className="mt-2 text-3xl font-bold text-green-600">
              {activeLeases}
            </h2>

          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-sm">

            <p className="text-sm text-gray-500">
              Ending Soon
            </p>

            <h2 className="mt-2 text-3xl font-bold text-orange-500">
              {endingSoon}
            </h2>

          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-sm">

            <p className="text-sm text-gray-500">
              Monthly Rent
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              KSh{" "}
              {totalRent.toLocaleString()}
            </h2>

          </div>

        </div>
                {/* Filters */}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

          <input
            type="text"
            placeholder="Search lease..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="rounded-xl border bg-white p-3 outline-none focus:border-black"
          />

          <select
            value={property}
            onChange={(e) =>
              setProperty(e.target.value)
            }
            className="rounded-xl border bg-white p-3"
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
            className="rounded-xl border bg-white p-3"
          >
            <option value="All">
              All Statuses
            </option>

            <option value="Draft">
              Draft
            </option>

            <option value="Active">
              Active
            </option>

            <option value="Expired">
              Expired
            </option>

            <option value="Terminated">
              Terminated
            </option>

          </select>

          <select
            value={leaseType}
            onChange={(e) =>
              setLeaseType(e.target.value)
            }
            className="rounded-xl border bg-white p-3"
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

        {loading ? (

          <div className="rounded-2xl border bg-white p-12 text-center">

            <p className="text-gray-500">
              Loading leases...
            </p>

          </div>

        ) : filteredLeases.length === 0 ? (

          <div className="rounded-2xl border border-dashed bg-white p-12 text-center shadow-sm">

            <h2 className="text-2xl font-semibold">
              No Leases Found
            </h2>

            <p className="mt-3 text-gray-500">
              Create your first lease to begin managing tenancy.
            </p>

            <button
              onClick={() =>
                setShowModal(true)
              }
              className="mt-6 rounded-xl bg-black px-6 py-3 font-semibold text-white hover:bg-gray-800"
            >
              + Create Lease
            </button>

          </div>

        ) : (

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            {filteredLeases.map((lease) => (

              <div
                key={lease.id}
                className="overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >

                <div className="p-6">

                  <div className="flex items-start justify-between">

                    <div>

                      <h2 className="text-xl font-bold">
                        {lease.occupant.first_name}{" "}
                        {lease.occupant.last_name}
                      </h2>

                      <p className="mt-1 text-sm text-gray-500">
                        {lease.property.name}
                      </p>

                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        lease.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : lease.status === "Draft"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {lease.status}
                    </span>

                  </div>

                  <div className="mt-5 space-y-2 text-sm text-gray-600">

                    <p>
                      🏠 <strong>Unit:</strong>{" "}
                      {lease.unit.unit_number}
                    </p>

                    <p>
                      📄 <strong>Lease:</strong>{" "}
                      {lease.lease_number}
                    </p>

                    <p>
                      💰 <strong>Rent:</strong>{" "}
                      KSh {lease.rent_amount.toLocaleString()}
                    </p>

                    <p>
                      📅 <strong>Due Day:</strong>{" "}
                      {lease.rent_due_day}
                    </p>

                    <p>
                      📆 <strong>Start:</strong>{" "}
                      {lease.start_date}
                    </p>

                    <p>
                      ⏳ <strong>End:</strong>{" "}
                      {lease.end_date ?? "Open-ended"}
                    </p>

                  </div>

                </div>

                <div className="flex gap-3 border-t bg-gray-50 p-4">

                  <Link
                    href={`/leases/${lease.id}`}
                    className="flex-1 rounded-xl bg-black py-2.5 text-center font-medium text-white hover:bg-gray-800"
                  >
                    Open Lease
                  </Link>

                  <button className="rounded-xl border px-4 hover:bg-gray-100">
                    ⋮
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

      {showModal && (

        <CreateLeaseModal
          onSuccess={handleSuccess}
          onCancel={() =>
            setShowModal(false)
          }
        />

      )}

    </>
  );

}
