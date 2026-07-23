"use client";

import { useEffect, useState } from "react";

import { getProperties } from "@/services/properties/getProperties";
import { createUnit } from "@/services/units/createUnit";
import { updateUnit } from "@/services/units/updateUnit";

import { Property } from "@/types/property";
import { Unit } from "@/types/unit";

type Props = {
  unit?: Unit;
  onSuccess: () => void;
  onCancel: () => void;
};

export default function UnitForm({
  unit,
  onSuccess,
  onCancel,
}: Props) {
  const editing = !!unit;

  const [loading, setLoading] = useState(false);

  const [properties, setProperties] =
    useState<Property[]>([]);

  const [propertyId, setPropertyId] =
    useState("");

  const [unitNumber, setUnitNumber] =
    useState("");

  const [unitType, setUnitType] =
    useState("");

  const [floorNumber, setFloorNumber] =
    useState("");

  const [bedrooms, setBedrooms] =
    useState(0);

  const [bathrooms, setBathrooms] =
    useState(0);

  const [sizeSqm, setSizeSqm] =
    useState(0);

  const [monthlyRent, setMonthlyRent] =
    useState(0);

  const [deposit, setDeposit] =
    useState(0);

  const [notes, setNotes] =
    useState("");

  useEffect(() => {
    loadProperties();
  }, []);

  useEffect(() => {
    if (!unit) return;

    setPropertyId(unit.property_id);

    setUnitNumber(unit.unit_number);

    setUnitType(unit.unit_type ?? "");

    setFloorNumber(
      unit.floor_number?.toString() ?? ""
    );

    setBedrooms(unit.bedrooms);

    setBathrooms(unit.bathrooms);

    setSizeSqm(
      Number(unit.size_sqm)
    );

    setMonthlyRent(
      Number(unit.monthly_rent)
    );

    setDeposit(
      Number(unit.deposit)
    );

    setNotes(
      unit.notes ?? ""
    );
  }, [unit]);

  async function loadProperties() {
    try {
      const data =
        await getProperties();

      setProperties(data);
    } catch (error) {
      console.error(error);
    }
  }

  function validate() {
    if (!propertyId) {
      alert(
        "Please select a property."
      );
      return false;
    }

    if (!unitNumber.trim()) {
      alert(
        "Unit number is required."
      );
      return false;
    }

    if (monthlyRent < 0) {
      alert(
        "Monthly rent cannot be negative."
      );
      return false;
    }

    if (deposit < 0) {
      alert(
        "Deposit cannot be negative."
      );
      return false;
    }

    return true;
  }

  return (
        <div className="space-y-8">
      {/* Basic Information */}

      <section className="rounded-2xl border bg-white p-6">
        <h2 className="text-xl font-bold">
          Basic Information
        </h2>

        <p className="mt-1 text-gray-500">
          Enter the unit identification details.
        </p>

        <div className="mt-6 grid gap-5 md:grid-cols-2">

          <div>
            <label className="mb-2 block font-medium">
              Property
            </label>

            <select
              value={propertyId}
              onChange={(e) =>
                setPropertyId(e.target.value)
              }
              disabled={editing}
              className="w-full rounded-xl border p-3"
            >
              <option value="">
                Select Property
              </option>

              {properties.map((property) => (
                <option
                  key={property.id}
                  value={property.id}
                >
                  {property.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Unit Number
            </label>

            <input
              value={unitNumber}
              onChange={(e) =>
                setUnitNumber(e.target.value)
              }
              className="w-full rounded-xl border p-3"
              placeholder="A101"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Unit Type
            </label>

            <select
              value={unitType}
              onChange={(e) =>
                setUnitType(e.target.value)
              }
              className="w-full rounded-xl border p-3"
            >
              <option value="">
                Select Unit Type
              </option>

              <option>Bedsitter</option>
              <option>Studio</option>
              <option>1 Bedroom</option>
              <option>2 Bedroom</option>
              <option>3 Bedroom</option>
              <option>4 Bedroom</option>
              <option>Maisonette</option>
              <option>Shop</option>
              <option>Office</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Floor Number
            </label>

            <input
              type="number"
              value={floorNumber}
              onChange={(e) =>
                setFloorNumber(e.target.value)
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
                setBedrooms(Number(e.target.value))
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
                setBathrooms(Number(e.target.value))
              }
              className="w-full rounded-xl border p-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Size (Sq. M)
            </label>

            <input
              type="number"
              value={sizeSqm}
              onChange={(e) =>
                setSizeSqm(Number(e.target.value))
              }
              className="w-full rounded-xl border p-3"
            />
          </div>
        </div>
      </section>

      {/* Financial Information */}

      <section className="rounded-2xl border bg-white p-6">
        <h2 className="text-xl font-bold">
          Financial Information
        </h2>

        <p className="mt-1 text-gray-500">
          Configure rent and deposit.
        </p>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block font-medium">
              Monthly Rent
            </label>

            <input
              type="number"
              value={monthlyRent}
              onChange={(e) =>
                setMonthlyRent(Number(e.target.value))
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
                setDeposit(Number(e.target.value))
              }
              className="w-full rounded-xl border p-3"
            />
          </div>
        </div>
      </section>

      {/* Notes */}

      <section className="rounded-2xl border bg-white p-6">
        <h2 className="text-xl font-bold">
          Notes
        </h2>

        <p className="mt-1 text-gray-500">
          Optional internal notes.
        </p>

        <textarea
          rows={5}
          value={notes}
          onChange={(e) =>
            setNotes(e.target.value)
          }
          className="mt-6 w-full rounded-xl border p-3"
          placeholder="Enter notes..."
        />
      </section>

      {/* Actions */}

      <div className="flex justify-end gap-3 border-t pt-6">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="rounded-xl border px-6 py-3 font-semibold transition hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={async () => {
            if (!validate()) {
              return;
            }

            try {
              setLoading(true);

              const unitSequence =
                Number(
                  unitNumber.replace(/\D/g, "")
                ) || 1;

              if (editing) {
                await updateUnit(unit!.id, {
                  unit_number: unitNumber,
                  floor_number: floorNumber
                    ? Number(floorNumber)
                    : null,
                  unit_type: unitType || null,
                  bedrooms,
                  bathrooms,
                  size_sqm: sizeSqm,
                  monthly_rent: monthlyRent,
                  deposit,
                  notes: notes || null,
                });
              } else {
                await createUnit({
                  propertyId,
                  unitNumber,
                  unitSequence,
                  floorNumber: floorNumber
                    ? Number(floorNumber)
                    : undefined,
                  unitType: unitType || null,
                  bedrooms,
                  bathrooms,
                  sizeSqm,
                  monthlyRent,
                  deposit,
                  notes: notes || null,
                });
              }

              onSuccess();
            } catch (error: any) {
              console.error(error);
              alert(JSON.stringify(error, null, 2));
            } finally {
              setLoading(false);
            }
          }}
          className="rounded-xl bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? editing
              ? "Saving..."
              : "Creating..."
            : editing
            ? "Save Changes"
            : "Create Unit"}
        </button>
      </div>
    </div>
  );
}
