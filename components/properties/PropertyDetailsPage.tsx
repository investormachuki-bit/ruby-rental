"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Props = {
  propertyId: string;
};

export default function PropertyDetailsPage({
  propertyId,
}: Props) {
  const [property, setProperty] = useState<any>(null);

  useEffect(() => {
    loadProperty();
  }, []);

  async function loadProperty() {
    const { data } = await supabase
      .from("properties")
      .select("*")
      .eq("id", propertyId)
      .single();

    setProperty(data);
  }

  if (!property) {
    return (
      <div className="p-8">
        Loading...
      </div>
    );
  }

  return (
    <main className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          {property.name}
        </h1>

        <p className="text-gray-500">
          {property.property_type}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border p-5">
          <p className="text-gray-500">Units</p>
          <h2 className="text-3xl font-bold">0</h2>
        </div>

        <div className="rounded-xl border p-5">
          <p className="text-gray-500">Occupied</p>
          <h2 className="text-3xl font-bold">0</h2>
        </div>

        <div className="rounded-xl border p-5">
          <p className="text-gray-500">Vacant</p>
          <h2 className="text-3xl font-bold">0</h2>
        </div>

        <div className="rounded-xl border p-5">
          <p className="text-gray-500">
            Monthly Income
          </p>
          <h2 className="text-3xl font-bold">
            KSh 0
          </h2>
        </div>
      </div>

      <div className="flex gap-4">
        <button className="rounded-xl bg-black px-5 py-3 font-semibold text-white">
          + Add Unit
        </button>

        <button className="rounded-xl border px-5 py-3 font-semibold">
          Bulk Generate Units
        </button>
      </div>
    </main>
  );
}
