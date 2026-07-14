"use client";

import { useMemo, useState } from "react";

import OccupantCard from "./OccupantCard";

type Occupant = {
  id: string;
  occupant_code: string;
  full_name: string;
  phone: string;
  property_name?: string | null;
  unit_number?: string | null;
  move_in_date?: string | null;
  status: string;
  monthly_rent?: number;
};

type Props = {
  occupants: Occupant[];
};

export default function OccupantsList({
  occupants,
}: Props) {

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("All");

  const [property, setProperty] =
    useState("All");

  const properties = [
    "All",
    ...Array.from(
      new Set(
        occupants
          .map(
            (o) =>
              o.property_name ?? ""
          )
          .filter(Boolean)
      )
    ),
  ];

  const filteredOccupants =
    useMemo(() => {

      let results = [...occupants];

      if (search) {

        const keyword =
          search.toLowerCase();

        results = results.filter(
          (occupant) =>
            occupant.full_name
              ?.toLowerCase()
              .includes(keyword) ||

            occupant.phone
              ?.toLowerCase()
              .includes(keyword) ||

            occupant.occupant_code
              ?.toLowerCase()
              .includes(keyword) ||

            (
              occupant.property_name ??
              ""
            )
              .toLowerCase()
              .includes(keyword) ||

            (
              occupant.unit_number ??
              ""
            )
              .toLowerCase()
              .includes(keyword)
        );

      }

      if (status !== "All") {

        results = results.filter(
          (occupant) =>
            occupant.status === status
        );

      }

      if (property !== "All") {

        results = results.filter(
          (occupant) =>
            occupant.property_name ===
            property
        );

      }

      return results;

    }, [
      occupants,
      search,
      status,
      property,
    ]);

  return (

    <div className="space-y-8">

      {/* Filters */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">

        <input
          type="text"
          placeholder="Search occupant..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-black"
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

          <option value="Active">
            Active
          </option>

          <option value="Inactive">
            Inactive
          </option>

        </select>

        <select
          value={property}
          onChange={(e) =>
            setProperty(
              e.target.value
            )
          }
          className="rounded-xl border border-gray-200 bg-white px-4 py-3"
        >

          {properties.map(
            (propertyName) => (

              <option
                key={propertyName}
                value={propertyName}
              >
                {propertyName}
              </option>

            )
          )}

        </select>

      </div>

      {/* Cards */}

      {filteredOccupants.length ===
      0 ? (

        <div className="rounded-2xl border border-dashed bg-white p-12 text-center">

          <h2 className="text-2xl font-semibold">

            No Occupants Found

          </h2>

          <p className="mt-3 text-gray-500">

            Try changing your filters.

          </p>

        </div>

      ) : (

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">

          {filteredOccupants.map(
            (occupant) => (

              <OccupantCard
                key={occupant.id}
                occupant={occupant}
              />

            )
          )}

        </div>

      )}

    </div>

  );
}
