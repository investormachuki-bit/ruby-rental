"use client";

import { useState } from "react";

import type { LeaseDetails } from "@/types/lease";

import SectionCard from "@/components/common/SectionCard";
import StickyActionBar from "@/components/common/StickyActionBar";

import { createInvoice } from "@/services/invoices/createInvoice";
import { createInvoiceItem } from "@/services/invoiceItems/createInvoiceItem";

type Props = {
  lease: LeaseDetails;

  onSuccess: () => void;

  onCancel: () => void;
};

export default function CreateInvoiceModal({
  lease,
  onSuccess,
  onCancel,
}: Props) {

  const today =
    new Date()
      .toISOString()
      .split("T")[0];

  const dueDate =
    new Date(
      Date.now() +
      5 * 24 * 60 * 60 * 1000
    )
      .toISOString()
      .split("T")[0];

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] =
    useState({

      invoice_type: "Rent",

      billing_period: `${new Date().toLocaleString(
        "default",
        {
          month: "long",
        }
      )} ${new Date().getFullYear()}`,

      invoice_date: today,

      due_date: dueDate,

      amount: String(
        lease.rent_amount
      ),

      notes: "",

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

      const invoice =
        await createInvoice({

          lease_id:
            lease.id,

          property_id:
            lease.property_id,

          unit_id:
            lease.unit_id,

          tenant_id:
            lease.tenant_id,

          invoice_type:
            form.invoice_type as
              | "Rent"
              | "Deposit"
              | "Water"
              | "Electricity"
              | "Service Charge"
              | "Penalty"
              | "Other",

          billing_period:
            form.billing_period,

          invoice_date:
            form.invoice_date,

          due_date:
            form.due_date,

          notes:
            form.notes,

        });

      await createInvoiceItem({

        invoice_id:
          invoice.id,

        item_type:
          "Rent",

        description:
          `${form.billing_period} Rent`,

        quantity: 1,

        unit_price:
          Number(form.amount),

      });

      onSuccess();

    } catch (error) {

      console.error(error);

      alert(
        "Failed to create invoice."
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
            Create Invoice
          </h2>

          <p className="mt-2 text-gray-500">
            Generate a new invoice for this lease.
          </p>

        </div>

        <div className="flex-1 space-y-6 overflow-y-auto p-6">
                    <SectionCard
            title="Invoice Information"
            description="Select the invoice type and billing period."
          >

            <div className="grid gap-5 md:grid-cols-2">

              <div>

                <label className="mb-2 block font-medium">
                  Invoice Type
                </label>

                <select
                  name="invoice_type"
                  value={form.invoice_type}
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
                  Billing Period
                </label>

                <input
                  type="text"
                  name="billing_period"
                  value={form.billing_period}
                  onChange={handleChange}
                  className="w-full rounded-xl border bg-white p-3"
                />

              </div>

            </div>

          </SectionCard>

          <SectionCard
            title="Invoice Dates"
            description="Choose the invoice and due date."
          >

            <div className="grid gap-5 md:grid-cols-2">

              <div>

                <label className="mb-2 block font-medium">
                  Invoice Date
                </label>

                <input
                  type="date"
                  name="invoice_date"
                  value={form.invoice_date}
                  onChange={handleChange}
                  className="w-full rounded-xl border bg-white p-3"
                />

              </div>

              <div>

                <label className="mb-2 block font-medium">
                  Due Date
                </label>

                <input
                  type="date"
                  name="due_date"
                  value={form.due_date}
                  onChange={handleChange}
                  className="w-full rounded-xl border bg-white p-3"
                />

              </div>

            </div>

          </SectionCard>

          <SectionCard
            title="Invoice Amount"
            description="Specify the initial rent amount."
          >

            <div>

              <label className="mb-2 block font-medium">
                Rent Amount
              </label>

              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                className="w-full rounded-xl border bg-white p-3"
              />

            </div>

          </SectionCard>

          <SectionCard
            title="Notes"
            description="Optional notes for this invoice."
          >

            <textarea
              rows={4}
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Enter invoice notes..."
              className="w-full rounded-xl border bg-white p-4"
            />

          </SectionCard>

          <SectionCard
            title="Invoice Preview"
            description="Review the invoice before creating it."
          >

            <div className="space-y-4">

              <div className="flex items-center justify-between">

                <span className="text-gray-500">
                  Tenant
                </span>

                <span className="font-semibold">
                  {lease.tenant.full_name}
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

              <div className="flex items-center justify-between">

                <span className="text-gray-500">
                  Invoice Type
                </span>

                <span className="font-semibold">
                  {form.invoice_type}
                </span>

              </div>

              <div className="flex items-center justify-between">

                <span className="text-gray-500">
                  Billing Period
                </span>

                <span className="font-semibold">
                  {form.billing_period}
                </span>

              </div>

              <div className="flex items-center justify-between border-t pt-4">

                <span className="font-semibold">
                  Initial Rent Line
                </span>

                <span className="text-2xl font-bold text-blue-600">
                  KSh{" "}
                  {Number(form.amount).toLocaleString()}
                </span>

              </div>

              <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">

                <strong>Note:</strong> This invoice will initially contain
                only the Rent line item. Water, Garbage, Service Charge,
                Electricity, Parking and Previous Balance can be added
                afterwards. The invoice totals will be calculated
                automatically by the database.

              </div>

            </div>

          </SectionCard>

        </div>

        <StickyActionBar
          loading={loading}
          onCancel={onCancel}
          onSaveDraft={onCancel}
          onPrimary={handleSubmit}
          primaryText="Create Invoice"
        />

      </div>

    </div>

  );

}
