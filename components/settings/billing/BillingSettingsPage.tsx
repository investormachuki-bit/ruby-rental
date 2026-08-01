"use client";

import { useEffect, useState } from "react";

import { getBillingSettings } from "@/services/settings/getBillingSettings";
import { saveBillingSettings } from "@/services/settings/saveBillingSettings";
import InvoiceSettingsCard from "./InvoiceSettingsCard";

export default function BillingSettingsPage() {
  const [form, setForm] = useState({
    invoicePrefix: "INV",
    nextInvoiceNumber: 1001,
    dueDays: 7,
    gracePeriod: 3,
    receiptPrefix: "RCT",
    nextReceiptNumber: 5001,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {

    try {

      const settings = await getBillingSettings();

      if (!settings) return;

      setForm({
        invoicePrefix: settings.invoice_prefix,
        nextInvoiceNumber: settings.next_invoice_number,
        dueDays: settings.due_days,
        gracePeriod: settings.grace_period,
        receiptPrefix: settings.receipt_prefix,
        nextReceiptNumber: settings.next_receipt_number,
      });

    } catch (error: any) {

      console.error(error);

    }

  }

  async function handleSave() {

    try {

      await saveBillingSettings({
        invoice_prefix: form.invoicePrefix,
        next_invoice_number: form.nextInvoiceNumber,

        receipt_prefix: form.receiptPrefix,
        next_receipt_number: form.nextReceiptNumber,

        billing_day: 5,
        due_days: form.dueDays,
        grace_period: form.gracePeriod,

        auto_generate_invoices: true,
        auto_generate_receipts: true,

        prorate_first_month: true,

        enable_late_fees: true,
        late_fee_type: "Fixed",
        late_fee_amount: 1000,

        currency: "KES",
        currency_symbol: "KSh",

        vat_enabled: false,
        vat_rate: 16,

        footer_text: "",
        signature_name: "",
        show_logo: true,
      });

      alert("Billing settings saved successfully.");

    } catch (error: any) {

      alert(error.message);

    }

  }

  function update(key: keyof typeof form, value: string | number) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-8">

      <div>
        <h1 className="text-3xl font-bold">
          Billing & Finance Settings
        </h1>

        <p className="mt-2 text-gray-500">
          Configure invoice and receipt defaults.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">

        <div className="rounded-2xl border bg-white p-6 shadow-sm">

          <h2 className="mb-6 text-xl font-semibold">
            Invoice Settings
          </h2>

          <div className="space-y-4">

            <input
              className="w-full rounded-xl border p-3"
              placeholder="Invoice Prefix"
              value={form.invoicePrefix}
              onChange={(e) => update("invoicePrefix", e.target.value)}
            />

            <input
              type="number"
              className="w-full rounded-xl border p-3"
              placeholder="Next Invoice Number"
              value={form.nextInvoiceNumber}
              onChange={(e) =>
                update("nextInvoiceNumber", Number(e.target.value))
              }
            />

            <input
              type="number"
              className="w-full rounded-xl border p-3"
              placeholder="Due Days"
              value={form.dueDays}
              onChange={(e) =>
                update("dueDays", Number(e.target.value))
              }
            />

            <input
              type="number"
              className="w-full rounded-xl border p-3"
              placeholder="Grace Period"
              value={form.gracePeriod}
              onChange={(e) =>
                update("gracePeriod", Number(e.target.value))
              }
            />

          </div>

        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">

          <h2 className="mb-6 text-xl font-semibold">
            Receipt Settings
          </h2>

          <div className="space-y-4">

            <input
              className="w-full rounded-xl border p-3"
              placeholder="Receipt Prefix"
              value={form.receiptPrefix}
              onChange={(e) => update("receiptPrefix", e.target.value)}
            />

            <input
              type="number"
              className="w-full rounded-xl border p-3"
              placeholder="Next Receipt Number"
              value={form.nextReceiptNumber}
              onChange={(e) =>
                update("nextReceiptNumber", Number(e.target.value))
              }
            />

          </div>

        </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">

        <h2 className="mb-6 text-xl font-semibold">
          Rent Defaults
        </h2>

        <div className="space-y-4">

          <input
            type="number"
            className="w-full rounded-xl border p-3"
            placeholder="Billing Day (1-31)"
          />

          <select className="w-full rounded-xl border p-3">
            <option>KES</option>
            <option>USD</option>
            <option>UGX</option>
            <option>TZS</option>
          </select>

          <label className="flex items-center gap-3">
            <input type="checkbox" defaultChecked />
            Auto Generate Monthly Invoices
          </label>

          <label className="flex items-center gap-3">
            <input type="checkbox" defaultChecked />
            Pro-rate First Month Rent
          </label>

        </div>

      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">

        <h2 className="mb-6 text-xl font-semibold">
          Late Fees
        </h2>

        <div className="space-y-4">

          <label className="flex items-center gap-3">
            <input type="checkbox" defaultChecked />
            Enable Late Fees
          </label>

          <select className="w-full rounded-xl border p-3">
            <option>Fixed Amount</option>
            <option>Percentage</option>
          </select>

          <input
            type="number"
            className="w-full rounded-xl border p-3"
            placeholder="Late Fee Amount"
          />

          <input
            type="number"
            className="w-full rounded-xl border p-3"
            placeholder="Grace Days"
          />

        </div>

      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm lg:col-span-2">

        <h2 className="mb-6 text-xl font-semibold">
          Tax & Currency
        </h2>

        <div className="grid gap-6 md:grid-cols-2">

          <input
            className="rounded-xl border p-3"
            placeholder="Currency Symbol"
          />

          <input
            type="number"
            className="rounded-xl border p-3"
            placeholder="VAT %"
          />

        </div>

        <label className="mt-6 flex items-center gap-3">
          <input type="checkbox" />
          Enable VAT
        </label>

      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm lg:col-span-2">

        <h2 className="mb-6 text-xl font-semibold">
          PDF & Receipt Branding
        </h2>

        <div className="space-y-4">

          <input
            className="w-full rounded-xl border p-3"
            placeholder="Footer Text"
          />

          <input
            className="w-full rounded-xl border p-3"
            placeholder="Authorized Signature"
          />

          <label className="flex items-center gap-3">
            <input type="checkbox" defaultChecked />
            Show Company Logo
          </label>

          <label className="flex items-center gap-3">
            <input type="checkbox" defaultChecked />
            Show Company Stamp
          </label>

        </div>

      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm lg:col-span-2">

        <h2 className="mb-6 text-xl font-semibold">
          Automation
        </h2>

        <div className="grid gap-4 md:grid-cols-2">

          <label className="flex items-center gap-3">
            <input type="checkbox" defaultChecked />
            Auto Generate Monthly Invoices
          </label>

          <label className="flex items-center gap-3">
            <input type="checkbox" defaultChecked />
            Auto Generate Receipts
          </label>

          <label className="flex items-center gap-3">
            <input type="checkbox" defaultChecked />
            Send SMS Payment Receipts
          </label>

          <label className="flex items-center gap-3">
            <input type="checkbox" defaultChecked />
            Send Email Invoices
          </label>

        </div>

      </div>


      </div>

      <div className="flex justify-end">

        <button
          onClick={handleSave}
          className="rounded-xl bg-[#D4AF37] px-8 py-3 font-semibold text-black"
        >
          Save Billing Settings
        </button>

      </div>

    </div>
  );
}
