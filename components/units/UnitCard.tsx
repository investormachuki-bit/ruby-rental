"use client";

import Link from "next/link";
import { Unit } from "@/types/unit";

type Props = {
  unit: Unit;
};

export default function UnitCard({
  unit,
}: Props) {
  function getStatusColor(status: string) {
    switch (status) {
      case "Occupied":
        return "bg-green-100 text-green-700";

      case "Vacant":
        return "bg-orange-100 text-orange-700";

      case "Reserved":
        return "bg-blue-100 text-blue-700";

      case "Maintenance":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-lg">

      {/* Header */}

      <div className="flex items-center justify-between border-b p-5">

        <div>

          <h3 className="text-2xl font-bold">
            {unit.unit_number}
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            {unit.floor_name || "No Floor"}
          </p>

        </div>

        <span
          className={`rounded-full px-3 py-1 text-sm font-semibold ${getStatusColor(
            unit.status
          )}`}
        >
          {unit.status}
        </span>

      </div>

      {/* Body */}

      <div className="space-y-4 p-5">

        <div className="flex justify-between">

          <span className="text-gray-500">
            💰 Monthly Rent
          </span>

          <strong>
            KSh{" "}
            {Number(
              unit.monthly_rent
            ).toLocaleString()}
          </strong>

        </div>

        <div className="flex justify-between">

          <span className="text-gray-500">
            🔐 Deposit
          </span>

          <strong>
            KSh{" "}
            {Number(
              unit.deposit
            ).toLocaleString()}
          </strong>

        </div>

      </div>

      {/* Footer */}

      <div className="grid grid-cols-2 gap-3 border-t bg-gray-50 p-4">

        <button className="rounded-lg bg-black py-3 font-medium text-white transition hover:bg-gray-800">
          👤 Assign Occupant
        </button>

        <Link
          href={`/units/${unit.id}`}
          className="rounded-lg border py-3 text-center font-medium transition hover:bg-gray-100"
        >
          📄 View Details
        </Link>

      </div>

    </div>
  );
}
