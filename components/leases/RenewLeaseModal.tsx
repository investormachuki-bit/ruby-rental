"use client";

import { useState } from "react";

import type { LeaseDetails } from "@/types/lease";

import { renewLease } from "@/services/leases/renewLease";

type Props = {
  lease: LeaseDetails;

  onCancel: () => void;

  onSuccess: () => void;
};

export default function RenewLeaseModal({
  lease,
  onCancel,
  onSuccess,
}: Props) {
  const [leaseStartDate, setLeaseStartDate] =
    useState("");

  const [leaseEndDate, setLeaseEndDate] =
    useState("");

  const [rentAmount, setRentAmount] =
    useState(
      Number(lease.rent_amount)
    );

  const [depositAmount, setDepositAmount] =
    useState(
      Number(lease.deposit_amount)
    );

  const [billingDay, setBillingDay] =
    useState(
      Number(lease.billing_day)
    );

  const [notes, setNotes] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (!leaseStartDate) {
      alert("Lease start date is required.");
      return;
    }

    if (!leaseEndDate) {
      alert("Lease end date is required.");
      return;
    }

    if (Number(rentAmount) <= 0) {
      alert("Monthly rent must be greater than zero.");
      return;
    }

    if (Number(billingDay) < 1 || Number(billingDay) > 31) {
      alert("Billing day must be between 1 and 31.");
      return;
    }

    try {
      setSaving(true);

      await renewLease({
        leaseId: lease.id,
        startDate: leaseStartDate,
        endDate: leaseEndDate,
        rentAmount: Number(rentAmount),
        depositAmount: Number(depositAmount),
        billingDay: Number(billingDay),
        notes,
      });

      onSuccess();

    } catch (error: any) {

      alert(
        error?.message ??
          "Failed to renew lease."
      );

    } finally {

      setSaving(false);

    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">

        {/* Header */}

        <div className="border-b p-6">

          <h2 className="text-2xl font-bold">
            Renew Lease
          </h2>

          <p className="mt-2 text-gray-500">
            Create a new lease for{" "}
            <span className="font-semibold text-black">
              {lease.tenant.full_name}
            </span>.
          </p>

        </div>

        <form onSubmit={handleSubmit}>
                    <div className="grid gap-6 p-6 md:grid-cols-2">

            {/* Lease Start Date */}

            <div>

              <label className="mb-2 block text-sm font-medium">
                Lease Start Date
              </label>

              <input
                type="date"
                value={leaseStartDate}
                onChange={(e) =>
                  setLeaseStartDate(e.target.value)
                }
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
                required
              />

            </div>

            {/* Lease End Date */}

            <div>

              <label className="mb-2 block text-sm font-medium">
                Lease End Date
              </label>

              <input
                type="date"
                value={leaseEndDate}
                onChange={(e) =>
                  setLeaseEndDate(e.target.value)
                }
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
                required
              />

            </div>

            {/* Monthly Rent */}

            <div>

              <label className="mb-2 block text-sm font-medium">
                Monthly Rent (KSh)
              </label>

              <input
                type="number"
                min="0"
                value={rentAmount}
                onChange={(e) =>
                  setRentAmount(Number(e.target.value))
                }
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
                required
              />

            </div>

            {/* Deposit */}

            <div>

              <label className="mb-2 block text-sm font-medium">
                Deposit Amount (KSh)
              </label>

              <input
                type="number"
                min="0"
                value={depositAmount}
                onChange={(e) =>
                  setDepositAmount(Number(e.target.value))
                }
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
              />

            </div>

            {/* Billing Day */}

            <div>

              <label className="mb-2 block text-sm font-medium">
                Billing Day
              </label>

              <select
                value={billingDay}
                onChange={(e) =>
                  setBillingDay(Number(e.target.value))
                }
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
              >
                {Array.from(
                  { length: 31 },
                  (_, index) => index + 1
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

            {/* Current Lease */}

            <div>

              <label className="mb-2 block text-sm font-medium">
                Current Lease
              </label>

              <div className="rounded-xl border bg-gray-50 px-4 py-3 text-sm text-gray-600">

                {lease.lease_number}

              </div>

            </div>

          </div>

          {/* Notes */}

          <div className="px-6 pb-6">

            <label className="mb-2 block text-sm font-medium">
              Renewal Notes
            </label>

            <textarea
              rows={4}
              value={notes}
              onChange={(e) =>
                setNotes(e.target.value)
              }
              placeholder="Optional notes about this renewal..."
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
            />

          </div>
                    {/* Footer */}

          <div className="flex items-center justify-end gap-3 border-t p-6">

            <button
              type="button"
              onClick={onCancel}
              disabled={saving}
              className="rounded-xl border px-5 py-3 font-medium transition hover:bg-gray-100 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Renewing Lease..."
                : "Renew Lease"}
            </button>

          </div>

        </form>

      </div>

    </div>

  );

}
