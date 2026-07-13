"use client";

import { useEffect, useState } from "react";

import { createLease } from "@/services/leases/createLease";
import { activateLease } from "@/services/leases/activateLease";

import { getProperties } from "@/services/properties/getAll";
import { getOccupants } from "@/services/occupants/getOccupants";
import { getPropertyUnits } from "@/services/units/getPropertyUnits";

type Property = {
  id: string;
  name: string;
};

type Occupant = {
  id: string;
  first_name: string;
  last_name: string;
};

type Unit = {
  id: string;
  unit_number: string;
  monthly_rent: number;
  deposit: number;
  status: string;
};

type Props = {
  onSuccess: () => void;
  onCancel: () => void;
};

export default function CreateLeaseModal({
  onSuccess,
  onCancel,
}: Props) {

  const [loading, setLoading] =
    useState(false);

  const [properties, setProperties] =
    useState<Property[]>([]);

  const [occupants, setOccupants] =
    useState<Occupant[]>([]);

  const [units, setUnits] =
    useState<Unit[]>([]);

  const [leaseType, setLeaseType] =
    useState("Open-ended");

  const [activateNow, setActivateNow] =
    useState(false);

  const [form, setForm] = useState({

    occupant_id: "",

    property_id: "",

    unit_id: "",

    start_date: "",

    end_date: "",

    rent_amount: "",

    deposit_amount: "",

    rent_due_day: "5",

    grace_period_days: "0",

    notes: "",

  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {

    const props =
      await getProperties();

    const occs =
      await getOccupants();

    setProperties(props);

    setOccupants(occs);

  }
    useEffect(() => {

    if (!form.property_id) {
      setUnits([]);
      return;
    }

    loadUnits(form.property_id);

  }, [form.property_id]);

  async function loadUnits(
    propertyId: string
  ) {

    const data =
      await getPropertyUnits(propertyId);

    setUnits(
      data.filter(
        (unit: Unit) =>
          unit.status === "Vacant"
      )
    );

  }

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLSelectElement |
      HTMLTextAreaElement
    >
  ) {

    setForm((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.value,
    }));

  }

  function handleUnitChange(
    unitId: string
  ) {

    const unit =
      units.find(
        (u) => u.id === unitId
      );

    if (!unit) return;

    setForm((prev) => ({
      ...prev,

      unit_id: unitId,

      rent_amount:
        String(
          unit.monthly_rent
        ),

      deposit_amount:
        String(
          unit.deposit
        ),

    }));

  }

  async function handleSubmit() {

    try {

      setLoading(true);

      const lease =
        await createLease({

          property_id:
            form.property_id,

          unit_id:
            form.unit_id,

          occupant_id:
            form.occupant_id,

          start_date:
            form.start_date,

          end_date:
            leaseType ===
            "Fixed Term"
              ? form.end_date
              : null,

          rent_amount:
            Number(
              form.rent_amount
            ),

          deposit_amount:
            Number(
              form.deposit_amount
            ),

          rent_due_day:
            Number(
              form.rent_due_day
            ),

          grace_period_days:
            Number(
              form.grace_period_days
            ),

          notes:
            form.notes,

          lease_type:
            leaseType,

        });

      if (activateNow) {

        await activateLease(
          lease.id
        );

      }

      onSuccess();

    } catch (error) {

      console.error(error);

      alert(
        "Failed to save lease."
      );

    } finally {

      setLoading(false);

    }

  }

  return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">

      <div className="max-h-[95vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

        <div className="border-b p-6">

          <h2 className="text-2xl font-bold">
            Create New Lease
          </h2>

          <p className="mt-2 text-gray-500">
            Create a rental agreement between an occupant and a unit.
          </p>

        </div>

        <div className="space-y-8 p-6">

          {/* Occupancy */}

          <div className="rounded-2xl border p-6">

            <h3 className="mb-5 text-lg font-semibold">
              Occupancy
            </h3>

            <div className="grid gap-5 md:grid-cols-3">

              <div>

                <label className="mb-2 block font-medium">
                  Occupant
                </label>

                <select
                  name="occupant_id"
                  value={form.occupant_id}
                  onChange={handleChange}
                  className="w-full rounded-xl border p-3"
                >
                  <option value="">
                    Select Occupant
                  </option>

                  {occupants.map(
                    (occupant) => (

                      <option
                        key={occupant.id}
                        value={occupant.id}
                      >
                        {occupant.first_name}{" "}
                        {occupant.last_name}
                      </option>

                    )
                  )}

                </select>

              </div>

              <div>

                <label className="mb-2 block font-medium">
                  Property
                </label>

                <select
                  name="property_id"
                  value={form.property_id}
                  onChange={handleChange}
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

              <div>

                <label className="mb-2 block font-medium">
                  Unit
                </label>

                <select
                  value={form.unit_id}
                  onChange={(e) =>
                    handleUnitChange(
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border p-3"
                >
                  <option value="">
                    Select Vacant Unit
                  </option>

                  {units.map(
                    (unit) => (

                      <option
                        key={unit.id}
                        value={unit.id}
                      >
                        {unit.unit_number}
                      </option>

                    )
                  )}

                </select>

              </div>

            </div>

          </div>

          {/* Lease Terms */}

          <div className="rounded-2xl border p-6">

            <h3 className="mb-5 text-lg font-semibold">
              Lease Terms
            </h3>

            <div className="space-y-5">

              <div className="flex gap-6">

                <label className="flex items-center gap-2">

                  <input
                    type="radio"
                    checked={
                      leaseType ===
                      "Open-ended"
                    }
                    onChange={() =>
                      setLeaseType(
                        "Open-ended"
                      )
                    }
                  />

                  Open-ended

                </label>

                <label className="flex items-center gap-2">

                  <input
                    type="radio"
                    checked={
                      leaseType ===
                      "Fixed Term"
                    }
                    onChange={() =>
                      setLeaseType(
                        "Fixed Term"
                      )
                    }
                  />

                  Fixed Term

                </label>

              </div>

              <div className="grid gap-5 md:grid-cols-2">

                <div>

                  <label className="mb-2 block font-medium">
                    Lease Start Date
                  </label>

                  <input
                    type="date"
                    name="start_date"
                    value={form.start_date}
                    onChange={handleChange}
                    className="w-full rounded-xl border p-3"
                  />

                </div>

                {leaseType ===
                  "Fixed Term" && (

                  <div>

                    <label className="mb-2 block font-medium">
                      Lease End Date
                    </label>

                    <input
                      type="date"
                      name="end_date"
                      value={form.end_date}
                      onChange={handleChange}
                      className="w-full rounded-xl border p-3"
                    />

                  </div>

                )}

              </div>

            </div>

          </div>
                    {/* Financial Terms */}

          <div className="rounded-2xl border p-6">

            <h3 className="mb-5 text-lg font-semibold">
              Financial Terms
            </h3>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">

              <div>

                <label className="mb-2 block font-medium">
                  Monthly Rent
                </label>

                <input
                  type="number"
                  name="rent_amount"
                  value={form.rent_amount}
                  onChange={handleChange}
                  className="w-full rounded-xl border p-3"
                />

              </div>

              <div>

                <label className="mb-2 block font-medium">
                  Deposit
                </label>

                <input
                  type="number"
                  name="deposit_amount"
                  value={form.deposit_amount}
                  onChange={handleChange}
                  className="w-full rounded-xl border p-3"
                />

              </div>

              <div>

                <label className="mb-2 block font-medium">
                  Rent Due Day
                </label>

                <select
                  name="rent_due_day"
                  value={form.rent_due_day}
                  onChange={handleChange}
                  className="w-full rounded-xl border p-3"
                >
                  {Array.from(
                    { length: 31 },
                    (_, i) => i + 1
                  ).map((day) => (
                    <option
                      key={day}
                      value={day}
                    >
                      {day}
                    </option>
                  ))}
                </select>

              </div>

              <div>

                <label className="mb-2 block font-medium">
                  Grace Period
                </label>

                <select
                  name="grace_period_days"
                  value={form.grace_period_days}
                  onChange={handleChange}
                  className="w-full rounded-xl border p-3"
                >
                  {[0,1,2,3,5,7,10,14,21,30].map(
                    (days) => (
                      <option
                        key={days}
                        value={days}
                      >
                        {days} Day{days === 1 ? "" : "s"}
                      </option>
                    )
                  )}
                </select>

              </div>

            </div>

          </div>

          {/* Notes */}

          <div className="rounded-2xl border p-6">

            <h3 className="mb-5 text-lg font-semibold">
              Notes
            </h3>

            <textarea
              rows={5}
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Optional notes..."
              className="w-full rounded-xl border p-3"
            />

          </div>

          {/* Activate Immediately */}

          <div className="rounded-2xl border bg-blue-50 p-5">

            <label className="flex items-center gap-3">

              <input
                type="checkbox"
                checked={activateNow}
                onChange={(e) =>
                  setActivateNow(
                    e.target.checked
                  )
                }
              />

              <div>

                <p className="font-semibold">
                  Activate Lease Immediately
                </p>

                <p className="text-sm text-gray-600">
                  The unit will become occupied
                  and the occupant will become
                  active immediately after saving.
                </p>

              </div>

            </label>

          </div>

        </div>

        {/* Footer */}

        <div className="flex flex-col-reverse gap-3 border-t p-6 md:flex-row md:justify-end">

          <button
            onClick={onCancel}
            disabled={loading}
            className="rounded-xl border px-6 py-3"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={() => {
              setActivateNow(false);
              handleSubmit();
            }}
            className="rounded-xl bg-gray-700 px-6 py-3 font-semibold text-white hover:bg-gray-800"
          >
            Save Draft
          </button>

          <button
            disabled={loading}
            onClick={() => {
              setActivateNow(true);
              handleSubmit();
            }}
            className="rounded-xl bg-black px-6 py-3 font-semibold text-white hover:bg-gray-900"
          >
            {loading
              ? "Saving..."
              : "Activate Lease"}
          </button>

        </div>

      </div>

    </div>
  );
}
