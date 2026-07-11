"use client";

import { useEffect, useState } from "react";
import { getProperties } from "@/services/properties/getAll";
import PropertyForm from "./PropertyForm";

type Property = {
  id: string;
  name: string;
  property_type: string;
  county: string | null;
  town: string |null;
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
            className="rounded-xl bg-black px-5 py-3 font-semibold text-white hover:bg-gray-800"
          >
            + New Property
          </button>
        </div>

        {loading ? (
          <div className="rounded-xl border bg-white p-8 text-center">
            Loading properties...
          </div>
        ) : properties.length === 0 ? (
          <div className="rounded-xl border bg-white p-10 text-center">
            <h2 className="text-xl font-semibold">
              No Properties Yet
            </h2>

            <p className="mt-2 text-gray-500">
              Create your first property to get started.
            </p>

            <button
              onClick={() => setShowForm(true)}
              className="mt-6 rounded-xl bg-black px-6 py-3 font-semibold text-white"
            >
              + Create First Property
            </button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {properties.map((property) => (
              <div
                key={property.id}
                className="rounded-xl border bg-white p-5 shadow-sm"
              >
                <h2 className="text-lg font-semibold">
                  {property.name}
                </h2>

                <p className="text-sm text-gray-500">
                  {property.property_type}
                </p>

                <div className="mt-4 space-y-1 text-sm text-gray-600">
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

                <div className="mt-5">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
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
              </div>
            ))}
          </div>
        )}
      </div>

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
