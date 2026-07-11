"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadProperties();
  }, []);

  async function loadProperties() {
    try {
      setLoading(true);
      const data = await getProperties();
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

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Properties
            </h1>

            <p className="mt-1 text-gray-500">
              Manage all your properties.
            </p>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="rounded-xl bg-black px-5 py-3 font-semibold text-white transition hover:bg-gray-800"
          >
            + New Property
          </button>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="rounded-xl border bg-white p-10 text-center">
            <p className="text-gray-500">
              Loading properties...
            </p>
          </div>
        ) : properties.length === 0 ? (
          /* Empty State */
          <div className="rounded-xl border bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-semibold">
              No Properties Yet
            </h2>

            <p className="mt-2 text-gray-500">
              Create your first property to start
              managing your rental business.
            </p>

            <button
              onClick={() => setShowForm(true)}
              className="mt-6 rounded-xl bg-black px-6 py-3 font-semibold text-white hover:bg-gray-800"
            >
              + Create First Property
            </button>
          </div>
        ) : (
          /* Property Cards */
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {properties.map((property) => (
              <div
                key={property.id}
                className="overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-lg"
              >
                <Link
                  href={`/properties/${property.id}`}
                  className="block p-5"
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
                      📍 <strong>County:</strong>{" "}
                      {property.county || "-"}
                    </p>

                    <p>
                      🏙 <strong>Town:</strong>{" "}
                      {property.town || "-"}
                    </p>

                    <p>
                      🏠 <strong>Address:</strong>{" "}
                      {property.address || "-"}
                    </p>
                  </div>

                  <div className="mt-6 border-t pt-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold">
                          0
                        </p>
                        <p className="text-xs text-gray-500">
                          Units
                        </p>
                      </div>

                      <div>
                        <p className="text-2xl font-bold">
                          KSh 0
                        </p>
                        <p className="text-xs text-gray-500">
                          Monthly Income
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>

                {/* Actions */}
                <div className="flex gap-3 border-t bg-gray-50 p-4">
                  <Link
                    href={`/properties/${property.id}`}
                    className="flex-1 rounded-lg bg-black py-2 text-center font-medium text-white hover:bg-gray-800"
                  >
                    Open
                  </Link>

                  <button
                    className="rounded-lg border px-4 py-2 hover:bg-gray-100"
                  >
                    ⋮
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Property Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6">
            <h2 className="mb-6 text-2xl font-bold">
              New Property
            </h2>

            <PropertyForm
              onSuccess={handleSuccess}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}
