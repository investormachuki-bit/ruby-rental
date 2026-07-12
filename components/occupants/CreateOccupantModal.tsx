"use client";

import { useEffect, useState } from "react";

import { createOccupant } from "@/services/occupants/createOccupant";
import { getPropertyOptions } from "@/services/properties/getPropertyOptions";
import { getVacantUnits } from "@/services/units/getVacantUnits";

type Props = {
  onClose: () => void;
  onSaved: () => void;
};

export default function CreateOccupantModal({
  onClose,
  onSaved,
}: Props) {
  const [loading, setLoading] =
    useState(false);

  const [properties, setProperties] =
    useState<any[]>([]);

  const [units, setUnits] =
    useState<any[]>([]);

  const [propertyId, setPropertyId] =
    useState("");

  const [unitId, setUnitId] =
    useState("");

  const [fullName, setFullName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [idNumber, setIdNumber] =
    useState("");

  const [occupation, setOccupation] =
    useState("");

  const [employer, setEmployer] =
    useState("");

  const [
    emergencyContactName,
    setEmergencyContactName,
  ] = useState("");

  const [
    emergencyContactPhone,
    setEmergencyContactPhone,
  ] = useState("");

  const [moveInDate, setMoveInDate] =
    useState(
      new Date()
        .toISOString()
        .split("T")[0]
    );

  const [notes, setNotes] =
    useState("");

  useEffect(() => {
    loadProperties();
  }, []);

  async function loadProperties() {
    try {
      const data =
        await getPropertyOptions();

      setProperties(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function handlePropertyChange(
    value: string
  ) {
    setPropertyId(value);
    setUnitId("");

    if (!value) {
      setUnits([]);
      return;
    }

    const vacantUnits =
      await getVacantUnits(value);

    setUnits(vacantUnits);
  }

  async function handleSave() {
    if (!propertyId) {
      alert("Select a property.");
      return;
    }

    if (!fullName.trim()) {
      alert("Full name is required.");
      return;
    }

    if (!phone.trim()) {
      alert("Phone number is required.");
      return;
    }

    try {
      setLoading(true);

      await createOccupant({
        propertyId,

        unitId:
          unitId || null,

        fullName,

        phone,

        email,

        idNumber,

        occupation,

        employer,

        emergencyContactName,

        emergencyContactPhone,

        moveInDate,

        notes,
      });

      alert(
        "Occupant created successfully."
      );

      onSaved();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">

      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">

        <div className="border-b p-6">

          <h2 className="text-2xl font-bold">
            Add Occupant
          </h2>

          <p className="mt-2 text-gray-500">
            Create a new tenant or occupant.
          </p>

        </div>

        <div className="space-y-5 p-6">
                    <div>

            <label className="mb-2 block font-medium">
              Property <span className="text-red-500">*</span>
            </label>

            <select
              value={propertyId}
              onChange={(e) =>
                handlePropertyChange(
                  e.target.value
                )
              }
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
              Unit (Optional)
            </label>

            <select
              value={unitId}
              onChange={(e) =>
                setUnitId(e.target.value)
              }
              disabled={!propertyId}
              className="w-full rounded-xl border p-3 disabled:bg-gray-100"
            >
              <option value="">
                Leave Unassigned
              </option>

              {units.map((unit) => (
                <option
                  key={unit.id}
                  value={unit.id}
                >
                  {unit.floor_name
                    ? `${unit.floor_name} - ${unit.unit_number}`
                    : unit.unit_number}
                </option>
              ))}

            </select>

            <p className="mt-1 text-xs text-gray-500">
              If a unit is selected, it will automatically
              be marked as Occupied.
            </p>

          </div>

          <div className="grid gap-5 md:grid-cols-2">

            <div>

              <label className="mb-2 block font-medium">
                Full Name <span className="text-red-500">*</span>
              </label>

              <input
                value={fullName}
                onChange={(e) =>
                  setFullName(
                    e.target.value
                  )
                }
                placeholder="John Doe"
                className="w-full rounded-xl border p-3"
              />

            </div>

            <div>

              <label className="mb-2 block font-medium">
                Phone Number <span className="text-red-500">*</span>
              </label>

              <input
                value={phone}
                onChange={(e) =>
                  setPhone(
                    e.target.value
                  )
                }
                placeholder="07XXXXXXXX"
                className="w-full rounded-xl border p-3"
              />

            </div>

          </div>

          <div className="grid gap-5 md:grid-cols-2">

            <div>

              <label className="mb-2 block font-medium">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                placeholder="john@example.com"
                className="w-full rounded-xl border p-3"
              />

            </div>

            <div>

              <label className="mb-2 block font-medium">
                ID Number
              </label>

              <input
                value={idNumber}
                onChange={(e) =>
                  setIdNumber(
                    e.target.value
                  )
                }
                placeholder="National ID"
                className="w-full rounded-xl border p-3"
              />

            </div>

          </div>
                    <div className="grid gap-5 md:grid-cols-2">

            <div>

              <label className="mb-2 block font-medium">
                Occupation
              </label>

              <input
                value={occupation}
                onChange={(e) =>
                  setOccupation(
                    e.target.value
                  )
                }
                placeholder="Business Owner"
                className="w-full rounded-xl border p-3"
              />

            </div>

            <div>

              <label className="mb-2 block font-medium">
                Employer
              </label>

              <input
                value={employer}
                onChange={(e) =>
                  setEmployer(
                    e.target.value
                  )
                }
                placeholder="ABC Company Ltd"
                className="w-full rounded-xl border p-3"
              />

            </div>

          </div>

          <div className="grid gap-5 md:grid-cols-2">

            <div>

              <label className="mb-2 block font-medium">
                Emergency Contact Name
              </label>

              <input
                value={emergencyContactName}
                onChange={(e) =>
                  setEmergencyContactName(
                    e.target.value
                  )
                }
                placeholder="Jane Doe"
                className="w-full rounded-xl border p-3"
              />

            </div>

            <div>

              <label className="mb-2 block font-medium">
                Emergency Contact Phone
              </label>

              <input
                value={emergencyContactPhone}
                onChange={(e) =>
                  setEmergencyContactPhone(
                    e.target.value
                  )
                }
                placeholder="07XXXXXXXX"
                className="w-full rounded-xl border p-3"
              />

            </div>

          </div>

          <div>

            <label className="mb-2 block font-medium">
              Move In Date
            </label>

            <input
              type="date"
              value={moveInDate}
              onChange={(e) =>
                setMoveInDate(
                  e.target.value
                )
              }
              className="w-full rounded-xl border p-3"
            />

          </div>

          <div>

            <label className="mb-2 block font-medium">
              Notes
            </label>

            <textarea
              rows={4}
              value={notes}
              onChange={(e) =>
                setNotes(
                  e.target.value
                )
              }
              placeholder="Optional notes..."
              className="w-full rounded-xl border p-3"
            />

          </div>

        </div>

        <div className="flex justify-end gap-3 border-t p-6">

          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border px-6 py-3"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            className="rounded-xl bg-black px-6 py-3 font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {loading
              ? "Saving..."
              : "Save Occupant"}
          </button>

        </div>

      </div>

    </div>
  );
}
