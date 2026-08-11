"use client";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { exportPdf } from "@/services/reports/pdf/exportPdf";
import { exportExcel } from "@/services/reports/excel/exportExcel";

export type PropertyPerformance = {
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
  rows: PropertyPerformance[];
};

function money(value: number) {
  return `KES ${Number(value ?? 0).toLocaleString()}`;
}

export default function PropertyPerformanceCard({ rows }: Props) {
  async function handlePdf() {
    await exportPdf({
      title: "Property Performance Report",
      subtitle: "Occupancy and rental performance by property",
      rows: rows.map((row) => ({
        Property: row.property,
        "Total Units": row.totalUnits,
        Occupied: row.occupiedUnits,
        Vacant: row.vacantUnits,
        "Occupancy Rate": `${row.occupancyRate}%`,
        "Expected Rent": money(row.expectedRent),
        Collected: money(row.collectedRent),
        Outstanding: money(row.outstandingRent),
      })),
    });
  }

  async function handleExcel() {
    await exportExcel({
      fileName: "Property_Performance",
      rows: rows.map((row) => ({
        Property: row.property,
        "Total Units": row.totalUnits,
        Occupied: row.occupiedUnits,
        Vacant: row.vacantUnits,
        "Occupancy Rate": row.occupancyRate,
        "Expected Rent": row.expectedRent,
        Collected: row.collectedRent,
        Outstanding: row.outstandingRent,
      })),
    });
  }

  return (
    <Card>
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">Property Performance</h2>
          <p className="text-sm text-gray-500">
            Occupancy and rental performance by property.
          </p>
        </div>

        <div className="flex gap-2">
          <Button onClick={handlePdf}>Export PDF</Button>
          <Button variant="secondary" onClick={handleExcel}>
            Export Excel
          </Button>
        </div>
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
                <th className="px-3 py-3">Vacant</th>
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
                  <td className="px-3 py-3">{row.totalUnits}</td>
                  <td className="px-3 py-3">{row.occupiedUnits}</td>
                  <td className="px-3 py-3">{row.vacantUnits}</td>
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
