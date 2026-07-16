"use client";

import { useState } from "react";
import { bulkCreateUnits } from "@/services/units/bulkCreateUnits";

type Props = {
  propertyId: string;
  onSuccess: () => void;
  onCancel: () => void;
};

export default function BulkUnitGenerator({
  propertyId,
  onSuccess,
  onCancel,
}: Props) {
  const [prefix, setPrefix] = useState("");

  const [floorNumber, setFloorNumber] =
    useState("");

  const [start, setStart] =
    useState(1);

  const [end, setEnd] =
    useState(10);

  const [monthlyRent, setMonthlyRent] =
    useState(0);

  const [deposit, setDeposit] =
    useState(0);

  const [loading, setLoading] =
    useState(false);

  async function handleGenerate() {
    try {
      setLoading(true);

      await bulkCreateUnits({
        propertyId,

        prefix,

        floorNumber: floorNumber
          ? Number(floorNumber)
          : undefined,

        start,

        end,

        monthlyRent,

        deposit,
      });

      alert("Units generated successfully.");

      onSuccess();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">

      <div>

        <label className="mb-1 block font-medium">
          Floor Number (Optional)
        </label>

        <input
          type="number"
          value={floorNumber}
          onChange={(e) =>
            setFloorNumber(
              e.target.value
            )
          }
          className="w-full rounded-lg border p-3"
          placeholder="1"
        />

      </div>

      <div>

        <label className="mb-1 block font-medium">
          Unit Prefix
        </label>

        <input
          value={prefix}
          onChange={(e) =>
            setPrefix(
              e.target.value
            )
          }
          className="w-full rounded-lg border p-3"
          placeholder="A"
        />

      </div>

      <div className="grid grid-cols-2 gap-4">

        <div>

          <label className="mb-1 block font-medium">
            Start
          </label>

          <input
            type="number"
            value={start}
            onChange={(e) =>
              setStart(
                Number(
                  e.target.value
                )
              )
            }
            className="w-full rounded-lg border p-3"
          />

        </div>

        <div>

          <label className="mb-1 block font-medium">
            End
          </label>

          <input
            type="number"
            value={end}
            onChange={(e) =>
              setEnd(
                Number(
                  e.target.value
                )
              )
            }
            className="w-full rounded-lg border p-3"
          />

        </div>

      </div>

      <div>

        <label className="mb-1 block font-medium">
          Monthly Rent
        </label>

        <input
          type="number"
          value={monthlyRent}
          onChange={(e) =>
            setMonthlyRent(
              Number(
                e.target.value
              )
            )
          }
          className="w-full rounded-lg border p-3"
        />

      </div>

      <div>

        <label className="mb-1 block font-medium">
          Deposit
        </label>

        <input
          type="number"
          value={deposit}
          onChange={(e) =>
            setDeposit(
              Number(
                e.target.value
              )
            )
          }
          className="w-full rounded-lg border p-3"
        />

      </div>

      <div className="flex justify-end gap-3 pt-4">

        <button
          onClick={onCancel}
          className="rounded-lg border px-5 py-3"
        >
          Cancel
        </button>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="rounded-lg bg-black px-5 py-3 text-white"
        >
          {loading
            ? "Generating..."
            : "Generate Units"}
        </button>

      </div>

    </div>
  );
}
