"use client";

import Link from "next/link";
import { RecurringCharge } from "@/types/recurringCharge";

type Props = { loading: boolean; charges: RecurringCharge[] };

export default function RecurringChargeTable({ loading, charges }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Desktop */}
      <div className="hidden md:block">
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
            {loading && <tr><td colSpan={6} className="p-8 text-center text-sm text-gray-500">Loading...</td></tr>}
            {!loading && charges.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-gray-500">No recurring charges found.</td></tr>}
            {!loading && charges.map((charge) => (
              <tr key={charge.id} className="border-b border-gray-100 last:border-0 transition hover:bg-gray-50">
                <td className="px-3 py-4 align-middle sm:px-4">
                  <p className="font-semibold text-gray-900">{charge.charge_name}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-gray-500">{charge.description}</p>
                </td>
                <td className="px-3 py-4 text-right align-middle font-semibold text-gray-900 sm:px-4">KES {Number(charge.amount).toLocaleString()}</td>
                <td className="px-3 py-4 align-middle text-gray-700 sm:px-4">{charge.billing_frequency}</td>
                <td className="px-3 py-4 text-center align-middle sm:px-4">
                  <span className="inline-flex rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">{charge.is_mandatory ? "Yes" : "No"}</span>
                </td>
                <td className="px-3 py-4 text-center align-middle sm:px-4">
                  <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${charge.is_active ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600"}`}>{charge.is_active ? "Active" : "Inactive"}</span>
                </td>
                <td className="px-3 py-4 text-right align-middle sm:px-4">
                  <Link href={`/recurring-charges/${charge.id}`} className="font-medium text-gray-700 hover:text-[#B8962E] hover:underline">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile — invoice-style cards */}
      <div className="space-y-3 p-3 md:hidden">
        {loading && <div className="rounded-2xl border border-gray-200 p-6 text-center text-sm text-gray-500">Loading...</div>}
        {!loading && charges.length === 0 && <div className="rounded-2xl border border-gray-200 p-6 text-center text-gray-500">No recurring charges found.</div>}
        {!loading && charges.map((charge) => (
          <div key={charge.id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="grid grid-cols-[1.2fr_auto_auto] gap-3">
              <div className="min-w-0">
                <p className="truncate font-semibold text-gray-900">{charge.charge_name}</p>
                <p className="mt-1 line-clamp-2 text-xs text-gray-500">{charge.description}</p>
                <div className="mt-2 flex flex-wrap gap-2 text-[10px] text-gray-500">
                  <span className="rounded-full bg-gray-50 px-2 py-1">{charge.billing_frequency}</span>
                  <span className="rounded-full bg-gray-50 px-2 py-1">Mandatory: {charge.is_mandatory ? "Yes" : "No"}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-wide text-gray-400">Amount</p>
                <p className="mt-1 font-semibold text-gray-900">KES {Number(charge.amount).toLocaleString()}</p>
              </div>
              <div className="flex min-w-[62px] flex-col items-end gap-2">
                <span className={`inline-flex rounded-full px-2 py-1 text-[10px] font-medium ${charge.is_active ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600"}`}>{charge.is_active ? "Active" : "Inactive"}</span>
                <Link href={`/recurring-charges/${charge.id}`} className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-700">View</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
