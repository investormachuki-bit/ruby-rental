"use client";

import { useState } from "react";

import type { LeaseDetails } from "@/types/lease";

import { terminateLease } from "@/services/leases/terminateLease";

type Props = {
  lease: LeaseDetails;

  onCancel: () => void;

  onSuccess: () => void;
};

export default function TerminateLeaseModal({
  lease,
  onCancel,
  onSuccess,
}: Props) {

  const [reason, setReason] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  async function handleTerminate() {

    const confirmed = window.confirm(
      "Are you sure you want to terminate this lease? This action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    try {

      setSaving(true);

      await terminateLease(
        lease.id
      );

      onSuccess();

    } catch (error: any) {

      alert(
        error?.message ??
          "Failed to terminate lease."
      );

    } finally {

      setSaving(false);

    }

  }

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">

        {/* Header */}

        <div className="border-b p-6">

          <h2 className="text-2xl font-bold text-red-600">
            Terminate Lease
          </h2>

          <p className="mt-2 text-gray-500">

            You are about to terminate the lease for

            <span className="font-semibold text-black">
              {" "}
              {lease.tenant.full_name}
            </span>.

          </p>

        </div>
                {/* Body */}

        <div className="space-y-6 p-6">

          <div className="rounded-xl border border-red-200 bg-red-50 p-4">

            <h3 className="font-semibold text-red-700">
              Warning
            </h3>

            <p className="mt-2 text-sm text-red-600">
              Terminating this lease will end the tenant's occupancy and make
              the unit available for future leasing. This action should only be
              performed after confirming the tenant has vacated or according to
              your management policy.
            </p>

          </div>

          <div className="grid gap-4 rounded-xl border bg-gray-50 p-4">

            <div>

              <p className="text-sm text-gray-500">
                Tenant
              </p>

              <p className="mt-1 font-semibold">
                {lease.tenant.full_name}
              </p>

            </div>

            <div>

              <p className="text-sm text-gray-500">
                Property
              </p>

              <p className="mt-1 font-semibold">
                {lease.property.name}
              </p>

            </div>

            <div>

              <p className="text-sm text-gray-500">
                Unit
              </p>

              <p className="mt-1 font-semibold">
                {lease.unit.unit_number}
              </p>

            </div>

            <div>

              <p className="text-sm text-gray-500">
                Lease Number
              </p>

              <p className="mt-1 font-semibold">
                {lease.lease_number}
              </p>

            </div>

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium">
              Reason for Termination (Optional)
            </label>

            <textarea
              rows={4}
              value={reason}
              onChange={(e) =>
                setReason(e.target.value)
              }
              placeholder="e.g. Tenant gave notice, lease expired, mutual agreement..."
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-red-500"
            />

            <p className="mt-2 text-xs text-gray-500">
              This note is for your internal records. If your current
              <code className="mx-1">terminate_lease</code> database function
              does not accept a reason yet, this field can remain informational
              until the RPC is extended.
            </p>

          </div>

        </div>

        {/* Footer */}

        <div className="flex items-center justify-end gap-3 border-t p-6">

          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="rounded-xl border px-5 py-3 font-medium hover:bg-gray-100 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleTerminate}
            disabled={saving}
            className="rounded-xl bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? "Terminating..."
              : "Terminate Lease"}
          </button>

        </div>

      </div>

    </div>

  );

}
