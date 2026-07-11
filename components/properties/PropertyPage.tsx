"use client";

import { useEffect, useState } from "react";
import { getProperties } from "@/services/properties/getAll";

type Property = {
  id: string;
  name: string;
  property_type: string;
  county: string | null;
  town: string | null;
  address: string | null;
  description: string | null;
  is_active: boolean;
  created_at: string;
};

export default function PropertyPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProperties();
  }, []);

  async function loadProperties() {
    try {
      const data = await getProperties();
      setProperties(data ?? []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
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

        <button className="rounded-xl bg-black px-5 py-3 font-semibold text-white transition hover:bg-gray-800">
          + New Property
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="rounded-xl border bg-white p-8 text-center">
          <p className="text-gray-500">Loading properties...</p>
        </div>
      ) : properties.length === 0 ? (
        <div className="rounded-xl border bg-white p-10 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">
            No Properties Yet
          </h2>

          <p className="mt-2 text-gray-500">
            Create your first property to start managing your rental business.
          </p>

          <button className="mt-6 rounded-xl bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800">
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
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {property.name}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {property.property_type}
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    property.is_active
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {property.is_active ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="mt-5 space-y-2 text-sm text-gray-600">
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

              <div className="mt-6 flex gap-3">
                <button className="flex-1 rounded-lg border px-4 py-2 font-medium hover:bg-gray-100">
                  Edit
                </button>

                <button className="flex-1 rounded-lg bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
