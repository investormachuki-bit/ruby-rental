"use client";

import { useMemo, useState } from "react";
import UnitCard from "./UnitCard";
import { Unit } from "@/types/unit";

type Props = {
  units: Unit[];
};

export default function UnitsList({
  units,
}: Props) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [floor, setFloor] = useState("All");
  const [sort, setSort] = useState("Unit Number");

  const floors: string[] = [
    "All",
    ...Array.from(
      new Set(
        units
          .map((u) => u.floor_name ?? "")
          .filter(
            (name): name is string => name !== ""
          )
      )
    ),
  ];

  const filteredUnits = useMemo(() => {
    let results = [...units];

    // Search
    results = results.filter((unit) => {
      return (
        unit.unit_number
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        (unit.floor_name ?? "")
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    });

    // Status
    if (status !== "All") {
      results = results.filter(
        (u) => u.status === status
      );
    }

    // Floor
    if (floor !== "All") {
      results = results.filter(
        (u) => u.floor_name === floor
      );
    }

    // Sorting
    switch (sort) {
      case "Rent Low → High":
        results.sort(
          (a, b) =>
            a.monthly_rent - b.monthly_rent
        );
        break;

      case "Rent High → Low":
        results.sort(
          (a, b) =>
            b.monthly_rent - a.monthly_rent
        );
        break;

      case "Newest":
        results.sort(
          (a, b) =>
            new Date(
              b.created_at
            ).getTime() -
            new Date(
              a.created_at
            ).getTime()
        );
        break;

      case "Oldest":
        results.sort(
          (a, b) =>
            new Date(
              a.created_at
            ).getTime() -
            new Date(
              b.created_at
            ).getTime()
        );
        break;

      default:
        results.sort(
          (a, b) =>
            a.unit_sequence -
            b.unit_sequence
        );
    }

    return results;
  }, [
    units,
    search,
    status,
    floor,
    sort,
  ]);

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <h2 className="text-2xl font-bold">
            Units
          </h2>

          <p className="text-gray-500">
            Showing{" "}
            {filteredUnits.length} of{" "}
            {units.length} units
          </p>
        </div>

      </div>

      {/* Filters */}

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">

        <input
          type="text"
          placeholder="🔍 Search unit..."
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
          className="rounded-xl border px-4 py-3"
        >
          <option value="All">All Statuses</option>
          <option value="Vacant">Vacant</option>
          <option value="Occupied">Occupied</option>
          <option value="Reserved">Reserved</option>
          <option value="Maintenance">Maintenance</option>
        </select>

        <select
          value={floor}
          onChange={(e) =>
            setFloor(e.target.value)
          }
          className="rounded-xl border px-4 py-3"
        >
          {floors.map((floorName) => (
            <option
              key={floorName}
              value={floorName}
            >
              {floorName}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) =>
            setSort(e.target.value)
          }
          className="rounded-xl border px-4 py-3"
        >
          <option value="Unit Number">
            Unit Number
          </option>

          <option value="Rent Low → High">
            Rent Low → High
          </option>

          <option value="Rent High → Low">
            Rent High → Low
          </option>

          <option value="Newest">
            Newest
          </option>

          <option value="Oldest">
            Oldest
          </option>
        </select>

      </div>

      {/* Units */}

      {filteredUnits.length === 0 ? (
        <div className="rounded-2xl border bg-white p-10 text-center shadow-sm">

          <h3 className="text-xl font-semibold">
            No Units Found
          </h3>

          <p className="mt-2 text-gray-500">
            Try changing your filters.
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
