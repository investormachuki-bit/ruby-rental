"use client";

import { useEffect, useMemo, useState } from "react";

import { getProperties } from "@/services/properties/getProperties";
import { getUnits } from "@/services/units/getUnits";
import { getActiveLeases } from "@/services/leases/getActiveLeases";

export type ChargeScope =
  | "property"
  | "unit"
  | "lease";

export type RecurringChargeFormValues = {
  propertyId: string;

  scope: ChargeScope;

  unitId?: string;
  leaseId?: string;

  chargeName: string;
  customChargeName?: string;

  description?: string;

  amount: number;

  billingFrequency: string;

  startsOn: string;
  endsOn?: string;

  isMandatory: boolean;
  isActive: boolean;
};

type Props = {
  initialValues?: Partial<RecurringChargeFormValues>;

  loading?: boolean;

  onSubmit: (
    values: RecurringChargeFormValues
  ) => Promise<void>;
};

type Property = {
  id: string;
  name: string;
};

type Unit = {
  id: string;

  property_id: string;

  unit_number: string;
};

type ActiveLease = {
  id: string;

  lease_number: string;

  property_id: string;

  unit_id: string;

  tenant?: {
    id: string;

    full_name?: string;

    first_name?: string;

    last_name?: string;
  }[];
};

const BILLING_FREQUENCIES = [
  "Daily",
  "Weekly",
  "Monthly",
  "Quarterly",
  "Biannual",
  "Annual",
  "One Time",
];

const COMMON_CHARGES = [
  "Garbage Collection",
  "Parking",
  "Security",
  "Water",
  "Sewer",
  "Cleaning",
  "Internet",
  "Maintenance Fee",
  "Service Charge",
  "Other",
];

export default function RecurringChargeForm({
  initialValues,
  loading = false,
  onSubmit,
}: Props) {

  const [properties, setProperties] =
    useState<Property[]>([]);

  const [units, setUnits] =
    useState<Unit[]>([]);

  const [leases, setLeases] =
    useState<ActiveLease[]>([]);

  const [selectedTenant, setSelectedTenant] =
    useState("");

  const [selectedLease, setSelectedLease] =
    useState("");

  const [values, setValues] =
    useState<RecurringChargeFormValues>({
      propertyId:
        initialValues?.propertyId ?? "",

      scope:
        initialValues?.scope ??
        "property",

      unitId:
        initialValues?.unitId ?? "",

      leaseId:
        initialValues?.leaseId ?? "",

      chargeName:
        initialValues?.chargeName ?? "",

      customChargeName:
        initialValues?.customChargeName ??
        "",

      description:
        initialValues?.description ?? "",

      amount:
        initialValues?.amount ?? 0,

      billingFrequency:
        initialValues?.billingFrequency ??
        "Monthly",

      startsOn:
        initialValues?.startsOn ??
        new Date()
          .toISOString()
          .split("T")[0],

      endsOn:
        initialValues?.endsOn ?? "",

      isMandatory:
        initialValues?.isMandatory ??
        true,

      isActive:
        initialValues?.isActive ??
        true,
    });

  function update(
    key: keyof RecurringChargeFormValues,
    value: any
  ) {
    setValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  useEffect(() => {

    async function loadData() {
  try {
    const propertyData = await getProperties();

    console.log("✅ Properties:", propertyData);

    setProperties(
      propertyData.map((property: any) => ({
        id: property.id,
        name: property.name,
      }))
    );
  } catch (error) {
    console.error("❌ getProperties", error);
  }

  try {
    const unitData = await getUnits();

    console.log("✅ Units:", unitData);

    setUnits(unitData);
  } catch (error) {
    console.error("❌ getUnits", error);
  }

  try {try {
  alert("Before getActiveLeases");

  const leaseData = await getActiveLeases();

  alert("After getActiveLeases");

  alert(JSON.stringify(leaseData, null, 2));

  setLeases(leaseData);
} catch (error: any) {
  alert(
    "ERROR:\n\n" +
    (error?.message || JSON.stringify(error))
  );
}

}

loadData();
  }, []);

  const filteredUnits =
    useMemo(() => {

      return units.filter(
        (unit) =>
          unit.property_id ===
          values.propertyId
      );

    }, [
      units,
      values.propertyId,
    ]);

  const selectedProperty =
    properties.find(
      (property) =>
        property.id ===
        values.propertyId
    );

  const propertyUnitCount =
    filteredUnits.length;
    useEffect(() => {

    if (values.scope !== "unit") {

      setSelectedTenant("");
      setSelectedLease("");

      return;

    }

    if (!values.unitId) {

      update("leaseId", "");

      setSelectedTenant("");
      setSelectedLease("");

      return;

    }

    const lease = leases.find(
      (lease) =>
        lease.unit_id === values.unitId
    );

    if (!lease) {

      update("leaseId", "");

      setSelectedTenant("");
      setSelectedLease("");

      return;

    }

    update("leaseId", lease.id);

    setSelectedLease(
      lease.lease_number
    );

    const tenant =
      lease.tenant?.[0];

    const tenantName =
      tenant?.full_name ||
      `${tenant?.first_name ?? ""} ${tenant?.last_name ?? ""}`;

    setSelectedTenant(
      tenantName.trim()
    );

  }, [
    values.scope,
    values.unitId,
    leases,
  ]);

  async function handleSubmit(
    e: React.FormEvent
  ) {

    e.preventDefault();

    await onSubmit({

      ...values,

      chargeName:
        values.chargeName === "Other"
          ? values.customChargeName ?? ""
          : values.chargeName,

      amount: Number(values.amount),

    });

  }

  return (

    <form
      onSubmit={handleSubmit}
      className="space-y-8"
    >

      {/* PROPERTY ASSIGNMENT */}

      <div className="rounded-xl border bg-white p-6 shadow-sm">

        <h2 className="mb-5 text-lg font-semibold">
          Property Assignment
        </h2>

        <div className="grid gap-5 md:grid-cols-2">

          <div>

            <label className="mb-2 block text-sm font-medium">
              Property *
            </label>

            <select
              className="w-full rounded-lg border p-3"
              value={values.propertyId}
              onChange={(e) => {

                update(
                  "propertyId",
                  e.target.value
                );

                update("unitId", "");
                update("leaseId", "");

                setSelectedTenant("");
                setSelectedLease("");

              }}
              required
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

            <label className="mb-2 block text-sm font-medium">
              Applies To *
            </label>

            <div className="space-y-3 rounded-lg border p-4">

              <label className="flex items-center gap-3">

                <input
                  type="radio"
                  checked={
                    values.scope ===
                    "property"
                  }
                  onChange={() => {

                    update(
                      "scope",
                      "property"
                    );

                    update(
                      "unitId",
                      ""
                    );

                    update(
                      "leaseId",
                      ""
                    );

                    setSelectedTenant("");
                    setSelectedLease("");

                  }}
                />

                <span>

                  Entire Property

                  {values.propertyId &&
                    ` (${propertyUnitCount} Units)`}

                </span>

              </label>

              <label className="flex items-center gap-3">

                <input
                  type="radio"
                  checked={
                    values.scope ===
                    "unit"
                  }
                  onChange={() =>
                    update(
                      "scope",
                      "unit"
                    )
                  }
                />

                <span>
                  Specific Unit
                </span>

              </label>

            </div>

          </div>

        </div>

        {values.scope === "property" &&
          values.propertyId && (

            <div className="mt-5 rounded-lg border border-yellow-300 bg-yellow-50 p-4">

              <p className="text-sm text-yellow-900">

                <strong>Important:</strong>

                {" "}
                This recurring charge will
                automatically be added to
                invoices for every applicable
                unit in{" "}
                <strong>
                  {selectedProperty?.name}
                </strong>
                .

              </p>

            </div>

        )}

        {values.scope === "unit" && (

          <div className="mt-6 grid gap-5 md:grid-cols-2">

            <div>

              <label className="mb-2 block text-sm font-medium">
                Unit *
              </label>

              <select
                className="w-full rounded-lg border p-3"
                disabled={!values.propertyId}
                value={values.unitId}
                onChange={(e) =>
                  update(
                    "unitId",
                    e.target.value
                  )
                }
                required
              >

                <option value="">

                  {values.propertyId
                    ? "Select Unit"
                    : "Select Property First"}

                </option>

                {filteredUnits.map(
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

            <div>

              <label className="mb-2 block text-sm font-medium">
                Tenant
              </label>

              <input
                readOnly
                className="w-full rounded-lg border bg-gray-100 p-3"
                value={selectedTenant}
                placeholder="No active tenant"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium">
                Active Lease
              </label>

              <input
                readOnly
                className="w-full rounded-lg border bg-gray-100 p-3"
                value={selectedLease}
                placeholder="No active lease"
              />

            </div>

          </div>
      
        )}
        </div>
        
           {/* CHARGE DETAILS */}

      <div className="rounded-xl border bg-white p-6 shadow-sm">

        <h2 className="mb-5 text-lg font-semibold">
          Charge Details
        </h2>

        <div className="grid gap-5 md:grid-cols-2">

          <div>

            <label className="mb-2 block text-sm font-medium">
              Charge Name *
            </label>

            <select
              className="w-full rounded-lg border p-3"
              value={values.chargeName}
              onChange={(e) =>
                update(
                  "chargeName",
                  e.target.value
                )
              }
              required
            >

              <option value="">
                Select Charge
              </option>

              {COMMON_CHARGES.map(
                (charge) => (

                  <option
                    key={charge}
                    value={charge}
                  >
                    {charge}
                  </option>

                )
              )}

            </select>

            {values.chargeName === "Other" && (

              <input
                className="mt-3 w-full rounded-lg border p-3"
                placeholder="Enter custom charge name"
                value={
                  values.customChargeName
                }
                onChange={(e) =>
                  update(
                    "customChargeName",
                    e.target.value
                  )
                }
                required
              />

            )}

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium">
              Amount (KES) *
            </label>

            <input
              type="number"
              min="0"
              step="0.01"
              className="w-full rounded-lg border p-3"
              placeholder="0.00"
              value={values.amount}
              onChange={(e) =>
                update(
                  "amount",
                  e.target.value
                )
              }
              required
            />

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium">
              Billing Frequency *
            </label>

            <select
              className="w-full rounded-lg border p-3"
              value={
                values.billingFrequency
              }
              onChange={(e) =>
                update(
                  "billingFrequency",
                  e.target.value
                )
              }
            >

              {BILLING_FREQUENCIES.map(
                (frequency) => (

                  <option
                    key={frequency}
                    value={frequency}
                  >
                    {frequency}
                  </option>

                )
              )}

            </select>

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium">
              Effective From *
            </label>

            <input
              type="date"
              className="w-full rounded-lg border p-3"
              value={values.startsOn}
              onChange={(e) =>
                update(
                  "startsOn",
                  e.target.value
                )
              }
              required
            />

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium">
              Ends On
            </label>

            <input
              type="date"
              className="w-full rounded-lg border p-3"
              value={values.endsOn}
              onChange={(e) =>
                update(
                  "endsOn",
                  e.target.value
                )
              }
            />

          </div>

          <div className="md:col-span-2">

            <label className="mb-2 block text-sm font-medium">
              Description
            </label>

            <textarea
              rows={4}
              className="w-full rounded-lg border p-3"
              placeholder="Optional notes about this recurring charge..."
              value={
                values.description
              }
              onChange={(e) =>
                update(
                  "description",
                  e.target.value
                )
              }
            />

          </div>

        </div>

      </div>

      {/* CHARGE SETTINGS */}

      <div className="rounded-xl border bg-white p-6 shadow-sm">

        <h2 className="mb-5 text-lg font-semibold">
          Charge Behaviour
        </h2>

        <div className="space-y-4">

          <label className="flex items-center gap-3">

            <input
              type="checkbox"
              checked={values.isMandatory}
              onChange={(e) =>
                update(
                  "isMandatory",
                  e.target.checked
                )
              }
            />

            <span>
              Mandatory charge for applicable tenants
            </span>

          </label>

          <label className="flex items-center gap-3">

            <input
              type="checkbox"
              checked={values.isActive}
              onChange={(e) =>
                update(
                  "isActive",
                  e.target.checked
                )
              }
            />

            <span>
              Charge is active and should be included during invoice generation
            </span>

          </label>

        </div>

      </div>   
              {/* ACTION BUTTONS */}

      <div className="flex items-center justify-between rounded-xl border bg-white p-6 shadow-sm">

        <div>

          <p className="font-medium">
            Ready to save?
          </p>

          <p className="text-sm text-gray-500">

            {values.scope === "property"
              ? "This charge will be available for invoice generation across the selected property."
              : "This charge will only apply to the selected unit."}

          </p>

        </div>

        <div className="flex items-center gap-3">

          <button
            type="reset"
            onClick={() => window.history.back()}
            className="rounded-lg border border-gray-300 px-6 py-3 font-medium transition hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={
              loading ||
              !values.propertyId ||
              !values.chargeName ||
              (values.scope === "unit" &&
                !values.unitId)
            }
            className="rounded-lg bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Saving..."
              : "Save Recurring Charge"}
          </button>

        </div>

      </div>

    </form>

  );

}
  
