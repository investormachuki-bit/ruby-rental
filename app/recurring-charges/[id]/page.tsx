"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import RecurringChargeForm, {
  RecurringChargeFormValues,
} from "@/components/recurringCharges/RecurringChargeForm";

import { RecurringCharge } from "@/types/recurringCharge";

import { getRecurringChargeById } from "@/services/recurringCharges/getRecurringChargeById";
import { updateRecurringCharge } from "@/services/recurringCharges/updateRecurringCharge";

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
        unitId: values.unitId || null,
        leaseId: values.leaseId || null,

        chargeName: values.chargeName,
        description: values.description,

        amount: values.amount,

        billingFrequency:
          values.billingFrequency,

        isMandatory: values.isMandatory,
        isActive: values.isActive,
      });

      alert("Recurring charge updated.");

      router.push("/recurring-charges");
    } catch (error) {
      console.error(error);
      alert("Failed to update recurring charge.");
    } finally {
      setSaving(false);
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
      <div>
        <h1 className="text-3xl font-bold">
          Edit Recurring Charge
        </h1>

        <p className="text-gray-500">
          Update recurring charge details.
        </p>
      </div>

      <div className="rounded-xl border bg-white p-6">
        <RecurringChargeForm
          loading={saving}
          initialValues={{
            propertyId: charge.property_id,
            unitId: charge.unit_id ?? "",
            leaseId: charge.lease_id ?? "",
            chargeName: charge.charge_name,
            description: charge.description ?? "",
            amount: Number(charge.amount),
            billingFrequency:
              charge.billing_frequency,
            isMandatory:
              charge.is_mandatory,
            isActive: charge.is_active,
          }}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
