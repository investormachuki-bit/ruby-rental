"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { getRecurringCharges } from "@/services/recurringCharges/getRecurringCharges";

export default function RecurringChargesPage() {
  const [loading, setLoading] = useState(true);
  const [charges, setCharges] = useState<any[]>([]);

  async function loadCharges() {
    try {
      setLoading(true);

      const data = await getRecurringCharges();

      setCharges(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCharges();
  }, []);

  const activeCharges = charges.filter(
    (charge) => charge.is_active
  );

  const mandatoryCharges = charges.filter(
    (charge) => charge.is_mandatory
  );

  const monthlyValue = activeCharges.reduce(
    (sum, charge) => sum + Number(charge.amount),
    0
  );

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Recurring Charges
          </h1>

          <p className="text-gray-500">
            Manage recurring charges billed to tenants.
          </p>
        </div>

        <Link
          href="/recurring-charges/new"
          className="rounded-lg bg-black px-5 py-3 font-medium text-white"
        >
          + New Charge
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-4">

        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-gray-500">
            Total Charges
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {charges.length}
          </h2>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-gray-500">
            Active Charges
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {activeCharges.length}
          </h2>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-gray-500">
            Mandatory
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {mandatoryCharges.length}
          </h2>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-gray-500">
            Monthly Value
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            KES {monthlyValue.toLocaleString()}
          </h2>
        </div>

      </div>

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
                    KES {Number(charge.amount).toLocaleString()}
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

    </div>
  );
}
