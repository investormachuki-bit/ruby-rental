"use client";

import Link from "next/link";

import {
  User,
  FileText,
  Coins,
  Lock,
  Building2,
} from "lucide-react";

import { Unit } from "@/types/unit";

type Props = {
  unit: Unit;
};

export default function UnitCard({
  unit,
}: Props) {

  function getStatusColor(
    status: string
  ) {
    switch (status) {

      case "Occupied":
        return "bg-green-100 text-green-700";

      case "Vacant":
        return "bg-amber-100 text-amber-700";

      case "Reserved":
        return "bg-blue-100 text-blue-700";

      case "Maintenance":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";

    }
  }

  return (

    <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#D4AF37] hover:shadow-xl">

      {/* Header */}

      <div className="flex items-start justify-between p-6">

        <div>

          <h3 className="text-3xl font-bold text-gray-900">

            {unit.unit_number}

          </h3>

          <p className="mt-2 flex items-center gap-2 text-gray-500">

            <Building2
              size={16}
            />

            {unit.floor_number !== null &&
            unit.floor_number !== undefined
              ? `Floor ${unit.floor_number}`
              : "No Floor"}

          </p>

          {unit.unit_type && (

            <p className="mt-1 text-sm text-gray-400">

              {unit.unit_type}

            </p>

          )}

        </div>

        <span
          className={`rounded-full px-4 py-2 text-sm font-semibold ${getStatusColor(
            unit.status
          )}`}
        >

          {unit.status}

        </span>

      </div>

      {/* Details */}

      <div className="space-y-4 border-y border-gray-100 px-6 py-5">

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-2 text-gray-500">

            <Coins
              size={18}
              className="text-[#D4AF37]"
            />

            <span>

              Monthly Rent

            </span>

          </div>

          <strong className="text-lg">

            KSh{" "}
            {Number(
              unit.monthly_rent
            ).toLocaleString()}

          </strong>

        </div>

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-2 text-gray-500">

            <Lock
              size={18}
              className="text-[#D4AF37]"
            />

            <span>

              Deposit

            </span>

          </div>

          <strong className="text-lg">

            KSh{" "}
            {Number(
              unit.deposit
            ).toLocaleString()}

          </strong>

        </div>

      </div>

      {/* Footer */}

      <div className="grid grid-cols-2 gap-3 p-6">

        <button className="flex h-12 items-center justify-center gap-2 rounded-xl bg-black px-4 font-semibold text-white transition hover:bg-gray-800">

          <User
            size={18}
          />

          <span>

            Assign

          </span>

        </button>

        <Link
          href={`/units/${unit.id}`}
          className="flex h-12 items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 font-semibold text-gray-700 transition hover:bg-gray-100"
        >

          <FileText
            size={18}
          />

          <span>

            Details

          </span>

        </Link>

      </div>

    </div>

  );

}
