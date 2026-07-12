"use client";

import { useEffect, useState } from "react";

import CreateOccupantModal from "@/components/occupants/CreateOccupantModal";
import OccupantsTable from "@/components/occupants/OccupantsTable";

import { getOccupants } from "@/services/occupants/getOccupants";

export default function OccupantsPage() {
  const [occupants, setOccupants] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [
    showCreateModal,
    setShowCreateModal,
  ] = useState(false);

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    loadOccupants();
  }, []);

  async function loadOccupants() {
    try {
      setLoading(true);

      const data =
        await getOccupants();

      setOccupants(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const filteredOccupants =
    occupants.filter((occupant) => {

      const keyword =
        search.toLowerCase();

      return (
        occupant.full_name
          ?.toLowerCase()
          .includes(keyword) ||

        occupant.phone
          ?.toLowerCase()
          .includes(keyword) ||

        occupant.occupant_code
          ?.toLowerCase()
          .includes(keyword)
      );
    });

  return (
    <>
      <main className="space-y-6 p-6">

        <div className="flex flex-wrap items-center justify-between gap-4">

          <div>

            <h1 className="text-4xl font-bold">
              Occupants
            </h1>

            <p className="mt-2 text-gray-500">
              Manage tenants and occupants.
            </p>

          </div>

          <button
            onClick={() =>
              setShowCreateModal(true)
            }
            className="rounded-xl bg-black px-6 py-3 font-semibold text-white hover:bg-gray-800"
          >
            + Add Occupant
          </button>

        </div>

        <input
          placeholder="Search occupants..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full rounded-xl border p-3"
        />
                {loading ? (

          <div className="rounded-2xl border bg-white p-10 text-center">

            Loading occupants...

          </div>

        ) : filteredOccupants.length === 0 ? (

          <div className="rounded-2xl border border-dashed bg-white p-10 text-center">

            <h2 className="text-xl font-semibold">
              No Occupants Found
            </h2>

            <p className="mt-2 text-gray-500">
              Add your first occupant to get started.
            </p>

            <button
              onClick={() =>
                setShowCreateModal(true)
              }
              className="mt-6 rounded-xl bg-black px-6 py-3 font-semibold text-white hover:bg-gray-800"
            >
              + Add Occupant
            </button>

          </div>

        ) : (

          <OccupantsTable
            occupants={filteredOccupants}
          />

        )}

      </main>

      {showCreateModal && (

        <CreateOccupantModal
          onClose={() =>
            setShowCreateModal(false)
          }
          onSaved={() => {
            setShowCreateModal(false);
            loadOccupants();
          }}
        />

      )}

    </>
  );
}
