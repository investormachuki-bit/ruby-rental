"use client";

import { useEffect, useMemo, useState } from "react";

import { bulkCreateUnits } from "@/services/units/bulkCreateUnits";

type Property = {
  id: string;
  name: string;
};

type Props = {

  properties: {
    id: string;
    name: string;
  }[];

  defaultPropertyId?: string;

  onSuccess: () => void;

  onCancel: () => void;

};
export default function BulkUnitGenerator({

  properties,

  defaultPropertyId,

  onSuccess,

  onCancel,

}: Props) {

  const [propertyId, setPropertyId] =
  useState(
    defaultPropertyId ?? ""
  );

  const [prefix, setPrefix] =
    useState("");

  const [floorNumber, setFloorNumber] =
    useState("");

  const [unitType, setUnitType] =
    useState("");

  const [bedrooms, setBedrooms] =
    useState(1);

  const [bathrooms, setBathrooms] =
    useState(1);

  const [sizeSqm, setSizeSqm] =
    useState(0);

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

  useEffect(() => {

    if (
      properties.length === 1
    ) {

      setPropertyId(
        properties[0].id
      );

    }

  }, [properties]);

  const preview =
    useMemo(() => {

      const list: string[] = [];

      for (
        let i = start;
        i <= end;
        i++
      ) {

        list.push(
          `${prefix}${i}`
        );

      }

      return list;

    }, [
      prefix,
      start,
      end,
    ]);
    async function handleGenerate() {

    if (!propertyId) {

      alert("Please select a property.");

      return;

    }

    if (!prefix.trim()) {

      alert("Enter a unit prefix.");

      return;

    }

    if (end < start) {

      alert("End number must be greater than Start number.");

      return;

    }

    try {

      setLoading(true);

      await bulkCreateUnits({

        propertyId,

        prefix,

        floorNumber:
          floorNumber
            ? Number(
                floorNumber
              )
            : undefined,

        unitType:
          unitType || null,

        bedrooms,

        bathrooms,

        sizeSqm,

        start,

        end,

        monthlyRent,

        deposit,

      });

      alert(
        "Units generated successfully."
      );

      onSuccess();

    } catch (error: any) {

      alert(error.message);

    } finally {

      setLoading(false);

    }

  }

  return (

    <div className="space-y-8">

      {/* Property */}

      {properties.length > 1 && (

        <div>

          <label className="mb-2 block font-medium">

            Property

          </label>

          <select
            value={propertyId}
            onChange={(e) =>
              setPropertyId(
                e.target.value
              )
            }
            className="w-full rounded-xl border p-3"
          >

            <option value="">

              Select Property

            </option>

            {properties.map(
              (property) => (

                <option
                  key={property.id}
                  value={property.id}
                >

                  {property.name}

                </option>

              )
            )}

          </select>

        </div>

      )}

      {/* Unit Details */}

      <div className="grid gap-5 md:grid-cols-2">

        <div>

          <label className="mb-2 block font-medium">

            Unit Prefix

          </label>

          <input
            value={prefix}
            onChange={(e) =>
              setPrefix(
                e.target.value
              )
            }
            placeholder="A"
            className="w-full rounded-xl border p-3"
          />

        </div>

        <div>

          <label className="mb-2 block font-medium">

            Floor Number

          </label>

          <input
            type="number"
            value={floorNumber}
            onChange={(e) =>
              setFloorNumber(
                e.target.value
              )
            }
            placeholder="3"
            className="w-full rounded-xl border p-3"
          />

        </div>

        <div>

          <label className="mb-2 block font-medium">

            Unit Type

          </label>

          <input
            value={unitType}
            onChange={(e) =>
              setUnitType(
                e.target.value
              )
            }
            placeholder="2 Bedroom Apartment"
            className="w-full rounded-xl border p-3"
          />

        </div>

        <div>

          <label className="mb-2 block font-medium">

            Size (Sqm)

          </label>

          <input
            type="number"
            value={sizeSqm}
            onChange={(e) =>
              setSizeSqm(
                Number(
                  e.target.value
                )
              )
            }
            className="w-full rounded-xl border p-3"
          />

        </div>

        <div>

          <label className="mb-2 block font-medium">

            Bedrooms

          </label>

          <input
            type="number"
            value={bedrooms}
            onChange={(e) =>
              setBedrooms(
                Number(
                  e.target.value
                )
              )
            }
            className="w-full rounded-xl border p-3"
          />

        </div>

        <div>

          <label className="mb-2 block font-medium">

            Bathrooms

          </label>

          <input
            type="number"
            value={bathrooms}
            onChange={(e) =>
              setBathrooms(
                Number(
                  e.target.value
                )
              )
            }
            className="w-full rounded-xl border p-3"
          />

        </div>

      </div>

      {/* Pricing */}

      <div className="grid gap-5 md:grid-cols-2">

        <div>

          <label className="mb-2 block font-medium">

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
            className="w-full rounded-xl border p-3"
          />

        </div>

        <div>

          <label className="mb-2 block font-medium">

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
            className="w-full rounded-xl border p-3"
          />

        </div>

      </div>
            {/* Numbering */}

      <div className="grid gap-5 md:grid-cols-2">

        <div>

          <label className="mb-2 block font-medium">

            Start Number

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
            className="w-full rounded-xl border p-3"
          />

        </div>

        <div>

          <label className="mb-2 block font-medium">

            End Number

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
            className="w-full rounded-xl border p-3"
          />

        </div>

      </div>

      {/* Preview */}

      <div className="rounded-2xl border bg-gray-50 p-6">

        <h3 className="mb-4 text-lg font-semibold">

          Unit Preview

        </h3>

        <div className="flex flex-wrap gap-2">

          {preview.length === 0 ? (

            <p className="text-gray-500">

              No units to preview.

            </p>

          ) : (

            preview.map((unit) => (

              <span
                key={unit}
                className="rounded-full bg-black px-3 py-2 text-sm font-medium text-white"
              >

                {unit}

              </span>

            ))

          )}

        </div>

      </div>

      {/* Summary */}

      <div className="rounded-2xl border border-[#D4AF37] bg-[#FFFBEA] p-6">

        <h3 className="mb-4 text-lg font-bold">

          Generation Summary

        </h3>

        <div className="grid gap-4 md:grid-cols-2">

          <div>

            <span className="text-gray-500">

              Units

            </span>

            <p className="font-semibold">

              {Math.max(
                0,
                end - start + 1
              )}

            </p>

          </div>

          <div>

            <span className="text-gray-500">

              Floor

            </span>

            <p className="font-semibold">

              {floorNumber || "-"}

            </p>

          </div>

          <div>

            <span className="text-gray-500">

              Unit Type

            </span>

            <p className="font-semibold">

              {unitType || "-"}

            </p>

          </div>

          <div>

            <span className="text-gray-500">

              Monthly Rent

            </span>

            <p className="font-semibold">

              KSh{" "}
              {monthlyRent.toLocaleString()}

            </p>

          </div>

          <div>

            <span className="text-gray-500">

              Deposit

            </span>

            <p className="font-semibold">

              KSh{" "}
              {deposit.toLocaleString()}

            </p>

          </div>

        </div>

      </div>

      {/* Actions */}

      <div className="flex justify-end gap-3 border-t pt-6">

        <button
          onClick={onCancel}
          className="rounded-xl border px-6 py-3"
        >

          Cancel

        </button>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="rounded-xl bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800 disabled:opacity-50"
        >

          {loading
            ? "Generating..."
            : "Generate Units"}

        </button>

      </div>

    </div>

  );

}
