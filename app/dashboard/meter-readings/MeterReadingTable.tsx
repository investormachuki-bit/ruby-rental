"use client";

type Props = {
  readings: any[];

  loading: boolean;

  onView: (reading: any) => void;

  onEdit: (reading: any) => void;
};

export default function MeterReadingTable({
  readings,
  loading,
  onView,
  onEdit,
}: Props) {

  if (loading) {

    return (

      <div className="rounded-2xl border bg-white p-10 text-center">

        Loading meter readings...

      </div>

    );

  }

  if (readings.length === 0) {

    return (

      <div className="rounded-2xl border bg-white p-10 text-center text-gray-500">

        No meter readings found.

      </div>

    );

  }

  return (

    <div className="overflow-hidden rounded-2xl border bg-white">

      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="px-4 py-3 text-left">
                Property
              </th>

              <th className="px-4 py-3 text-left">
                Unit
              </th>

              <th className="px-4 py-3 text-left">
                Meter
              </th>

              <th className="px-4 py-3 text-right">
                Previous
              </th>

              <th className="px-4 py-3 text-right">
                Current
              </th>

              <th className="px-4 py-3 text-right">
                Units
              </th>

              <th className="px-4 py-3 text-right">
                Rate
              </th>

              <th className="px-4 py-3 text-right">
                Amount
              </th>

              <th className="px-4 py-3 text-center">
                Status
              </th>

              <th className="px-4 py-3 text-center">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

                    <tr
                key={reading.id}
                className="border-t hover:bg-gray-50"
              >
                <td className="px-4 py-3">
                  {reading.property?.name ?? "-"}
                </td>

                <td className="px-4 py-3">
                  {reading.unit?.unit_number ?? "-"}
                </td>

                <td className="px-4 py-3">
                  {reading.meter_type}
                </td>

                <td className="px-4 py-3 text-right">
                  {Number(reading.previous_reading).toLocaleString()}
                </td>

                <td className="px-4 py-3 text-right">
                  {Number(reading.current_reading).toLocaleString()}
                </td>

                <td className="px-4 py-3 text-right">
                  {Number(reading.units_consumed).toLocaleString()}
                </td>

                <td className="px-4 py-3 text-right">
                  KSh{" "}
                  {Number(reading.rate_per_unit).toLocaleString()}
                </td>

                <td className="px-4 py-3 text-right font-semibold">
                  KSh{" "}
                  {Number(reading.amount).toLocaleString()}
                </td>

                <td className="px-4 py-3 text-center">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      reading.status === "Billed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {reading.status}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <div className="flex justify-center gap-2">

                    <button
                      onClick={() => onView(reading)}
                      className="rounded-lg border px-3 py-1 text-sm hover:bg-gray-100"
                    >
                      View
                    </button>

                    <button
                      onClick={() => onEdit(reading)}
                      className="rounded-lg bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
                    >
                      Edit
                    </button>

                  </div>
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>

  );

}
      
