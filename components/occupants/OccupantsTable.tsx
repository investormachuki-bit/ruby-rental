"use client";

import Link from "next/link";

type Props = {
  occupants: any[];
};

export default function OccupantsTable({
  occupants,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">

      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead className="bg-gray-50">

            <tr>

              <th className="px-5 py-4 text-left text-sm font-semibold">
                Code
              </th>

              <th className="px-5 py-4 text-left text-sm font-semibold">
                Name
              </th>

              <th className="px-5 py-4 text-left text-sm font-semibold">
                Phone
              </th>

              <th className="px-5 py-4 text-left text-sm font-semibold">
                Property
              </th>

              <th className="px-5 py-4 text-left text-sm font-semibold">
                Unit
              </th>

              <th className="px-5 py-4 text-left text-sm font-semibold">
                Status
              </th>

              <th className="px-5 py-4 text-left text-sm font-semibold">
                Move In
              </th>

              <th className="px-5 py-4 text-right text-sm font-semibold">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {occupants.map((occupant) => (

              <tr
                key={occupant.id}
                className="border-t hover:bg-gray-50"
              >

                <td className="px-5 py-4 font-medium">
                  {occupant.occupant_code}
                </td>

                <td className="px-5 py-4">
                  {occupant.full_name}
                </td>

                <td className="px-5 py-4">
                  {occupant.phone}
                </td>

                <td className="px-5 py-4">
                  {occupant.property?.name ?? "-"}
                </td>

                <td className="px-5 py-4">
                  {occupant.unit?.unit_number ?? "-"}
                </td>

                <td className="px-5 py-4">

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      occupant.status ===
                      "Active"
                        ? "bg-green-100 text-green-700"
                        : occupant.status ===
                          "Notice"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {occupant.status}
                  </span>

                </td>

                <td className="px-5 py-4">

                  {occupant.move_in_date
                    ? new Date(
                        occupant.move_in_date
                      ).toLocaleDateString(
                        "en-KE"
                      )
                    : "-"}

                </td>

                <td className="px-5 py-4 text-right">

                  <Link
                    href={`/occupants/${occupant.id}`}
                    className="rounded-lg border px-4 py-2 hover:bg-gray-100"
                  >
                    View
                  </Link>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}
