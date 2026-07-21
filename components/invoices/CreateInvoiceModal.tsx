"use client";

import { useMemo, useState } from "react";

import type { LeaseDetails } from "@/types/lease";

import SectionCard from "@/components/common/SectionCard";
import StickyActionBar from "@/components/common/StickyActionBar";

import { createInvoice } from "@/services/invoices/createInvoice";
import { createInvoiceItem } from "@/services/invoiceItems/createInvoiceItem";

const ITEM_TYPES = [
  "Rent",
  "Water",
  "Electricity",
  "Garbage",
  "Parking",
  "Service Charge",
  "Penalty",
  "Deposit",
  "Other",
] as const;

type InvoiceItem = {
  item_type: (typeof ITEM_TYPES)[number];
  description: string;
  quantity: number;
  unit_price: number;
};

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
  const today = new Date().toISOString().split("T")[0];

  const defaultDueDate = new Date(
    Date.now() + 5 * 24 * 60 * 60 * 1000
  )
    .toISOString()
    .split("T")[0];

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    invoice_date: today,
    due_date: defaultDueDate,
    billing_period: `${new Date().toLocaleString("default", {
      month: "long",
    })} ${new Date().getFullYear()}`,
    notes: "",
  });

  const [items, setItems] = useState<InvoiceItem[]>([
    {
      item_type: "Rent",
      description: `${new Date().toLocaleString("default", {
        month: "long",
      })} Rent`,
      quantity: 1,
      unit_price: Number(lease.rent_amount),
    },
  ]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => {
      return sum + item.quantity * item.unit_price;
    }, 0);
  }, [items]);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function updateItem(
    index: number,
    field: keyof InvoiceItem,
    value: string | number
  ) {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  }

  function addItem() {
    setItems((prev) => [
      ...prev,
      {
        item_type: "Other",
        description: "",
        quantity: 1,
        unit_price: 0,
      },
    ]);
  }

  function removeItem(index: number) {
    if (items.length === 1) return;

    setItems((prev) => prev.filter((_, i) => i !== index));
  }
    async function handleSubmit() {
    if (!form.billing_period.trim()) {
      alert("Please enter a billing period.");
      return;
    }

    if (!form.invoice_date) {
      alert("Please select the invoice date.");
      return;
    }

    if (!form.due_date) {
      alert("Please select the due date.");
      return;
    }

    if (items.length === 0) {
      alert("Please add at least one invoice item.");
      return;
    }

    for (const item of items) {
      if (!item.description.trim()) {
        alert("Every invoice item must have a description.");
        return;
      }

      if (item.quantity <= 0) {
        alert("Quantity must be greater than zero.");
        return;
      }

      if (item.unit_price < 0) {
        alert("Unit price cannot be negative.");
        return;
      }
    }

    try {
      setLoading(true);

      const invoice = await createInvoice({
        lease_id: lease.id,
        property_id: lease.property_id,
        unit_id: lease.unit_id,
        tenant_id: lease.tenant_id,
        invoice_type: "Rent",
        billing_period: form.billing_period,
        invoice_date: form.invoice_date,
        due_date: form.due_date,
        notes: form.notes,
      });

      for (const item of items) {
        await createInvoiceItem({
          invoice_id: invoice.id,
          item_type: item.item_type,
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
        });
      }

      onSuccess();
    } catch (error) {
      console.error(error);
      alert("Failed to create invoice.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="flex h-[95vh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl bg-gray-50 shadow-2xl">

        <div className="border-b bg-white px-8 py-6">
          <h2 className="text-2xl font-bold">
            Create Invoice
          </h2>

          <p className="mt-2 text-gray-500">
            Create a professional invoice with multiple line items.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-6">

          <div className="grid gap-6 lg:grid-cols-3">

            <div className="space-y-6 lg:col-span-2">

              <SectionCard
                title="Invoice Information"
                description="General invoice details."
              >

                <div className="grid gap-5 md:grid-cols-2">

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
                title="Invoice Line Items"
                description="Add all charges that should appear on this invoice."
              >
                                <div className="space-y-4">

                  <div className="overflow-x-auto rounded-xl border bg-white">

                    <table className="min-w-full">

                      <thead className="bg-gray-100">

                        <tr>

                          <th className="px-4 py-3 text-left font-semibold">
                            Charge
                          </th>

                          <th className="px-4 py-3 text-left font-semibold">
                            Description
                          </th>

                          <th className="px-4 py-3 text-center font-semibold">
                            Qty
                          </th>

                          <th className="px-4 py-3 text-right font-semibold">
                            Unit Price
                          </th>

                          <th className="px-4 py-3 text-right font-semibold">
                            Total
                          </th>

                          <th className="w-16"></th>

                        </tr>

                      </thead>

                      <tbody>

                        {items.map((item, index) => (

                          <tr
                            key={index}
                            className="border-t"
                          >

                            <td className="p-3">

                              <select
                                value={item.item_type}
                                onChange={(e) =>
                                  updateItem(
                                    index,
                                    "item_type",
                                    e.target.value
                                  )
                                }
                                className="w-full rounded-lg border bg-white p-2"
                              >

                                {ITEM_TYPES.map((type) => (

                                  <option
                                    key={type}
                                    value={type}
                                  >

                                    {type}

                                  </option>

                                ))}

                              </select>

                            </td>

                            <td className="p-3">

                              <input
                                type="text"
                                value={item.description}
                                onChange={(e) =>
                                  updateItem(
                                    index,
                                    "description",
                                    e.target.value
                                  )
                                }
                                className="w-full rounded-lg border p-2"
                                placeholder="Description"
                              />

                            </td>

                            <td className="p-3">

                              <input
                                type="number"
                                min={1}
                                value={item.quantity}
                                onChange={(e) =>
                                  updateItem(
                                    index,
                                    "quantity",
                                    Number(e.target.value)
                                  )
                                }
                                className="w-20 rounded-lg border p-2 text-center"
                              />

                            </td>

                            <td className="p-3">

                              <input
                                type="number"
                                min={0}
                                value={item.unit_price}
                                onChange={(e) =>
                                  updateItem(
                                    index,
                                    "unit_price",
                                    Number(e.target.value)
                                  )
                                }
                                className="w-full rounded-lg border p-2 text-right"
                              />

                            </td>

                            <td className="p-3 text-right font-semibold text-blue-700">

                              KSh{" "}
                              {(
                                item.quantity *
                                item.unit_price
                              ).toLocaleString()}

                            </td>

                            <td className="p-3 text-center">

                              <button
                                type="button"
                                onClick={() =>
                                  removeItem(index)
                                }
                                className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                              >

                                Remove

                              </button>

                            </td>

                          </tr>

                        ))}

                      </tbody>

                    </table>

                  </div>

                  <button
                    type="button"
                    onClick={addItem}
                    className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
                  >

                    + Add Charge

                  </button>

                  <div className="rounded-xl border bg-white p-5">

                    <div className="flex items-center justify-between">

                      <span className="text-gray-600">
                        Number of Charges
                      </span>

                      <span className="font-semibold">
                        {items.length}
                      </span>

                    </div>

                    <div className="mt-4 flex items-center justify-between border-t pt-4">

                      <span className="text-lg font-semibold">
                        Invoice Total
                      </span>

                      <span className="text-3xl font-bold text-blue-600">

                        KSh {subtotal.toLocaleString()}

                      </span>

                    </div>

                  </div>

                </div>

              </SectionCard>

              <SectionCard
                title="Notes"
                description="Additional information for this invoice."
              >

                <textarea
                  rows={5}
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Enter invoice notes..."
                  className="w-full rounded-xl border bg-white p-4"
                />

              </SectionCard>

            </div>

            <div className="space-y-6">
                            <SectionCard
                title="Invoice Summary"
                description="Review the invoice before creating it."
              >

                <div className="space-y-5">

                  <div className="rounded-xl border bg-white p-4">

                    <h3 className="mb-4 text-lg font-semibold">
                      Tenant Details
                    </h3>

                    <div className="space-y-3">

                      <div className="flex justify-between">

                        <span className="text-gray-500">
                          Tenant
                        </span>

                        <span className="font-semibold">
                          {lease.tenant.full_name}
                        </span>

                      </div>

                      <div className="flex justify-between">

                        <span className="text-gray-500">
                          Property
                        </span>

                        <span className="font-semibold">
                          {lease.property.name}
                        </span>

                      </div>

                      <div className="flex justify-between">

                        <span className="text-gray-500">
                          Unit
                        </span>

                        <span className="font-semibold">
                          {lease.unit.unit_number}
                        </span>

                      </div>

                      <div className="flex justify-between">

                        <span className="text-gray-500">
                          Billing Period
                        </span>

                        <span className="font-semibold">
                          {form.billing_period}
                        </span>

                      </div>

                      <div className="flex justify-between">

                        <span className="text-gray-500">
                          Invoice Date
                        </span>

                        <span className="font-semibold">
                          {form.invoice_date}
                        </span>

                      </div>

                      <div className="flex justify-between">

                        <span className="text-gray-500">
                          Due Date
                        </span>

                        <span className="font-semibold">
                          {form.due_date}
                        </span>

                      </div>

                    </div>

                  </div>

                  <div className="rounded-xl border bg-white p-4">

                    <h3 className="mb-4 text-lg font-semibold">
                      Charges
                    </h3>

                    <div className="space-y-3">

                      {items.map((item, index) => (

                        <div
                          key={index}
                          className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                        >

                          <div>

                            <p className="font-medium">
                              {item.item_type}
                            </p>

                            <p className="text-sm text-gray-500">
                              {item.description}
                            </p>

                          </div>

                          <div className="text-right">

                            <p className="font-semibold">

                              KSh{" "}
                              {(
                                item.quantity *
                                item.unit_price
                              ).toLocaleString()}

                            </p>

                            <p className="text-xs text-gray-500">

                              {item.quantity} × KSh{" "}
                              {item.unit_price.toLocaleString()}

                            </p>

                          </div>

                        </div>

                      ))}

                    </div>

                  </div>

                  <div className="rounded-xl bg-blue-600 p-5 text-white">

                    <div className="flex items-center justify-between">

                      <span>
                        Total Charges
                      </span>

                      <span className="font-bold">
                        {items.length}
                      </span>

                    </div>

                    <div className="mt-4 flex items-center justify-between text-2xl font-bold">

                      <span>
                        Invoice Total
                      </span>

                      <span>

                        KSh {subtotal.toLocaleString()}

                      </span>

                    </div>

                  </div>

                </div>

              </SectionCard>

            </div>

          </div>

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
