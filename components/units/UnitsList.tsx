"use client";

type Unit = {
  id: string;
  unit_number: string;
  floor_name: string | null;
  monthly_rent: number;
  deposit: number;
  status: string;
};

type Props = {
  units: Unit[];
};

export default function UnitsList({
  units,
}: Props) {
  if (units.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-8 text-center shadow-sm">
        <h2 className="text-xl font-semibold">
          No Units Yet
        </h2>

        <p className="mt-2 text-gray-500">
          Generate or add units to this property.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">

      <h2 className="text-2xl font-bold">
        Units
      </h2>

      {units.map((unit) => (
        <div
          key={unit.id}
          className="rounded-xl border bg-white p-5 shadow-sm"
        >
          <div className="flex items-center justify-between">

            <div>
              <h3 className="text-xl font-bold">
                {unit.unit_number}
              </h3>

              <p className="text-gray-500">
                {unit.floor_name || "-"}
              </p>
            </div>

            <span
              className={`rounded-full px-3 py-1 text-sm font-semibold ${
                unit.status === "Occupied"
                  ? "bg-green-100 text-green-700"
                  : "bg-orange-100 text-orange-700"
              }`}
            >
              {unit.status}
            </span>

          </div>

          <div className="mt-5 grid grid-cols-2 gap-4">

            <div>
              <p className="text-gray-500 text-sm">
                Rent
              </p>

              <p className="font-semibold">
                KSh{" "}
                {Number(
                  unit.monthly_rent
                ).toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">
                Deposit
              </p>

              <p className="font-semibold">
                KSh{" "}
                {Number(
                  unit.deposit
                ).toLocaleString()}
              </p>
            </div>

          </div>

          <button
            className="mt-5 w-full rounded-lg bg-black py-3 font-semibold text-white"
          >
            Open Unit
          </button>

        </div>
      ))}

    </div>
  );
}
