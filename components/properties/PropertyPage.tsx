"use client";

import { useEffect, useState } from "react";
import { getProperties } from "@/services/properties/getAll";

export default function PropertyPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProperties();
  }, []);

  async function loadProperties() {
    try {
      /*
       Temporary workspace ID.
       Later this will come from the logged in user.
      */

      const data = await getProperties(
        "TEMP_WORKSPACE_ID"
      );

      setProperties(data ?? []);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Properties
          </h1>

          <p className="text-gray-500">
            Manage all your properties.
          </p>
        </div>

        <button className="rounded-xl bg-black px-5 py-3 font-semibold text-white">
          + New Property
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : properties.length === 0 ? (
        <div className="rounded-xl border bg-white p-10 text-center">
          <h2 className="text-xl font-semibold">
            No Properties Yet
          </h2>

          <p className="mt-2 text-gray-500">
            Create your first property to get started.
          </p>
        </div>
      ) : (
        <div>
          Property list coming next...
        </div>
      )}
    </div>
  );
}
