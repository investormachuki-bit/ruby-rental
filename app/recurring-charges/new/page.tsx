"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import RecurringChargeForm, {
  RecurringChargeFormValues,
} from "@/components/recurringCharges/RecurringChargeForm";

import { createRecurringCharge } from "@/services/recurringCharges/createRecurringCharge";

export default function NewRecurringChargePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    values: RecurringChargeFormValues
  ) {
    try {
      setLoading(true);

      await createRecurringCharge({
        propertyId: values.propertyId,
        unitId: values.unitId || undefined,
        leaseId: values.leaseId || undefined,

        chargeName: values.chargeName,
        description: values.description,

        amount: values.amount,

        billingFrequency: values.billingFrequency,

        isMandatory: values.isMandatory,
        isActive: values.isActive,
      });

      router.push("/recurring-charges");
    } catch (error) {
      console.error(error);

      alert("Failed to create recurring charge.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          New Recurring Charge
        </h1>

        <p className="text-gray-500">
          Create a recurring charge that can be billed
          automatically.
        </p>
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <RecurringChargeForm
          loading={loading}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
