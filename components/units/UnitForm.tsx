"use client";

import { useEffect, useState } from "react";

import { getProperties } from "@/services/properties/getAll";

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

  const [loading, setLoading] =
    useState(false);

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

  const [
    waterMeterNumber,
    setWaterMeterNumber,
  ] = useState("");

  const [
    electricityMeterNumber,
    setElectricityMeterNumber,
  ] = useState("");

  const [
    gasMeterNumber,
    setGasMeterNumber,
  ] = useState("");

  const [
    internetAccountNumber,
    setInternetAccountNumber,
  ] = useState("");

  const [garbageFee, setGarbageFee] =
    useState(0);

  const [securityFee, setSecurityFee] =
    useState(0);

  const [sewerFee, setSewerFee] =
    useState(0);

  const [parkingFee, setParkingFee] =
    useState(0);

  const [internetFee, setInternetFee] =
    useState(0);

  const [
    serviceCharge,
    setServiceCharge,
  ] = useState(0);

  const [status, setStatus] =
    useState("Vacant");

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

    setSizeSqm(Number(unit.size_sqm));

    setMonthlyRent(
      Number(unit.monthly_rent)
    );

    setDeposit(
      Number(unit.deposit)
    );

    setWaterMeterNumber(
      unit.water_meter_number ?? ""
    );

    setElectricityMeterNumber(
      unit.electricity_meter_number ?? ""
    );

    setGasMeterNumber(
      unit.gas_meter_number ?? ""
    );

    setInternetAccountNumber(
      unit.internet_account_number ?? ""
    );

    setGarbageFee(
      Number(unit.garbage_fee)
    );

    setSecurityFee(
      Number(unit.security_fee)
    );

    setSewerFee(
      Number(unit.sewer_fee)
    );

    setParkingFee(
      Number(unit.parking_fee)
    );

    setInternetFee(
      Number(unit.internet_fee)
    );

    setServiceCharge(
      Number(unit.service_charge)
    );

    setStatus(unit.status);

    setNotes(unit.notes ?? "");

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

      alert("Please select a property.");

      return false;

    }

    if (!unitNumber.trim()) {

      alert("Unit number is required.");

      return false;

    }

    if (monthlyRent < 0) {

      alert("Monthly rent cannot be negative.");

      return false;

    }

    if (deposit < 0) {

      alert("Deposit cannot be negative.");

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
                setPropertyId(
                  e.target.value
                )
              }
              disabled={editing}
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

              Unit Number

            </label>

            <input
              value={unitNumber}
              onChange={(e) =>
                setUnitNumber(
                  e.target.value
                )
              }
              className="w-full rounded-xl border p-3"
            />

          </div>

          <div>

            <label className="mb-2 block font-medium">

              Unit Type

            </label>

            <select
              value={unitType}
              onChange={(e) =>
                setUnitType(
                  e.target.value
                )
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
                setFloorNumber(
                  e.target.value
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

          <div>

            <label className="mb-2 block font-medium">

              Size (Sq. M)

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

        </div>

      </section>

      {/* Financial */}

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

      </section>
            {/* Utilities */}

      <section className="rounded-2xl border bg-white p-6">

        <h2 className="text-xl font-bold">

          Utility Information

        </h2>

        <p className="mt-1 text-gray-500">

          Enter utility meter and account details.

        </p>

        <div className="mt-6 grid gap-5 md:grid-cols-2">

          <div>

            <label className="mb-2 block font-medium">

              Water Meter Number

            </label>

            <input
              value={waterMeterNumber}
              onChange={(e) =>
                setWaterMeterNumber(
                  e.target.value
                )
              }
              className="w-full rounded-xl border p-3"
            />

          </div>

          <div>

            <label className="mb-2 block font-medium">

              Electricity Meter Number

            </label>

            <input
              value={electricityMeterNumber}
              onChange={(e) =>
                setElectricityMeterNumber(
                  e.target.value
                )
              }
              className="w-full rounded-xl border p-3"
            />

          </div>

          <div>

            <label className="mb-2 block font-medium">

              Gas Meter Number

            </label>

            <input
              value={gasMeterNumber}
              onChange={(e) =>
                setGasMeterNumber(
                  e.target.value
                )
              }
              className="w-full rounded-xl border p-3"
            />

          </div>

          <div>

            <label className="mb-2 block font-medium">

              Internet Account Number

            </label>

            <input
              value={internetAccountNumber}
              onChange={(e) =>
                setInternetAccountNumber(
                  e.target.value
                )
              }
              className="w-full rounded-xl border p-3"
            />

          </div>

        </div>

      </section>

      {/* Recurring Charges */}

      <section className="rounded-2xl border bg-white p-6">

        <h2 className="text-xl font-bold">

          Recurring Charges

        </h2>

        <p className="mt-1 text-gray-500">

          Configure the monthly recurring charges for this unit.

        </p>

        <div className="mt-6 grid gap-5 md:grid-cols-2">

          <div>

            <label className="mb-2 block font-medium">

              Garbage Fee

            </label>

            <input
              type="number"
              value={garbageFee}
              onChange={(e) =>
                setGarbageFee(
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

              Security Fee

            </label>

            <input
              type="number"
              value={securityFee}
              onChange={(e) =>
                setSecurityFee(
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

              Sewer Fee

            </label>

            <input
              type="number"
              value={sewerFee}
              onChange={(e) =>
                setSewerFee(
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

              Parking Fee

            </label>

            <input
              type="number"
              value={parkingFee}
              onChange={(e) =>
                setParkingFee(
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

              Internet Fee

            </label>

            <input
              type="number"
              value={internetFee}
              onChange={(e) =>
                setInternetFee(
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

              Service Charge

            </label>

            <input
              type="number"
              value={serviceCharge}
              onChange={(e) =>
                setServiceCharge(
                  Number(
                    e.target.value
                  )
                )
              }
              className="w-full rounded-xl border p-3"
            />

          </div>

        </div>

      </section>
            {/* Status */}

      <section className="rounded-2xl border bg-white p-6">

        <h2 className="text-xl font-bold">

          Unit Status

        </h2>

        <p className="mt-1 text-gray-500">

          Set the current status of this unit.

        </p>

        <div className="mt-6">

          <label className="mb-2 block font-medium">

            Status

          </label>

          <select
            value={status}
            onChange={(e) =>
              setStatus(
                e.target.value
              )
            }
            className="w-full rounded-xl border p-3"
          >

            <option value="Vacant">
              Vacant
            </option>

            <option value="Occupied">
              Occupied
            </option>

            <option value="Reserved">
              Reserved
            </option>

            <option value="Maintenance">
              Maintenance
            </option>

          </select>

        </div>

      </section>

      {/* Notes */}

      <section className="rounded-2xl border bg-white p-6">

        <h2 className="text-xl font-bold">

          Notes

        </h2>

        <p className="mt-1 text-gray-500">

          Optional notes about this unit.

        </p>

        <div className="mt-6">

          <textarea
            rows={5}
            value={notes}
            onChange={(e) =>
              setNotes(
                e.target.value
              )
            }
            className="w-full rounded-xl border p-3"
            placeholder="Enter any notes..."
          />

        </div>

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

              const payload = {

                property_id: propertyId,

                unit_number: unitNumber,

                unit_type:
                  unitType || null,

                floor_number:
                  floorNumber
                    ? Number(
                        floorNumber
                      )
                    : null,

                bedrooms,

                bathrooms,

                size_sqm: sizeSqm,

                monthly_rent:
                  monthlyRent,

                deposit,

                water_meter_number:
                  waterMeterNumber ||
                  null,

                electricity_meter_number:
                  electricityMeterNumber ||
                  null,

                gas_meter_number:
                  gasMeterNumber ||
                  null,

                internet_account_number:
                  internetAccountNumber ||
                  null,

                garbage_fee:
                  garbageFee,

                security_fee:
                  securityFee,

                sewer_fee:
                  sewerFee,

                parking_fee:
                  parkingFee,

                internet_fee:
                  internetFee,

                service_charge:
                  serviceCharge,

                status,

                notes:
                  notes || null,

              };
                            if (editing) {

                await updateUnit(
                  unit!.id,
                  payload
                );

              } else {

                await createUnit(
                  payload
                );

              }

              onSuccess();

            } catch (error) {

              console.error(error);

              alert(
                editing
                  ? "Failed to update unit."
                  : "Failed to create unit."
              );

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
