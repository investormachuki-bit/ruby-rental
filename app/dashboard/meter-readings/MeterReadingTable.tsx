"use client";

type Props = {
  readings: any[];
  loading: boolean;
  onView: (reading: any) => void;
  onEdit: (reading: any) => void;
};

export default function MeterReadingTable({ readings, loading, onView, onEdit }: Props) {
  if (loading) {
    return <div className="rounded-2xl border bg-white p-10 text-center">Loading meter readings...</div>;
  }

  if (readings.length === 0) {
    return <div className="rounded-2xl border bg-white p-10 text-center text-gray-500">No meter readings found.</div>;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Desktop */}
      <div className="hidden md:block">
        <table className="w-full table-fixed">
          <thead className="bg-gray-50/80">
            <tr>
              <th className="w-[23%] px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 sm:px-4">Unit / Meter</th>
              <th className="w-[27%] px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 sm:px-4">Reading</th>
              <th className="w-[22%] px-3 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500 sm:px-4">Billing</th>
              <th className="w-[12%] px-3 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500 sm:px-4">Status</th>
              <th className="w-[16%] px-3 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500 sm:px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {readings.map((reading) => (
              <tr key={reading.id} className="border-b border-gray-100 last:border-0 transition hover:bg-gray-50">
                <td className="px-3 py-4 align-middle sm:px-4">
                  <p className="font-semibold text-gray-900">Unit {reading.unit?.unit_number ?? "-"}</p>
                  <p className="mt-1 truncate text-xs text-gray-500">{reading.property?.name ?? "Unknown property"}</p>
                  <p className="mt-1 text-xs text-gray-400">{reading.meter_type ?? "Meter"}</p>
                </td>
                <td className="px-3 py-4 align-middle sm:px-4">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-gray-400">Previous</p>
                      <p className="mt-1 font-medium text-gray-800">{Number(reading.previous_reading ?? 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-gray-400">Current</p>
                      <p className="mt-1 font-medium text-gray-800">{Number(reading.current_reading ?? 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-gray-400">Used</p>
                      <p className="mt-1 font-semibold text-gray-900">{Number(reading.units_consumed ?? 0).toLocaleString()}</p>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-4 text-right align-middle sm:px-4">
                  <p className="font-semibold text-gray-900">KSh {Number(reading.amount ?? 0).toLocaleString()}</p>
                  <p className="mt-1 text-xs text-gray-400">Rate KSh {Number(reading.rate_per_unit ?? 0).toLocaleString()} / unit</p>
                </td>
                <td className="px-3 py-4 text-center align-middle sm:px-4">
                  <span className={`inline-flex max-w-full rounded-full px-2.5 py-1 text-xs font-medium ${reading.status === "Billed" ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"}`}>
                    {reading.status}
                  </span>
                </td>
                <td className="px-3 py-4 text-center align-middle sm:px-4">
                  <div className="flex flex-col items-center justify-center gap-1.5 sm:flex-row">
                    <button onClick={() => onView(reading)} className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50">View</button>
                    <button onClick={() => onEdit(reading)} className="rounded-lg bg-gray-900 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-gray-800">Edit</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile — same card pattern as the invoice ledger */}
      <div className="space-y-3 p-3 md:hidden">
        {readings.map((reading) => (
          <div key={reading.id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="grid grid-cols-[1.15fr_1fr_auto] gap-3">
              <div className="min-w-0">
                <p className="truncate font-semibold text-gray-900">Unit {reading.unit?.unit_number ?? "-"}</p>
                <p className="mt-1 truncate text-xs text-gray-500">{reading.property?.name ?? "Unknown property"}</p>
                <p className="mt-1 text-xs text-gray-400">{reading.meter_type ?? "Meter"}</p>
              </div>

              <div className="min-w-0 text-center">
                <p className="text-[10px] uppercase tracking-wide text-gray-400">Reading</p>
                <div className="mt-1 grid grid-cols-3 gap-1">
                  <div><p className="text-[9px] text-gray-400">Prev</p><p className="text-xs font-medium text-gray-800">{Number(reading.previous_reading ?? 0).toLocaleString()}</p></div>
                  <div><p className="text-[9px] text-gray-400">Now</p><p className="text-xs font-medium text-gray-800">{Number(reading.current_reading ?? 0).toLocaleString()}</p></div>
                  <div><p className="text-[9px] text-gray-400">Used</p><p className="text-xs font-semibold text-gray-900">{Number(reading.units_consumed ?? 0).toLocaleString()}</p></div>
                </div>
                <p className="mt-2 text-sm font-semibold text-gray-900">KSh {Number(reading.amount ?? 0).toLocaleString()}</p>
                <p className="text-[10px] text-gray-400">Rate {Number(reading.rate_per_unit ?? 0).toLocaleString()}/unit</p>
              </div>

              <div className="flex min-w-[64px] flex-col items-end gap-2">
                <span className={`inline-flex rounded-full px-2 py-1 text-[10px] font-medium ${reading.status === "Billed" ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"}`}>
                  {reading.status}
                </span>
                <div className="flex flex-col gap-1.5">
                  <button onClick={() => onView(reading)} className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-700">View</button>
                  <button onClick={() => onEdit(reading)} className="rounded-lg bg-gray-900 px-2.5 py-1 text-xs font-medium text-white">Edit</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
