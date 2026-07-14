"use client";

import Link from "next/link";

import {
  User,
  Phone,
  Building2,
  Home,
  Calendar,
  FileText,
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

  function getStatusColor(
    status: string
  ) {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";

      case "Notice":
        return "bg-amber-100 text-amber-700";

      case "Reserved":
        return "bg-blue-100 text-blue-700";

      case "Inactive":
        return "bg-gray-100 text-gray-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  }

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
          className={`rounded-full px-4 py-2 text-sm font-semibold ${getStatusColor(
            occupant.status
          )}`}
        >

          {occupant.status}

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

            {occupant.property_name ||
              "Not Assigned"}

          </span>

        </div>

        <div className="flex items-center gap-3">

          <Home
            size={18}
            className="text-[#D4AF37]"
          />

          <span className="text-gray-700">

            {occupant.unit_number ||
              "-"}

          </span>

        </div>

        <div className="flex items-center gap-3">

          <Calendar
            size={18}
            className="text-[#D4AF37]"
          />

          <span className="text-gray-700">

            {occupant.move_in_date ||
              "-"}

          </span>

        </div>

      </div>

      {/* Footer */}

      <div className="grid grid-cols-2 gap-3 p-6">

        <Link
          href={`/occupants/${occupant.id}`}
          className="flex h-12 items-center justify-center gap-2 rounded-xl bg-black font-semibold text-white transition hover:bg-gray-800"
        >

          <User size={18} />

          <span>

            Open Profile

          </span>

        </Link>

        <button
          className="flex h-12 items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white font-semibold text-gray-700 transition hover:bg-gray-100"
        >

          <FileText size={18} />

          <span>

            More

          </span>

        </button>

      </div>

    </div>

  );
}
