"use client";

import Link from "next/link";

import {
  User,
  Phone,
  Building2,
  Home,
  Calendar,
} from "lucide-react";

type Occupant = {
  id: string;
  occupant_code: string;
  full_name: string;
  phone: string;
  property_name?: string | null;
  unit_number?: string | null;
  move_in_date?: string | null;
  status: string;
};

type Props = {
  occupant: Occupant;
};

export default function OccupantCard({
  occupant,
}: Props) {

  function getStatus(status: string) {

    switch (status) {

      case "Active":
        return {
          label: "Current Tenant",
          className: "bg-green-100 text-green-700",
        };

      case "Notice":
        return {
          label: "Notice",
          className: "bg-amber-100 text-amber-700",
        };

      case "Inactive":
        return {
          label: "Former Tenant",
          className: "bg-gray-100 text-gray-700",
        };

      default:
        return {
          label: "Unassigned",
          className: "bg-blue-100 text-blue-700",
        };

    }

  }

  const status = getStatus(
    occupant.status
  );

  return (

    <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#D4AF37] hover:shadow-xl">

      {/* Header */}

      <div className="flex items-start justify-between p-6">

        <div>

          <h3 className="text-2xl font-bold text-gray-900">

            {occupant.full_name}

          </h3>

          <p className="mt-1 text-sm text-gray-500">

            {occupant.occupant_code}

          </p>

        </div>

        <span
          className={`rounded-full px-4 py-2 text-sm font-semibold ${status.className}`}
        >

          {status.label}

        </span>

      </div>

      {/* Details */}

      <div className="space-y-4 border-y border-gray-100 px-6 py-5">

        <div className="flex items-center gap-3">

          <Phone
            size={18}
            className="text-[#D4AF37]"
          />

          <span className="text-gray-700">

            {occupant.phone || "-"}

          </span>

        </div>

        <div className="flex items-center gap-3">

          <Building2
            size={18}
            className="text-[#D4AF37]"
          />

          <span className="text-gray-700">

            {occupant.property_name ??
              "No Active Property"}

          </span>

        </div>

        <div className="flex items-center gap-3">

          <Home
            size={18}
            className="text-[#D4AF37]"
          />

          <span className="text-gray-700">

            {occupant.unit_number
              ? `Unit ${occupant.unit_number}`
              : "No Active Unit"}

          </span>

        </div>

        <div className="flex items-center gap-3">

          <Calendar
            size={18}
            className="text-[#D4AF37]"
          />

          <span className="text-gray-700">

            {occupant.move_in_date ??
              "No Active Lease"}

          </span>

        </div>

      </div>

      {/* Footer */}

      <div className="p-6">

        <Link
          href={`/occupants/${occupant.id}`}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-black font-semibold text-white transition hover:bg-gray-800"
        >

          <User size={18} />

          <span>

            View Tenant

          </span>

        </Link>

      </div>

    </div>

  );

}
