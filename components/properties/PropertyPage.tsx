"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import Breadcrumb from "@/components/common/Breadcrumb";
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
            .includes(
              search.toLowerCase()
            ) ||
          property.property_type
            .toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||
          (property.town ?? "")
            .toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||
          (property.county ?? "")
            .toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );
    }, [properties, search]);

  return (
    <>
      <div className="space-y-8">

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

        {/* Header */}

        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <h1 className="text-4xl font-bold text-gray-900">
              Properties
            </h1>

            <p className="mt-2 text-gray-500">
              Manage all your rental properties.
            </p>

          </div>

          <button
            onClick={() =>
              setShowForm(true)
            }
            className="rounded-xl bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800"
          >
            + New Property
          </button>

        </div>

        {/* Executive Summary */}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-2xl border bg-white p-5 shadow-sm">

            <p className="text-sm text-gray-500">
              Properties
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              {properties.length}
            </h2>

          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-sm">

            <p className="text-sm text-gray-500">
              Active
            </p>

            <h2 className="mt-2 text-3xl font-bold text-green-600">
              {
                properties.filter(
                  (p) => p.is_active
                ).length
              }
            </h2>

          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-sm">

            <p className="text-sm text-gray-500">
              Inactive
            </p>

            <h2 className="mt-2 text-3xl font-bold text-red-600">
              {
                properties.filter(
                  (p) => !p.is_active
                ).length
              }
            </h2>

          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-sm">

            <p className="text-sm text-gray-500">
              Portfolio
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              100%
            </h2>

          </div>

        </div>

        {/* Search */}

        <input
          type="text"
          placeholder="Search properties..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full rounded-xl border bg-white p-3 outline-none focus:border-black"
        />
                {/* Loading */}

        {loading ? (

          <div className="rounded-2xl border bg-white p-10 text-center shadow-sm">

            <p className="text-gray-500">
              Loading properties...
            </p>

          </div>

        ) : filteredProperties.length === 0 ? (

          /* Empty State */

          <div className="rounded-2xl border border-dashed bg-white p-12 text-center shadow-sm">

            <h2 className="text-2xl font-semibold">
              No Properties Found
            </h2>

            <p className="mt-3 text-gray-500">
              {search
                ? "No properties match your search."
                : "Create your first property to start managing your rental business."}
            </p>

            {!search && (
              <button
                onClick={() =>
                  setShowForm(true)
                }
                className="mt-8 rounded-xl bg-black px-6 py-3 font-semibold text-white hover:bg-gray-800"
              >
                + Create First Property
              </button>
            )}

          </div>

        ) : (

          /* Property Cards */

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            {filteredProperties.map(
              (property) => (

                <div
                  key={property.id}
                  className="overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >

                  <Link
                    href={`/properties/${property.id}`}
                    className="block p-6"
                  >

                    <div className="flex items-start justify-between">

                      <div>

                        <h2 className="text-xl font-bold text-gray-900">
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

                    <div className="mt-5 space-y-2 text-sm text-gray-600">

                      <p>
                        📍{" "}
                        <strong>County:</strong>{" "}
                        {property.county || "-"}
                      </p>

                      <p>
                        🏙{" "}
                        <strong>Town:</strong>{" "}
                        {property.town || "-"}
                      </p>

                      <p>
                        🏠{" "}
                        <strong>Address:</strong>{" "}
                        {property.address || "-"}
                      </p>

                    </div>

                    <div className="mt-6 border-t pt-5">

                      <div className="grid grid-cols-2 gap-4 text-center">

                        <div>

                          <p className="text-xs uppercase tracking-wide text-gray-500">
                            Units
                          </p>

                          <p className="mt-2 text-2xl font-bold">
                            0
                          </p>

                        </div>

                        <div>

                          <p className="text-xs uppercase tracking-wide text-gray-500">
                            Occupied
                          </p>

                          <p className="mt-2 text-2xl font-bold text-green-600">
                            0
                          </p>

                        </div>

                        <div>

                          <p className="text-xs uppercase tracking-wide text-gray-500">
                            Vacant
                          </p>

                          <p className="mt-2 text-2xl font-bold text-orange-500">
                            0
                          </p>

                        </div>

                        <div>

                          <p className="text-xs uppercase tracking-wide text-gray-500">
                            Monthly Rent
                          </p>

                          <p className="mt-2 text-lg font-bold">
                            KSh 0
                          </p>

                        </div>

                      </div>

                    </div>

                  </Link>

                  <div className="flex gap-3 border-t bg-gray-50 p-4">

                    <Link
                      href={`/properties/${property.id}`}
                      className="flex-1 rounded-xl bg-black py-2.5 text-center font-medium text-white transition hover:bg-gray-800"
                    >
                      Open Property
                    </Link>

                    <button className="rounded-xl border px-4 hover:bg-gray-100">
                      ⋮
                    </button>

                  </div>

                </div>

              )
            )}

          </div>

        )}
              </div>

      {/* Create Property Modal */}

      {showForm && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">

          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

            <div className="border-b p-6">

              <h2 className="text-2xl font-bold">
                New Property
              </h2>

              <p className="mt-2 text-gray-500">
                Add a new property to your rental portfolio.
              </p>

            </div>

            <div className="p-6">

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

    </>
  );
}
              
