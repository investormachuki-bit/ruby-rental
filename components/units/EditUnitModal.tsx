"use client";

import { useEffect, useState } from "react";
import { updateUnit } from "@/services/units/updateUnit";
import { Unit } from "@/types/unit";

type Props = {
  unit: Unit;
  onClose: () => void;
  onSaved: () => void;
};

export default function EditUnitModal({
  unit,
  onClose,
  onSaved,
}: Props) {
  const [loading, setLoading] = useState(false);

  const [unitNumber, setUnitNumber] = useState("");
  const [floorName, setFloorName] = useState("");

  const [monthlyRent, setMonthlyRent] =
    useState(0);

  const [deposit, setDeposit] =
    useState(0);

  const [waterType, setWaterType] =
    useState("Metered");

  const [waterAmount, setWaterAmount] =
    useState(0);

  const [
    electricityType,
    setElectricityType,
  ] = useState("Prepaid");

  const [
    electricityAmount,
    setElectricityAmount,
  ] = useState(0);

  const [garbageFee, setGarbageFee] =
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
    setUnitNumber(unit.unit_number);

    setFloorName(unit.floor_name ?? "");

    setMonthlyRent(Number(unit.monthly_rent));

    setDeposit(Number(unit.deposit));

    setWaterType(unit.water_type);

    setWaterAmount(
      Number(unit.water_amount)
    );

    setElectricityType(
      unit.electricity_type
    );

    setElectricityAmount(
      Number(unit.electricity_amount)
    );

    setGarbageFee(
      Number(unit.garbage_fee)
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

  function validate() {
    if (!unitNumber.trim()) {
      alert("Unit Number is required.");
      return false;
    }

    if (monthlyRent < 0) {
      alert("Invalid monthly rent.");
      return false;
    }

    if (deposit < 0) {
      alert("Invalid deposit.");
      return false;
    }

    return true;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">

      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white">

        <div className="border-b p-6">

          <h2 className="text-2xl font-bold">
            Edit Unit
          </h2>

          <p className="mt-1 text-gray-500">
            Update unit information.
          </p>

        </div>

        <div className="space-y-6 p-6">

          <div className="grid gap-5 md:grid-cols-2">

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
                Floor
              </label>

              <input
                value={floorName}
                onChange={(e) =>
                  setFloorName(
                    e.target.value
                  )
                }
                className="w-full rounded-xl border p-3"
              />

            </div>

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
                    <div className="grid gap-5 md:grid-cols-2">

            <div>

              <label className="mb-2 block font-medium">
                Water Type
              </label>

              <select
                value={waterType}
                onChange={(e) =>
                  setWaterType(e.target.value)
                }
                className="w-full rounded-xl border p-3"
              >
                <option>Metered</option>
                <option>Fixed</option>
                <option>Included</option>
              </select>

            </div>

            <div>

              <label className="mb-2 block font-medium">
                Water Amount
              </label>

              <input
                type="number"
                value={waterAmount}
                onChange={(e) =>
                  setWaterAmount(
                    Number(e.target.value)
                  )
                }
                className="w-full rounded-xl border p-3"
              />

            </div>

            <div>

              <label className="mb-2 block font-medium">
                Electricity Type
              </label>

              <select
                value={electricityType}
                onChange={(e) =>
                  setElectricityType(
                    e.target.value
                  )
                }
                className="w-full rounded-xl border p-3"
              >
                <option>Prepaid</option>
                <option>Postpaid</option>
                <option>Included</option>
              </select>

            </div>

            <div>

              <label className="mb-2 block font-medium">
                Electricity Amount
              </label>

              <input
                type="number"
                value={electricityAmount}
                onChange={(e) =>
                  setElectricityAmount(
                    Number(e.target.value)
                  )
                }
                className="w-full rounded-xl border p-3"
              />

            </div>

            <div>

              <label className="mb-2 block font-medium">
                Garbage Fee
              </label>

              <input
                type="number"
                value={garbageFee}
                onChange={(e) =>
                  setGarbageFee(
                    Number(e.target.value)
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
                    Number(e.target.value)
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
                    Number(e.target.value)
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
                    Number(e.target.value)
                  )
                }
                className="w-full rounded-xl border p-3"
              />

            </div>

            <div>

              <label className="mb-2 block font-medium">
                Status
              </label>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value)
                }
                className="w-full rounded-xl border p-3"
              >
                <option>Vacant</option>
                <option>Occupied</option>
                <option>Reserved</option>
                <option>Maintenance</option>
              </select>

            </div>

          </div>

          <div>

            <label className="mb-2 block font-medium">
              Notes
            </label>

            <textarea
              rows={4}
              value={notes}
              onChange={(e) =>
                setNotes(e.target.value)
              }
              className="w-full rounded-xl border p-3"
            />

          </div>

        </div>

        <div className="flex justify-end gap-3 border-t p-6">

          <button
            onClick={onClose}
            className="rounded-xl border px-6 py-3"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={async () => {
              if (!validate()) return;

              try {
                setLoading(true);

                await updateUnit(unit.id, {
                  unit_number: unitNumber,
                  floor_name: floorName || null,

                  monthly_rent: monthlyRent,
                  deposit,

                  water_type: waterType,
                  water_amount: waterAmount,

                  electricity_type: electricityType,
                  electricity_amount:
                    electricityAmount,

                  garbage_fee: garbageFee,
                  parking_fee: parkingFee,
                  internet_fee: internetFee,
                  service_charge:
                    serviceCharge,

                  status,

                  notes: notes || null,
                });

                alert(
                  "Unit updated successfully."
                );

                onSaved();
              } catch (error: any) {
                alert(error.message);
              } finally {
                setLoading(false);
              }
            }}
            className="rounded-xl bg-black px-6 py-3 font-semibold text-white"
          >
            {loading
              ? "Saving..."
              : "Save Changes"}
          </button>

        </div>

      </div>

    </div>
  );
}
