"use client";

import { useEffect, useState } from "react";

import SectionCard from "@/components/common/SectionCard";
import StickyActionBar from "@/components/common/StickyActionBar";

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
  phone_number?: string;
  email?: string;
  id_number?: string;
};

type Unit = {
  id: string;
  unit_number: string;
  monthly_rent: number;
  deposit: number;
  status: string;
  floor_name?: string;
  water_type?: string;
  electricity_type?: string;
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

  const [activateNow, setActivateNow] =
    useState(false);

  const [leaseType, setLeaseType] =
    useState<"Open-ended" | "Fixed Term">(
      "Open-ended"
    );

  const [properties, setProperties] =
    useState<Property[]>([]);

  const [occupants, setOccupants] =
    useState<Occupant[]>([]);

  const [units, setUnits] =
    useState<Unit[]>([]);

  const [selectedUnit, setSelectedUnit] =
    useState<Unit | null>(null);

  const [selectedOccupant, setSelectedOccupant] =
    useState<Occupant | null>(null);

  const [form, setForm] = useState({

    property_id: "",

    unit_id: "",

    occupant_id: "",

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

    setProperties(props ?? []);

    setOccupants(occs ?? []);

  }
    useEffect(() => {

    if (!form.property_id) {

      setUnits([]);
      setSelectedUnit(null);

      setForm((prev) => ({
        ...prev,
        unit_id: "",
      }));

      return;
    }

    loadUnits(form.property_id);

  }, [form.property_id]);

  async function loadUnits(
    propertyId: string
  ) {

    const data =
      await getPropertyUnits(propertyId);

    const vacantUnits = (data ?? []).filter(
      (unit: Unit) =>
        unit.status === "Vacant"
    );

    setUnits(vacantUnits);

  }

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLSelectElement |
      HTMLTextAreaElement
    >
  ) {

    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
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

    setSelectedUnit(unit);

    setForm((prev) => ({
      ...prev,

      unit_id: unit.id,

      rent_amount:
        String(unit.monthly_rent),

      deposit_amount:
        String(unit.deposit),

    }));

  }

  function handleOccupantChange(
    occupantId: string
  ) {

    const occupant =
      occupants.find(
        (o) => o.id === occupantId
      );

    if (!occupant) return;

    setSelectedOccupant(
      occupant
    );

    setForm((prev) => ({
      ...prev,
      occupant_id: occupant.id,
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

          lease_type:
            leaseType,

          notes:
            form.notes,

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
        "Failed to create lease."
      );

    } finally {

      setLoading(false);

    }

  }

  return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">

      <div className="flex max-h-[95vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-gray-50 shadow-2xl">

        {/* Header */}

        <div className="border-b bg-white p-6">

          <h2 className="text-2xl font-bold">
            Create New Lease
          </h2>

          <p className="mt-2 text-gray-500">
            Create a lease agreement between a vacant unit and an occupant.
          </p>

        </div>

        {/* Body */}

        <div className="flex-1 space-y-6 overflow-y-auto p-6">

          {/* Property & Unit */}

          <SectionCard
            title="🏢 Property & Unit"
            description="Select the property and a vacant unit."
            completed={
              form.property_id !== "" &&
              form.unit_id !== ""
            }
          >

            <div className="grid gap-5 lg:grid-cols-2">

              <div>

                <label className="mb-2 block font-medium">
                  Property
                </label>

                <select
                  name="property_id"
                  value={form.property_id}
                  onChange={handleChange}
                  className="w-full rounded-xl border bg-white p-3"
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
                  Vacant Unit
                </label>

                <select
                  value={form.unit_id}
                  onChange={(e) =>
                    handleUnitChange(
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border bg-white p-3"
                >

                  <option value="">
                    Select Unit
                  </option>

                  {units.map((unit) => (

                    <option
                      key={unit.id}
                      value={unit.id}
                    >
                      {unit.unit_number}
                    </option>

                  ))}

                </select>

              </div>

            </div>

            {selectedUnit && (

              <div className="mt-6 rounded-xl border bg-slate-50 p-5">

                <h4 className="mb-4 font-semibold">
                  Selected Unit
                </h4>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

                  <div>

                    <p className="text-xs uppercase text-gray-500">
                      Unit
                    </p>

                    <p className="font-semibold">
                      {selectedUnit.unit_number}
                    </p>

                  </div>

                  <div>

                    <p className="text-xs uppercase text-gray-500">
                      Monthly Rent
                    </p>

                    <p className="font-semibold">
                      KSh {selectedUnit.monthly_rent.toLocaleString()}
                    </p>

                  </div>

                  <div>

                    <p className="text-xs uppercase text-gray-500">
                      Deposit
                    </p>

                    <p className="font-semibold">
                      KSh {selectedUnit.deposit.toLocaleString()}
                    </p>

                  </div>

                  <div>

                    <p className="text-xs uppercase text-gray-500">
                      Floor
                    </p>

                    <p className="font-semibold">
                      {selectedUnit.floor_name ?? "-"}
                    </p>

                  </div>

                </div>

              </div>

            )}

          </SectionCard>

          {/* Occupant */}

          <SectionCard
            title="👤 Occupant"
            description="Assign the occupant to the selected unit."
            completed={
              form.occupant_id !== ""
            }
          >

            <div>

              <label className="mb-2 block font-medium">
                Occupant
              </label>

              <select
                value={form.occupant_id}
                onChange={(e) =>
                  handleOccupantChange(
                    e.target.value
                  )
                }
                className="w-full rounded-xl border bg-white p-3"
              >

                <option value="">
                  Select Occupant
                </option>

                {occupants.map((occupant) => (

  <option
    key={occupant.id}
    value={occupant.id}
  >
    {occupant.first_name} {occupant.last_name}
  </option>

))}
              </select>

            </div>

            {selectedOccupant && (

              <div className="mt-6 rounded-xl border bg-slate-50 p-5">

                <h4 className="mb-4 font-semibold">
                  Selected Occupant
                </h4>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

                  <div>
                    <p className="text-xs uppercase text-gray-500">
                      Name
                    </p>

                    <p className="font-semibold">
                      {selectedOccupant.first_name}{" "}
                      {selectedOccupant.last_name}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase text-gray-500">
                      Phone
                    </p>

                    <p className="font-semibold">
                      {selectedOccupant.phone_number ?? "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase text-gray-500">
                      ID Number
                    </p>

                    <p className="font-semibold">
                      {selectedOccupant.id_number ?? "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase text-gray-500">
                      Email
                    </p>

                    <p className="font-semibold">
                      {selectedOccupant.email ?? "-"}
                    </p>
                  </div>

                </div>

              </div>

            )}

          </SectionCard>

          {/* Lease Terms */}

          <SectionCard
            title="📄 Lease Terms"
            description="Configure the lease period."
            completed={
              form.start_date !== "" &&
              (
                leaseType === "Open-ended" ||
                form.end_date !== ""
              )
            }
          >

            <div className="space-y-6">

              <div className="flex flex-wrap gap-6">

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={leaseType === "Open-ended"}
                    onChange={() =>
                      setLeaseType("Open-ended")
                    }
                  />
                  Open-ended
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={leaseType === "Fixed Term"}
                    onChange={() =>
                      setLeaseType("Fixed Term")
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
                    className="w-full rounded-xl border bg-white p-3"
                  />

                </div>

                {leaseType === "Fixed Term" && (

                  <div>

                    <label className="mb-2 block font-medium">
                      Lease End Date
                    </label>

                    <input
                      type="date"
                      name="end_date"
                      value={form.end_date}
                      onChange={handleChange}
                      className="w-full rounded-xl border bg-white p-3"
                    />

                  </div>

                )}

              </div>

            </div>

          </SectionCard>

          {/* Financial Terms */}

          <SectionCard
            title="💰 Financial Terms"
            description="Configure rent and payment schedule."
            completed={
              form.rent_amount !== "" &&
              form.deposit_amount !== ""
            }
          >
                        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

              <div>

                <label className="mb-2 block font-medium">
                  Monthly Rent
                </label>

                <input
                  type="number"
                  name="rent_amount"
                  value={form.rent_amount}
                  onChange={handleChange}
                  className="w-full rounded-xl border bg-white p-3"
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
                  className="w-full rounded-xl border bg-white p-3"
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
                  className="w-full rounded-xl border bg-white p-3"
                >
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                    <option key={day} value={day}>
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
                  className="w-full rounded-xl border bg-white p-3"
                >
                  {[0, 1, 2, 3, 5, 7, 10, 14, 21, 30].map((days) => (
                    <option
                      key={days}
                      value={days}
                    >
                      {days} Day{days === 1 ? "" : "s"}
                    </option>
                  ))}
                </select>

              </div>

            </div>

          </SectionCard>

          <SectionCard
            title="📝 Notes"
            description="Optional notes for this lease."
          >

            <textarea
              rows={5}
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Enter additional notes..."
              className="w-full rounded-xl border bg-white p-4"
            />

          </SectionCard>

        </div>

        <StickyActionBar
          loading={loading}
          onCancel={onCancel}
          onSaveDraft={() => {
            setActivateNow(false);
            handleSubmit();
          }}
          onPrimary={() => {
            setActivateNow(true);
            handleSubmit();
          }}
          primaryText="Activate Lease"
        />

      </div>

    </div>

  );
}
                  
          
