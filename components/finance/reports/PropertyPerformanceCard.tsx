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

type Props = { rows: PropertyPerformance[] };

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
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold">Property Performance</h2>
          <p className="text-sm text-gray-500">Occupancy and rental performance by property.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handlePdf}>Export PDF</Button>
          <Button variant="secondary" onClick={handleExcel}>Export Excel</Button>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="py-10 text-center text-gray-400">No property performance data found.</div>
      ) : (
        <>
          {/* Desktop */}
          <div className="hidden md:block overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50/80 text-left text-gray-500">
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
                  <tr key={row.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-3 py-3 font-semibold">{row.property}</td>
                    <td className="px-3 py-3">{row.totalUnits}</td>
                    <td className="px-3 py-3">{row.occupiedUnits}</td>
                    <td className="px-3 py-3">{row.vacantUnits}</td>
                    <td className="px-3 py-3">{row.occupancyRate}%</td>
                    <td className="px-3 py-3">{money(row.expectedRent)}</td>
                    <td className="px-3 py-3 font-semibold">{money(row.collectedRent)}</td>
                    <td className="px-3 py-3 font-semibold">{money(row.outstandingRent)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile — invoice-style cards */}
          <div className="space-y-3 md:hidden">
            {rows.map((row) => (
              <div key={row.id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="grid grid-cols-[1.15fr_0.9fr_1fr] gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-gray-900">{row.property}</p>
                    <p className="mt-1 text-xs text-gray-500">{row.totalUnits} units · {row.occupiedUnits} occupied · {row.vacantUnits} vacant</p>
                    <div className="mt-3">
                      <p className="text-[10px] uppercase tracking-wide text-gray-400">Occupancy</p>
                      <p className="mt-1 text-lg font-bold text-gray-900">{row.occupancyRate}%</p>
                    </div>
                  </div>

                  <div className="min-w-0 text-right">
                    <p className="text-[10px] uppercase tracking-wide text-gray-400">Expected</p>
                    <p className="mt-1 text-sm font-semibold text-gray-900">{money(row.expectedRent)}</p>
                    <p className="mt-3 text-[10px] uppercase tracking-wide text-gray-400">Collected</p>
                    <p className="mt-1 text-sm font-semibold text-green-600">{money(row.collectedRent)}</p>
                  </div>

                  <div className="min-w-0 text-right">
                    <p className="text-[10px] uppercase tracking-wide text-gray-400">Outstanding</p>
                    <p className="mt-1 text-sm font-bold text-gray-900">{money(row.outstandingRent)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </Card>
  );
}
