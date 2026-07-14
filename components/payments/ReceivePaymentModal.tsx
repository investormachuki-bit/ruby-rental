"use client";

import { useState } from "react";

import SectionCard from "@/components/common/SectionCard";
import StickyActionBar from "@/components/common/StickyActionBar";

import { createPayment } from "@/services/payments/createPayment";
type Lease = {
  id: string;

  property_id: string;

  unit_id: string;

  occupant_id: string;

  rent_amount: number;

  property: {
    name: string;
  };

  unit: {
    unit_number: string;
  };

  occupant: {
    first_name: string;
    last_name: string;
    phone_number?: string;
  };
};

type Props = {
  lease: Lease;

  onSuccess: () => void;

  onCancel: () => void;
};

export default function ReceivePaymentModal({
  lease,
  onSuccess,
  onCancel,
}: Props) {

  const [loading, setLoading] =
    useState(false);

  const today =
    new Date()
      .toISOString()
      .split("T")[0];

  const [form, setForm] =
    useState({

      payment_type:
        "Rent",

      payment_method:
        "M-Pesa",

      payment_date:
        today,

      amount:
        String(
          lease.rent_amount
        ),

      reference_number:
        "",

      notes:
        "",

    });

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLSelectElement |
      HTMLTextAreaElement
    >
  ) {

    const {
      name,
      value,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

  }

  async function handleSubmit() {

    try {

      setLoading(true);

      await createPayment({

  lease_id:
    lease.id,

  property_id:
    lease.property_id,

  unit_id:
    lease.unit_id,

  occupant_id:
    lease.occupant_id,

  payment_type:
    form.payment_type as any,

  payment_method:
    form.payment_method as any,

  payment_date:
    form.payment_date,

  amount:
    Number(form.amount),

  reference_number:
    form.reference_number,

  notes:
    form.notes,

});

      onSuccess();
} catch (error: any) {

  console.error(error);

  alert(
    error?.message ||
    JSON.stringify(error) ||
    "Failed to receive payment."
  );

} finally {

  setLoading(false);

}

  }

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">

      <div className="flex max-h-[95vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-gray-50 shadow-2xl">

        <div className="border-b bg-white p-6">

          <h2 className="text-2xl font-bold">
            Receive Payment
          </h2>

          <p className="mt-2 text-gray-500">
            Record a payment received from a tenant.
          </p>

        </div>

        <div className="flex-1 space-y-6 overflow-y-auto p-6">
                    <SectionCard
            title="Tenant Information"
            description="Payment will be posted to this lease."
          >

            <div className="grid gap-5 md:grid-cols-2">

              <div>

                <p className="text-xs uppercase text-gray-500">
                  Tenant
                </p>

                <p className="mt-1 font-semibold">
                  {lease.occupant.first_name}{" "}
                  {lease.occupant.last_name}
                </p>

              </div>

              <div>

                <p className="text-xs uppercase text-gray-500">
                  Phone
                </p>

                <p className="mt-1 font-semibold">
                  {lease.occupant.phone_number ?? "-"}
                </p>

              </div>

              <div>

                <p className="text-xs uppercase text-gray-500">
                  Property
                </p>

                <p className="mt-1 font-semibold">
                  {lease.property.name}
                </p>

              </div>

              <div>

                <p className="text-xs uppercase text-gray-500">
                  Unit
                </p>

                <p className="mt-1 font-semibold">
                  {lease.unit.unit_number}
                </p>

              </div>

            </div>

          </SectionCard>

          <SectionCard
            title="Payment Details"
            description="Enter the payment received."
          >

            <div className="grid gap-5 md:grid-cols-2">

              <div>

                <label className="mb-2 block font-medium">
                  Payment Type
                </label>

                <select
                  name="payment_type"
                  value={form.payment_type}
                  onChange={handleChange}
                  className="w-full rounded-xl border bg-white p-3"
                >

                  <option>Rent</option>
                  <option>Deposit</option>
                  <option>Water</option>
                  <option>Electricity</option>
                  <option>Service Charge</option>
                  <option>Penalty</option>
                  <option>Other</option>

                </select>

              </div>

              <div>

                <label className="mb-2 block font-medium">
                  Payment Method
                </label>

                <select
                  name="payment_method"
                  value={form.payment_method}
                  onChange={handleChange}
                  className="w-full rounded-xl border bg-white p-3"
                >

                  <option>Cash</option>
                  <option>M-Pesa</option>
                  <option>Bank</option>
                  <option>Cheque</option>

                </select>

              </div>

              <div>

                <label className="mb-2 block font-medium">
                  Amount
                </label>

                <input
                  type="number"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  className="w-full rounded-xl border bg-white p-3"
                />

              </div>

              <div>

                <label className="mb-2 block font-medium">
                  Payment Date
                </label>

                <input
                  type="date"
                  name="payment_date"
                  value={form.payment_date}
                  onChange={handleChange}
                  className="w-full rounded-xl border bg-white p-3"
                />

              </div>

            </div>

          </SectionCard>
                    <SectionCard
            title="Reference & Notes"
            description="Optional payment reference and notes."
          >

            <div className="grid gap-5 md:grid-cols-2">

              <div>

                <label className="mb-2 block font-medium">
                  M-Pesa / Bank Reference
                </label>

                <input
                  type="text"
                  name="reference_number"
                  value={form.reference_number}
                  onChange={handleChange}
                  placeholder="e.g. SGK8D7H2L"
                  className="w-full rounded-xl border bg-white p-3"
                />

              </div>

              <div>

                <label className="mb-2 block font-medium">
                  Receipt Number
                </label>

                <div className="rounded-xl border bg-gray-100 p-3 text-gray-500">
                  Generated automatically
                </div>

              </div>

            </div>

            <div className="mt-5">

              <label className="mb-2 block font-medium">
                Notes
              </label>

              <textarea
                rows={4}
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Optional notes..."
                className="w-full rounded-xl border bg-white p-3"
              />

            </div>

          </SectionCard>

          <SectionCard
            title="Payment Summary"
            description="Confirm the payment before saving."
          >

            <div className="space-y-4">

              <div className="flex items-center justify-between">

                <span className="text-gray-500">
                  Tenant
                </span>

                <span className="font-semibold">
                  {lease.occupant.first_name}{" "}
                  {lease.occupant.last_name}
                </span>

              </div>

              <div className="flex items-center justify-between">

                <span className="text-gray-500">
                  Property
                </span>

                <span className="font-semibold">
                  {lease.property.name}
                </span>

              </div>

              <div className="flex items-center justify-between">

                <span className="text-gray-500">
                  Unit
                </span>

                <span className="font-semibold">
                  {lease.unit.unit_number}
                </span>

              </div>

              <div className="flex items-center justify-between border-t pt-4">

                <span className="font-semibold">
                  Amount Received
                </span>

                <span className="text-2xl font-bold text-green-600">
                  KSh{" "}
                  {Number(
                    form.amount
                  ).toLocaleString()}
                </span>

              </div>

            </div>

          </SectionCard>

        </div>

        <StickyActionBar
          loading={loading}
          onCancel={onCancel}
          onSaveDraft={onCancel}
          onPrimary={handleSubmit}
          primaryText="Receive Payment"
        />

      </div>

    </div>

  );

}
          
