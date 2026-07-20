"use client";

import { useEffect, useState } from "react";

import {
  getLeaseLedger,
  type LeaseLedgerEntry,
} from "@/services/leases/getLeaseLedger";

type Props = {
  leaseId: string;
};

export default function LeaseLedger({
  leaseId,
}: Props) {

  const [ledger, setLedger] =
    useState<LeaseLedgerEntry[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadLedger();
  }, []);

  async function loadLedger() {

    try {

      setLoading(true);

      const data =
        await getLeaseLedger(
          leaseId
        );

      setLedger(data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  }

  const totalDebits =
    ledger.reduce(
      (sum, item) =>
        sum + item.debit,
      0
    );

  const totalCredits =
    ledger.reduce(
      (sum, item) =>
        sum + item.credit,
      0
    );

  const closingBalance =
    ledger.length > 0
      ? ledger[
          ledger.length - 1
        ].balance
      : 0;

  if (loading) {

    return (

      <div className="rounded-2xl border bg-white p-12 text-center">

        Loading ledger...

      </div>

    );

  }

  if (ledger.length === 0) {

    return (

      <div className="rounded-2xl border bg-white p-12 text-center text-gray-500">

        No financial transactions found for this lease.

      </div>

    );

  }

  return (

    <div className="rounded-2xl border bg-white shadow-sm">

      <div className="border-b p-6">

        <h2 className="text-2xl font-bold">
          Lease Ledger
        </h2>

        <p className="mt-2 text-gray-500">
          Complete financial history for this lease.
        </p>

      </div>

      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead className="bg-gray-50">

            <tr>

              <th className="p-4 text-left">
                Date
              </th>

              <th className="p-4 text-left">
                Type
              </th>

              <th className="p-4 text-left">
                Reference
              </th>

              <th className="p-4 text-left">
                Description
              </th>

              <th className="p-4 text-right">
                Debit
              </th>

              <th className="p-4 text-right">
                Credit
              </th>

              <th className="p-4 text-right">
                Balance
              </th>

            </tr>

          </thead>

          <tbody>
                        {ledger.map((entry) => (

              <tr
                key={`${entry.type}-${entry.id}`}
                className="border-t hover:bg-gray-50"
              >

                <td className="p-4 whitespace-nowrap">
                  {entry.date}
                </td>

                <td className="p-4">

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      entry.type === "Invoice"
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {entry.type}
                  </span>

                </td>

                <td className="p-4 font-medium">
                  {entry.reference}
                </td>

                <td className="p-4 text-gray-600">
                  {entry.description}
                </td>

                <td className="p-4 text-right font-semibold">

                  {entry.debit > 0
                    ? `KSh ${entry.debit.toLocaleString()}`
                    : "-"}

                </td>

                <td className="p-4 text-right font-semibold text-green-700">

                  {entry.credit > 0
                    ? `KSh ${entry.credit.toLocaleString()}`
                    : "-"}

                </td>

                <td
                  className={`p-4 text-right font-bold ${
                    entry.balance > 0
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  KSh {entry.balance.toLocaleString()}
                </td>

              </tr>

            ))}

          </tbody>

          <tfoot className="border-t bg-gray-50">

            <tr>

              <td
                colSpan={4}
                className="p-4 text-right font-bold"
              >
                Totals
              </td>

              <td className="p-4 text-right font-bold">
                KSh {totalDebits.toLocaleString()}
              </td>

              <td className="p-4 text-right font-bold text-green-700">
                KSh {totalCredits.toLocaleString()}
              </td>

              <td
                className={`p-4 text-right text-lg font-bold ${
                  closingBalance > 0
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                KSh {closingBalance.toLocaleString()}
              </td>

            </tr>

          </tfoot>

        </table>

      </div>

    </div>

  );

}
