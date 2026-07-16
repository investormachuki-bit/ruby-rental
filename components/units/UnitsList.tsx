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

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("All");

  const [floor, setFloor] =
    useState("All");

  const [sort, setSort] =
    useState("Unit Number");

  const floors = [
    "All",
    ...Array.from(
      new Set(
        units
          .map((u) =>
            u.floor_number != null
              ? String(u.floor_number)
              : ""
          )
          .filter(Boolean)
      )
    ),
  ];

  const filteredUnits =
    useMemo(() => {

      let results = [...units];

      const keyword =
        search.toLowerCase();

      results = results.filter(
        (unit) =>

          unit.unit_number
            .toLowerCase()
            .includes(keyword) ||

          (unit.unit_type ?? "")
            .toLowerCase()
            .includes(keyword) ||

          (unit.floor_number != null
            ? String(
                unit.floor_number
              )
            : ""
          ).includes(keyword)

      );

      if (status !== "All") {

        results = results.filter(
          (u) =>
            u.status === status
        );

      }

      if (floor !== "All") {

        results = results.filter(
          (u) =>
            String(
              u.floor_number
            ) === floor
        );

      }

      switch (sort) {

        case "Rent Low → High":

          results.sort(
            (a, b) =>
              a.monthly_rent -
              b.monthly_rent
          );

          break;

        case "Rent High → Low":

          results.sort(
            (a, b) =>
              b.monthly_rent -
              a.monthly_rent
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

    <div className="space-y-8">

      {/* Header */}

      <div>

        <h2 className="text-2xl font-bold text-gray-900">

          Units

        </h2>

        <p className="mt-1 text-gray-500">

          Showing{" "}

          <span className="font-semibold text-black">

            {filteredUnits.length}

          </span>{" "}

          of{" "}

          <span className="font-semibold text-black">

            {units.length}

          </span>{" "}

          rental units.

        </p>

      </div>

      {/* Filters */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

        <input
          type="text"
          placeholder="Search unit..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-black focus:ring-2 focus:ring-black/5"
        />

        <select
          value={status}
          onChange={(e) =>
            setStatus(
              e.target.value
            )
          }
          className="rounded-xl border border-gray-200 bg-white px-4 py-3"
        >

          <option value="All">

            All Statuses

          </option>

          <option value="Occupied">

            Occupied

          </option>

          <option value="Vacant">

            Vacant

          </option>

          <option value="Reserved">

            Reserved

          </option>

          <option value="Maintenance">

            Maintenance

          </option>

        </select>

        <select
          value={floor}
          onChange={(e) =>
            setFloor(
              e.target.value
            )
          }
          className="rounded-xl border border-gray-200 bg-white px-4 py-3"
        >

          {floors.map(
            (floorValue) => (

              <option
                key={floorValue}
                value={floorValue}
              >

                {floorValue === "All"
                  ? "All Floors"
                  : `Floor ${floorValue}`}

              </option>

            )
          )}

        </select>

        <select
          value={sort}
          onChange={(e) =>
            setSort(
              e.target.value
            )
          }
          className="rounded-xl border border-gray-200 bg-white px-4 py-3"
        >

          <option>

            Unit Number

          </option>

          <option>

            Rent Low → High

          </option>

          <option>

            Rent High → Low

          </option>

          <option>

            Newest

          </option>

          <option>

            Oldest

          </option>

        </select>

      </div>

      {/* Units */}

      {filteredUnits.length === 0 ? (

        <div className="rounded-2xl border border-dashed bg-white p-12 text-center shadow-sm">

          <h3 className="text-2xl font-semibold">

            No Units Found

          </h3>

          <p className="mt-3 text-gray-500">

            Try adjusting your search or filters.

          </p>

        </div>

      ) : (

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">

          {filteredUnits.map(
            (unit) => (

              <UnitCard
                key={unit.id}
                unit={unit}
              />

            )
          )}

        </div>

      )}

    </div>

  );

}
