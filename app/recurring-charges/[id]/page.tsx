"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import RecurringChargeForm, {
  RecurringChargeFormValues,
} from "@/components/recurringCharges/RecurringChargeForm";

import { RecurringCharge } from "@/types/recurringCharge";

import { getRecurringChargeById } from "@/services/recurringCharges/getRecurringChargeById";
import { updateRecurringCharge } from "@/services/recurringCharges/updateRecurringCharge";
import { deleteRecurringCharge } from "@/services/recurringCharges/deleteRecurringCharge";
import { toggleRecurringChargeStatus } from "@/services/recurringCharges/toggleRecurringChargeStatus";

export default function RecurringChargeDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [charge, setCharge] =
    useState<RecurringCharge | null>(null);

  async function loadCharge() {
    try {
      setLoading(true);

      const data =
        await getRecurringChargeById(id);

      setCharge(data);
    } catch (error) {
      console.error(error);
      alert("Unable to load recurring charge.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) {
      loadCharge();
    }
  }, [id]);

  async function handleSubmit(
    values: RecurringChargeFormValues
  ) {
    if (!charge) return;

    try {
      setSaving(true);

      await updateRecurringCharge(charge.id, {
        propertyId: values.propertyId,
        unitId: values.unitId || undefined,
        leaseId: values.leaseId || undefined,
        chargeName: values.chargeName,
        description: values.description,
        amount: values.amount,
        billingFrequency:
          values.billingFrequency,
        isMandatory: values.isMandatory,
        isActive: values.isActive,
      });

      alert(
        "Recurring charge updated successfully."
      );

      await loadCharge();
    } catch (error) {
      console.error(error);
      alert(
        "Failed to update recurring charge."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleStatus() {
    if (!charge) return;

    const activate = !charge.is_active;

    if (
      !window.confirm(
        `Are you sure you want to ${
          activate ? "activate" : "deactivate"
        } this recurring charge?`
      )
    ) {
      return;
    }

    try {
      await toggleRecurringChargeStatus(
        charge.id,
        activate
      );

      await loadCharge();

      alert(
        `Recurring charge ${
          activate
            ? "activated"
            : "deactivated"
        } successfully.`
      );
    } catch (error) {
      console.error(error);
      alert("Failed to update status.");
    }
  }

  async function handleDelete() {
    if (!charge) return;

    if (
      !window.confirm(
        "Are you sure you want to delete this recurring charge?"
      )
    ) {
      return;
    }

    try {
      await deleteRecurringCharge(charge.id);

      alert(
        "Recurring charge deleted successfully."
      );

      router.push("/recurring-charges");
    } catch (error) {
      console.error(error);
      alert(
        "Failed to delete recurring charge."
      );
    }
  }

  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-8 text-center">
        Loading recurring charge...
      </div>
    );
  }

  if (!charge) {
    return (
      <div className="rounded-xl border bg-white p-8 text-center">
        Recurring charge not found.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Edit Recurring Charge
          </h1>

          <p className="text-gray-500">
            Update recurring charge details.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleToggleStatus}
            className="rounded-lg border px-4 py-2 hover:bg-gray-100"
          >
            {charge.is_active
              ? "Deactivate"
              : "Activate"}
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-6">
        <RecurringChargeForm
          loading={saving}
          initialValues={{
            propertyId: charge.property_id,
            unitId: charge.unit_id ?? "",
            leaseId: charge.lease_id ?? "",
            chargeName: charge.charge_name,
            description:
              charge.description ?? "",
            amount: Number(charge.amount),
            billingFrequency:
              charge.billing_frequency,
            isMandatory:
              charge.is_mandatory,
            isActive:
              charge.is_active,
          }}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
