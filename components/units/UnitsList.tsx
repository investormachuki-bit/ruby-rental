"use client";

import { useMemo, useState } from "react";
import UnitCard from "./UnitCard";

type Unit = {
  id: string;
  unit_number: string;
  floor_name: string | null;
  monthly_rent: number;
  deposit: number;
  status: string;
};

type Props = {
  units: Unit[];
};

export default function UnitsList({
  units,
}: Props) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  const filteredUnits = useMemo(() => {
    return units.filter((unit) => {
      const matchesSearch =
        unit.unit_number
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        (unit.floor_name ?? "")
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        status === "All"
          ? true
          : unit.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [units, search, status]);

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <h2 className="text-2xl font-bold">
            Units
          </h2>

          <p className="text-gray-500">
            {filteredUnits.length} unit(s)
          </p>

        </div>

        <div className="flex flex-col gap-3 sm:flex-row">

          <input
            type="text"
            placeholder="Search unit..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="rounded-xl border px-4 py-3 outline-none focus:border-black"
          />

          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
            className="rounded-xl border px-4 py-3 outline-none focus:border-black"
          >
            <option>All</option>
            <option>Vacant</option>
            <option>Occupied</option>
            <option>Reserved</option>
            <option>Maintenance</option>
          </select>

        </div>

      </div>

      {/* Empty */}

      {filteredUnits.length === 0 ? (
        <div className="rounded-2xl border bg-white p-10 text-center shadow-sm">

          <h3 className="text-xl font-semibold">
            No Units Found
          </h3>

          <p className="mt-2 text-gray-500">
            Try changing your search or filters.
          </p>

        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredUnits.map((unit) => (
            <UnitCard
              key={unit.id}
              unit={unit}
            />
          ))}
        </div>
      )}

    </div>
  );
}
