"use client";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { exportPdf } from "@/services/reports/pdf/exportPdf";
import { exportExcel } from "@/services/reports/excel/exportExcel";

export type PropertyRentRoll = {
  id: string;
  property_id: string | null;
  property_name: string;
  unit_id: string | null;
  unit_number: string;
  tenant_id: string | null;
  tenant_name: string;
  lease_id: string | null;
  lease_number: string;
  rent: number;
  billed: number;
  paid: number;
  outstanding: number;
  lease_status: string;
};

type Props = {
  rows: PropertyRentRoll[];
};

function money(value: number) {
  return `KES ${Number(value ?? 0).toLocaleString()}`;
}

export default function PropertyRentRollCard({ rows }: Props) {
  async function handlePdf() {
    await exportPdf({
      title: "Rent Roll",
      subtitle: "Property rental income and tenant balances",
      rows: rows.map((row) => ({
        Property: row.property_name,
        Unit: row.unit_number,
        Tenant: row.tenant_name,
        Lease: row.lease_number,
        Rent: money(row.rent),
        Billed: money(row.billed),
        Paid: money(row.paid),
        Outstanding: money(row.outstanding),
        Status: row.lease_status,
      })),
    });
  }

  async function handleExcel() {
    await exportExcel({
      fileName: "Rent_Roll",
      rows: rows.map((row) => ({
        Property: row.property_name,
        Unit: row.unit_number,
        Tenant: row.tenant_name,
        Lease: row.lease_number,
        Rent: row.rent,
        Billed: row.billed,
        Paid: row.paid,
        Outstanding: row.outstanding,
        Status: row.lease_status,
      })),
    });
  }

  return (
    <Card>
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">Rent Roll</h2>
          <p className="text-sm text-gray-500">
            Property, tenant, rent and outstanding balances.
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
          No rent roll records found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-gray-500">
                <th className="px-3 py-3">Property</th>
                <th className="px-3 py-3">Unit</th>
                <th className="px-3 py-3">Tenant</th>
                <th className="px-3 py-3">Rent</th>
                <th className="px-3 py-3">Billed</th>
                <th className="px-3 py-3">Paid</th>
                <th className="px-3 py-3">Outstanding</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b">
                  <td className="px-3 py-3 font-semibold">
                    {row.property_name}
                  </td>

                  <td className="px-3 py-3">
                    {row.unit_number}
                  </td>

                  <td className="px-3 py-3">
                    {row.tenant_name}
                  </td>

                  <td className="px-3 py-3">
                    {money(row.rent)}
                  </td>

                  <td className="px-3 py-3">
                    {money(row.billed)}
                  </td>

                  <td className="px-3 py-3 font-semibold">
                    {money(row.paid)}
                  </td>

                  <td className="px-3 py-3 font-semibold">
                    {money(row.outstanding)}
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
