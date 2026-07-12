"use client";

type Props = {
  meter: any;
  history: any[];
  onClose: () => void;
  onEdit: (reading: any) => void;
};

export default function UtilityHistoryModal({
  meter,
  history,
  onClose,
  onEdit,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">

      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-xl">

        <div className="border-b p-6">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-2xl font-bold">

                {meter.utility_type === "Water"
                  ? "🚰 Water History"
                  : "⚡ Electricity History"}

              </h2>

              <p className="mt-2 text-gray-500">

                Meter

                {" "}

                <strong>

                  {meter.meter_number ||
                    "Not Assigned"}

                </strong>

              </p>

            </div>

            <button
              onClick={onClose}
              className="rounded-lg border px-4 py-2"
            >
              Close
            </button>

          </div>

        </div>

        <div className="max-h-[70vh] overflow-y-auto p-6">

          {history.length === 0 && (

            <div className="rounded-xl border border-dashed p-8 text-center text-gray-500">

              No readings recorded yet.

            </div>

          )}

          {history.map((reading) => (

            <div
              key={reading.id}
              className="mb-5 rounded-xl border p-5"
            >
                            <div className="flex items-start justify-between">

                <div>

                  <h3 className="text-lg font-semibold">
                    {new Date(
                      reading.billing_month
                    ).toLocaleDateString(
                      "en-KE",
                      {
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Reading Date:{" "}
                    {new Date(
                      reading.reading_date
                    ).toLocaleDateString(
                      "en-KE"
                    )}
                  </p>

                </div>

                <button
                  onClick={() =>
                    onEdit(reading)
                  }
                  className="rounded-lg border px-4 py-2 hover:bg-gray-100"
                >
                  ✏ Edit
                </button>

              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">

                <Info
                  label="Previous Reading"
                  value={String(
                    reading.previous_reading
                  )}
                />

                <Info
                  label="Current Reading"
                  value={String(
                    reading.current_reading
                  )}
                />

                <Info
                  label="Units Used"
                  value={String(
                    reading.units_used
                  )}
                />

                <Info
                  label="Amount"
                  value={`KSh ${Number(
                    reading.amount
                  ).toLocaleString()}`}
                />

              </div>

              {reading.notes && (
                <div className="mt-4 rounded-lg bg-gray-50 p-3">

                  <p className="text-sm font-medium text-gray-600">
                    Notes
                  </p>

                  <p className="mt-1 text-gray-700">
                    {reading.notes}
                  </p>

                </div>
              )}

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">

      <span className="text-gray-500">
        {label}
      </span>

      <strong>{value}</strong>

    </div>
  );
}
