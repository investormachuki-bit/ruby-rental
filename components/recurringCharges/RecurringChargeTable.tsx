"use client";

import Link from "next/link";
import { RecurringCharge } from "@/types/recurringCharge";

type Props = { loading: boolean; charges: RecurringCharge[] };

export default function RecurringChargeTable({ loading, charges }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full table-fixed">
        <thead className="bg-gray-50/80">
          <tr>
            <th className="w-[30%] px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 sm:px-4">Charge</th>
            <th className="w-[16%] px-3 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500 sm:px-4">Amount</th>
            <th className="w-[18%] px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 sm:px-4">Frequency</th>
            <th className="w-[14%] px-3 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500 sm:px-4">Mandatory</th>
            <th className="w-[12%] px-3 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500 sm:px-4">Status</th>
            <th className="w-[10%] px-3 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500 sm:px-4">Actions</th>
          </tr>
        </thead>

        <tbody>
          {loading && (
            <tr><td colSpan={6} className="p-8 text-center text-sm text-gray-500">Loading...</td></tr>
          )}

          {!loading && charges.length === 0 && (
            <tr><td colSpan={6} className="p-8 text-center text-gray-500">No recurring charges found.</td></tr>
          )}

          {!loading && charges.map((charge) => (
            <tr key={charge.id} className="border-b border-gray-100 last:border-0 transition hover:bg-gray-50">
              <td className="px-3 py-4 align-middle sm:px-4">
                <p className="font-semibold text-gray-900">{charge.charge_name}</p>
                <p className="mt-1 line-clamp-2 text-xs text-gray-500">{charge.description}</p>
              </td>
              <td className="px-3 py-4 text-right align-middle font-semibold text-gray-900 sm:px-4">
                KES {Number(charge.amount).toLocaleString()}
              </td>
              <td className="px-3 py-4 align-middle text-gray-700 sm:px-4">{charge.billing_frequency}</td>
              <td className="px-3 py-4 text-center align-middle sm:px-4">
                <span className="inline-flex rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">{charge.is_mandatory ? "Yes" : "No"}</span>
              </td>
              <td className="px-3 py-4 text-center align-middle sm:px-4">
                <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${charge.is_active ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                  {charge.is_active ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="px-3 py-4 text-right align-middle sm:px-4">
                <Link href={`/recurring-charges/${charge.id}`} className="font-medium text-gray-700 hover:text-[#B8962E] hover:underline">View</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
