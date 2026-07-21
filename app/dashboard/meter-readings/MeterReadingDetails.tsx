"use client";

type Props = {
  reading: any;
  onClose: () => void;
  onEdit: () => void;
};

export default function MeterReadingDetails({
  reading,
  onClose,
  onEdit,
}: Props) {
  if (!reading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">

        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-2xl font-bold">
            Meter Reading Details
          </h2>

          <button
            onClick={onClose}
            className="text-2xl text-gray-500 hover:text-black"
          >
            ×
          </button>
        </div>

        <div className="grid gap-5 p-6 md:grid-cols-2">

          <div>
            <p className="text-sm text-gray-500">Property</p>
            <p className="font-semibold">
              {reading.property?.name ?? "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Unit</p>
            <p className="font-semibold">
              {reading.unit?.unit_number ?? "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Meter Type</p>
            <p>{reading.meter_type}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Reading Date</p>
            <p>{reading.reading_date}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Previous Reading</p>
            <p>{reading.previous_reading}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Current Reading</p>
            <p>{reading.current_reading}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Units Consumed</p>
            <p>{reading.units_consumed}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Rate Per Unit</p>
            <p>KSh {reading.rate_per_unit}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Amount</p>
            <p className="font-semibold">
              KSh {Number(reading.amount ?? 0).toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Status</p>

            <span
              className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                reading.status === "Billed"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {reading.status}
            </span>
          </div>

        </div>

        <div className="flex justify-end gap-3 border-t p-6">

          <button
            onClick={onClose}
            className="rounded-xl border px-5 py-2"
          >
            Close
          </button>

          <button
            onClick={onEdit}
            className="rounded-xl bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
          >
            Edit Reading
          </button>

        </div>

      </div>
    </div>
  );
}
