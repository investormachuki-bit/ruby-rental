"use client";

import Link from "next/link";

type Props = { occupants: any[] };

export default function OccupantsTable({ occupants }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full table-fixed">
        <thead className="bg-gray-50/80">
          <tr>
            <th className="w-[38%] px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 sm:px-4">Occupant</th>
            <th className="w-[25%] px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 sm:px-4">Property / Unit</th>
            <th className="w-[17%] px-3 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500 sm:px-4">Status</th>
            <th className="w-[12%] px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 sm:px-4">Move In</th>
            <th className="w-[8%] px-3 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500 sm:px-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {occupants.map((occupant) => (
            <tr key={occupant.id} className="border-b border-gray-100 last:border-0 transition hover:bg-gray-50">
              <td className="px-3 py-4 align-middle sm:px-4">
                <p className="font-semibold text-gray-900">{occupant.full_name}</p>
                <p className="mt-1 text-xs text-gray-500">{occupant.occupant_code} · {occupant.phone || "No phone"}</p>
              </td>
              <td className="px-3 py-4 align-middle sm:px-4">
                <p className="font-medium text-gray-800">{occupant.property?.name ?? "-"}</p>
                <p className="mt-1 text-xs text-gray-400">Unit {occupant.unit?.unit_number ?? "-"}</p>
              </td>
              <td className="px-3 py-4 text-center align-middle sm:px-4">
                <span className={`inline-flex max-w-full rounded-full px-2.5 py-1 text-xs font-semibold ${occupant.status === "Active" ? "bg-green-50 text-green-700" : occupant.status === "Notice" ? "bg-yellow-50 text-yellow-700" : "bg-gray-100 text-gray-600"}`}>{occupant.status}</span>
              </td>
              <td className="px-3 py-4 align-middle text-xs text-gray-600 sm:px-4">
                {occupant.move_in_date ? new Date(occupant.move_in_date).toLocaleDateString("en-KE") : "-"}
              </td>
              <td className="px-3 py-4 text-right align-middle sm:px-4">
                <Link href={`/occupants/${occupant.id}`} className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50">View</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
