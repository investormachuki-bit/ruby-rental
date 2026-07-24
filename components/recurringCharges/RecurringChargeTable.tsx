"use client";

import Link from "next/link";

type Props = {
  loading: boolean;
  charges: any[];
};

export default function RecurringChargeTable({
  loading,
  charges,
}: Props) {
  return (
    <div className="overflow-hidden rounded-xl border bg-white">
      <table className="min-w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 text-left">
              Charge
            </th>

            <th className="px-4 py-3 text-left">
              Amount
            </th>

            <th className="px-4 py-3 text-left">
              Frequency
            </th>

            <th className="px-4 py-3 text-left">
              Mandatory
            </th>

            <th className="px-4 py-3 text-left">
              Status
            </th>

            <th className="px-4 py-3 text-right">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {loading && (
            <tr>
              <td
                colSpan={6}
                className="p-8 text-center"
              >
                Loading...
              </td>
            </tr>
          )}

          {!loading &&
            charges.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="p-8 text-center text-gray-500"
                >
                  No recurring charges found.
                </td>
              </tr>
            )}

          {!loading &&
            charges.map((charge) => (
              <tr
                key={charge.id}
                className="border-t"
              >
                <td className="px-4 py-3">
                  <div className="font-medium">
                    {charge.charge_name}
                  </div>

                  <div className="text-sm text-gray-500">
                    {charge.description}
                  </div>
                </td>

                <td className="px-4 py-3">
                  KES{" "}
                  {Number(
                    charge.amount
                  ).toLocaleString()}
                </td>

                <td className="px-4 py-3">
                  {charge.billing_frequency}
                </td>

                <td className="px-4 py-3">
                  {charge.is_mandatory
                    ? "Yes"
                    : "No"}
                </td>

                <td className="px-4 py-3">
                  {charge.is_active
                    ? "Active"
                    : "Inactive"}
                </td>

                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/recurring-charges/${charge.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
