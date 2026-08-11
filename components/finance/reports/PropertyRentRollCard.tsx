"use client";

import Card from "@/components/ui/Card";

export type PropertyRentRoll = {
  id: string;
  property: string;
  totalUnits: number;
  occupiedUnits: number;
  vacantUnits: number;
  occupancyRate: number;
  expectedRent: number;
  collectedRent: number;
  outstandingRent: number;
};

type Props = {
  rows: PropertyRentRoll[];
};

function money(value: number) {
  return `KES ${Number(value ?? 0).toLocaleString()}`;
}

export default function PropertyRentRollCard({ rows }: Props) {
  return (
    <Card>
      <div className="mb-5">
        <h2 className="text-xl font-bold">
          Property Performance
        </h2>

        <p className="text-sm text-gray-500">
          Occupancy, expected rent, collections and outstanding balances.
        </p>
      </div>

      {rows.length === 0 ? (
        <div className="py-10 text-center text-gray-400">
          No property performance data found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-gray-500">
                <th className="px-3 py-3">Property</th>
                <th className="px-3 py-3">Units</th>
                <th className="px-3 py-3">Occupied</th>
                <th className="px-3 py-3">Occupancy</th>
                <th className="px-3 py-3">Expected</th>
                <th className="px-3 py-3">Collected</th>
                <th className="px-3 py-3">Outstanding</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b">
                  <td className="px-3 py-3 font-semibold">
                    {row.property}
                  </td>

                  <td className="px-3 py-3">
                    {row.totalUnits}
                  </td>

                  <td className="px-3 py-3">
                    {row.occupiedUnits}
                  </td>

                  <td className="px-3 py-3">
                    {row.occupancyRate}%
                  </td>

                  <td className="px-3 py-3">
                    {money(row.expectedRent)}
                  </td>

                  <td className="px-3 py-3 font-semibold">
                    {money(row.collectedRent)}
                  </td>

                  <td className="px-3 py-3 font-semibold">
                    {money(row.outstandingRent)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
