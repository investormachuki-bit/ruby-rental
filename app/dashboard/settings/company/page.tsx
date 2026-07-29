"use client";

import { useEffect, useState } from "react";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import TextArea from "@/components/ui/Textarea";
import Card from "@/components/ui/Card";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import FileUpload from "@/components/ui/FileUpload";
import Image from "next/image";

import {
  Building2,
  Palette,
  Phone,
  DollarSign,
  Save,
} from "lucide-react";

import {
  getWorkspaceSettings,
  updateWorkspaceSettings,
} from "@/services/workspace";

import { useWorkspaceAssets } from "@/hooks/useWorkspaceAssets";

import { WorkspaceSettings } from "@/types/workspace";

export default function CompanyWorkspacePage() {

  const [settings, setSettings] =
    useState<WorkspaceSettings | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {

    try {

      const data =
        await getWorkspaceSettings();

      setSettings(data);

    } finally {

      setLoading(false);

    }

  }

  async function saveSettings() {

    if (!settings) return;

    setSaving(true);

    try {

      const updated =
        await updateWorkspaceSettings(settings);

      setSettings(updated);

      alert("Settings saved successfully.");

    } finally {

      setSaving(false);

    }

  }

  if (loading || !settings) {

    return (
      <div className="p-10 text-center">
        Loading workspace settings...
      </div>
    );

  }

  const {
    uploading,
    uploadAsset,
    removeAsset,
  } = useWorkspaceAssets(
    settings,
    setSettings
  );

  return (

    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold">
            Company & Workspace
          </h1>

          <p className="mt-2 text-gray-500">
            Configure your company's white-label settings.
          </p>

        </div>

        <Button
          onClick={saveSettings}
          loading={saving}
        >
          <Save
            size={18}
            className="mr-2"
          />

          Save Changes

        </Button>

      </div>
            {/* Company Profile */}

      <Card>

        <div className="mb-6 flex items-center gap-3">

          <Building2 className="text-[#D4AF37]" />

          <h2 className="text-xl font-semibold">
            Company Profile
          </h2>

        </div>

        <div className="grid gap-5 md:grid-cols-2">

          <Input
            label="Company Name"
            value={settings.company_name ?? ""}
            onChange={(e) =>
              setSettings({
                ...settings,
                company_name: e.target.value,
              })
            }
          />

          <Input
            label="Trading Name"
            value={settings.trading_name ?? ""}
            onChange={(e) =>
              setSettings({
                ...settings,
                trading_name: e.target.value,
              })
            }
          />

          <Input
            label="Registration Number"
            value={settings.registration_number ?? ""}
            onChange={(e) =>
              setSettings({
                ...settings,
                registration_number: e.target.value,
              })
            }
          />

          <Input
            label="KRA PIN"
            value={settings.tax_pin ?? ""}
            onChange={(e) =>
              setSettings({
                ...settings,
                tax_pin: e.target.value,
              })
            }
          />

          <Input
            label="VAT Number"
            value={settings.vat_number ?? ""}
            onChange={(e) =>
              setSettings({
                ...settings,
                vat_number: e.target.value,
              })
            }
          />

          <Input
            label="Business Type"
            value={settings.company_type ?? ""}
            onChange={(e) =>
              setSettings({
                ...settings,
                company_type: e.target.value,
              })
            }
          />

        </div>

        <div className="mt-5">

          <TextArea
            label="Company Description"
            rows={4}
            value={settings.company_description ?? ""}
            onChange={(e) =>
              setSettings({
                ...settings,
                company_description: e.target.value,
              })
            }
          />

        </div>

      </Card>

      {/* White Label Branding */}

      <Card>

        <div className="mb-6 flex items-center gap-3">

          <Palette className="text-[#D4AF37]" />

          <h2 className="text-xl font-semibold">
            White Label Branding
          </h2>

        </div>

        <div className="grid gap-5 md:grid-cols-2">

          <Input
            label="Application Name"
            value={settings.app_name}
            onChange={(e) =>
              setSettings({
                ...settings,
                app_name: e.target.value,
              })
            }
          />

          <Input
            label="Browser Title"
            value={settings.browser_title}
            onChange={(e) =>
              setSettings({
                ...settings,
                browser_title: e.target.value,
              })
            }
          />

          <Input
            type="color"
            label="Primary Color"
            value={settings.primary_color}
            onChange={(e) =>
              setSettings({
                ...settings,
                primary_color: e.target.value,
              })
            }
          />

          <Input
            type="color"
            label="Secondary Color"
            value={settings.secondary_color}
            onChange={(e) =>
              setSettings({
                ...settings,
                secondary_color: e.target.value,
              })
            }
          />

          <Input
            type="color"
            label="Accent Color"
            value={settings.accent_color}
            onChange={(e) =>
              setSettings({
                ...settings,
                accent_color: e.target.value,
              })
            }
          />

          <Input
            label="Footer Text"
            value={settings.footer_text}
            onChange={(e) =>
              setSettings({
                ...settings,
                footer_text: e.target.value,
              })
            }
          />

        </div>

        <div className="mt-8 space-y-4">

          <ToggleSwitch
            label="Enable White Label"
            description="Replace Ruby Rental branding with your own company branding."
            checked={settings.enable_white_label}
            onChange={(checked) =>
              setSettings({
                ...settings,
                enable_white_label: checked,
              })
            }
          />

          <ToggleSwitch
            label="Remove Rubies Technologies Branding"
            description="Hide the default Powered by Rubies Technologies footer."
            checked={settings.remove_ruby_branding}
            onChange={(checked) =>
              setSettings({
                ...settings,
                remove_ruby_branding: checked,
              })
            }
          />

        </div>

      </Card>

      {/* Brand Assets */}

      <Card>

        <h2 className="mb-6 text-xl font-semibold">
          Brand Assets
        </h2>

        <div className="grid gap-6 md:grid-cols-2">

          <FileUpload
            label="Company Logo"
            value={settings.logo_url}
            disabled={uploading}
            onSelect={(file) =>
              uploadAsset(
                "logo_url",
                "company-logo",
                file
              )
            }
            onRemove={() =>
              removeAsset("logo_url")
            }
          />

          <FileUpload
            label="Login Logo"
            value={settings.login_logo_url}
            disabled={uploading}
            onSelect={(file) =>
              uploadAsset(
                "login_logo_url",
                "login-logo",
                file
              )
            }
            onRemove={() =>
              removeAsset("login_logo_url")
            }
          />

          <FileUpload
            label="Invoice Logo"
            value={settings.invoice_logo_url}
            disabled={uploading}
            onSelect={(file) =>
              uploadAsset(
                "invoice_logo_url",
                "invoice-logo",
                file
              )
            }
            onRemove={() =>
              removeAsset("invoice_logo_url")
            }
          />

          <FileUpload
            label="Receipt Logo"
            value={settings.receipt_logo_url}
            disabled={uploading}
            onSelect={(file) =>
              uploadAsset(
                "receipt_logo_url",
                "receipt-logo",
                file
              )
            }
            onRemove={() =>
              removeAsset("receipt_logo_url")
            }
          />

          <FileUpload
            label="Company Stamp"
            value={settings.company_stamp_url}
            disabled={uploading}
            onSelect={(file) =>
              uploadAsset(
                "company_stamp_url",
                "company-stamp",
                file
              )
            }
            onRemove={() =>
              removeAsset("company_stamp_url")
            }
          />

          <FileUpload
            label="Authorized Signature"
            value={settings.signature_url}
            disabled={uploading}
            onSelect={(file) =>
              uploadAsset(
                "signature_url",
                "signature",
                file
              )
            }
            onRemove={() =>
              removeAsset("signature_url")
            }
          />

        </div>

      </Card>

      <Card>

  <h2 className="mb-6 text-xl font-semibold">
    Live Brand Preview
  </h2>

  <div className="grid gap-8 lg:grid-cols-2">

    {/* Sidebar Preview */}

    <div
      className="overflow-hidden rounded-3xl"
      style={{
        background: settings.primary_color,
      }}
    >

      <div className="p-8">

        {settings.logo_url ? (

          <Image
            src={settings.logo_url}
            alt="Logo"
            width={90}
            height={90}
            className="mb-6 rounded-xl bg-white p-2"
          />

        ) : (

          <div
            className="mb-6 flex h-20 w-20 items-center justify-center rounded-xl bg-white text-3xl font-bold"
            style={{
              color: settings.primary_color,
            }}
          >
            R
          </div>

        )}

        <h3 className="text-xl font-bold text-white">
          {settings.company_name || "Company"}
        </h3>

        <p
          className="mt-1 text-sm"
          style={{
            color: settings.accent_color,
          }}
        >
          {settings.app_name}
        </p>

        <div className="mt-8 space-y-3">

          {[
            "Dashboard",
            "Properties",
            "Tenants",
            "Invoices",
            "Reports",
          ].map((item) => (

            <div
              key={item}
              className="rounded-xl bg-white/10 px-4 py-3 text-white"
            >
              {item}
            </div>

          ))}

        </div>

      </div>

    </div>

    {/* Login Preview */}

    <div className="rounded-3xl border bg-gray-50 p-8">

      <div className="mx-auto max-w-sm">

        <div className="flex justify-center">

          {settings.login_logo_url ? (

            <Image
              src={settings.login_logo_url}
              alt="Login Logo"
              width={100}
              height={100}
            />

          ) : (

            <div
              className="flex h-24 w-24 items-center justify-center rounded-full text-4xl font-bold text-white"
              style={{
                background: settings.primary_color,
              }}
            >
              R
            </div>

          )}

        </div>

        <h3 className="mt-6 text-center text-2xl font-bold">

          {settings.company_name}

        </h3>

        <p className="mt-2 text-center text-gray-500">

          Property Management Platform

        </p>

        <div className="mt-8 space-y-4">

          <div className="h-11 rounded-xl bg-white shadow" />

          <div className="h-11 rounded-xl bg-white shadow" />

          <div
            className="rounded-xl py-3 text-center font-semibold text-white"
            style={{
              background: settings.accent_color,
            }}
          >
            Sign In
          </div>

        </div>

      </div>

    </div>

  </div>

</Card>
            {/* Contact Information */}

      <Card>

        <div className="mb-6 flex items-center gap-3">

          <Phone className="text-[#D4AF37]" />

          <h2 className="text-xl font-semibold">
            Contact Information
          </h2>

        </div>

        <div className="grid gap-5 md:grid-cols-2">

          <Input
            label="Phone"
            value={settings.phone ?? ""}
            onChange={(e) =>
              setSettings({
                ...settings,
                phone: e.target.value,
              })
            }
          />

          <Input
            label="Alternative Phone"
            value={settings.alternate_phone ?? ""}
            onChange={(e) =>
              setSettings({
                ...settings,
                alternate_phone: e.target.value,
              })
            }
          />

          <Input
            label="Email"
            type="email"
            value={settings.email ?? ""}
            onChange={(e) =>
              setSettings({
                ...settings,
                email: e.target.value,
              })
            }
          />

          <Input
            label="Website"
            value={settings.website ?? ""}
            onChange={(e) =>
              setSettings({
                ...settings,
                website: e.target.value,
              })
            }
          />

          <Input
            label="WhatsApp"
            value={settings.whatsapp ?? ""}
            onChange={(e) =>
              setSettings({
                ...settings,
                whatsapp: e.target.value,
              })
            }
          />

          <Input
            label="City"
            value={settings.city ?? ""}
            onChange={(e) =>
              setSettings({
                ...settings,
                city: e.target.value,
              })
            }
          />

          <Input
            label="County"
            value={settings.county ?? ""}
            onChange={(e) =>
              setSettings({
                ...settings,
                county: e.target.value,
              })
            }
          />

          <Input
            label="Country"
            value={settings.country ?? ""}
            onChange={(e) =>
              setSettings({
                ...settings,
                country: e.target.value,
              })
            }
          />

          <Input
            label="Google Maps URL"
            value={settings.google_maps_url ?? ""}
            onChange={(e) =>
              setSettings({
                ...settings,
                google_maps_url: e.target.value,
              })
            }
          />

        </div>

        <div className="mt-5 space-y-5">

          <TextArea
            label="Physical Address"
            rows={3}
            value={settings.physical_address ?? ""}
            onChange={(e) =>
              setSettings({
                ...settings,
                physical_address: e.target.value,
              })
            }
          />

          <TextArea
            label="Postal Address"
            rows={2}
            value={settings.postal_address ?? ""}
            onChange={(e) =>
              setSettings({
                ...settings,
                postal_address: e.target.value,
              })
            }
          />

        </div>

      </Card>

      {/* Financial Defaults */}

      <Card>

        <div className="mb-6 flex items-center gap-3">

          <DollarSign className="text-[#D4AF37]" />

          <h2 className="text-xl font-semibold">
            Financial Defaults
          </h2>

        </div>

        <div className="grid gap-5 md:grid-cols-2">

          <Input
            label="Currency"
            value={settings.currency}
            onChange={(e) =>
              setSettings({
                ...settings,
                currency: e.target.value,
              })
            }
          />

          <Input
            label="Currency Symbol"
            value={settings.currency_symbol}
            onChange={(e) =>
              setSettings({
                ...settings,
                currency_symbol: e.target.value,
              })
            }
          />

          <Input
            label="Timezone"
            value={settings.timezone}
            onChange={(e) =>
              setSettings({
                ...settings,
                timezone: e.target.value,
              })
            }
          />

          <Input
            label="Language"
            value={settings.language}
            onChange={(e) =>
              setSettings({
                ...settings,
                language: e.target.value,
              })
            }
          />

          <Input
            label="Date Format"
            value={settings.date_format}
            onChange={(e) =>
              setSettings({
                ...settings,
                date_format: e.target.value,
              })
            }
          />

          <Input
            label="Time Format"
            value={settings.time_format}
            onChange={(e) =>
              setSettings({
                ...settings,
                time_format: e.target.value,
              })
            }
          />

          <Input
            label="Invoice Prefix"
            value={settings.invoice_prefix}
            onChange={(e) =>
              setSettings({
                ...settings,
                invoice_prefix: e.target.value,
              })
            }
          />

          <Input
            label="Receipt Prefix"
            value={settings.receipt_prefix}
            onChange={(e) =>
              setSettings({
                ...settings,
                receipt_prefix: e.target.value,
              })
            }
          />

          <Input
            label="Quotation Prefix"
            value={settings.quotation_prefix}
            onChange={(e) =>
              setSettings({
                ...settings,
                quotation_prefix: e.target.value,
              })
            }
          />

          <Input
            label="Expense Prefix"
            value={settings.expense_prefix}
            onChange={(e) =>
              setSettings({
                ...settings,
                expense_prefix: e.target.value,
              })
            }
          />

          <Input
            label="Tax Name"
            value={settings.tax_name}
            onChange={(e) =>
              setSettings({
                ...settings,
                tax_name: e.target.value,
              })
            }
          />

          <Input
            type="number"
            label="Tax Rate (%)"
            value={settings.tax_rate}
            onChange={(e) =>
              setSettings({
                ...settings,
                tax_rate: Number(e.target.value),
              })
            }
          />

        </div>

        <div className="mt-8">

          <ToggleSwitch
            label="Enable Tax"
            description="Automatically apply tax to invoices."
            checked={settings.tax_enabled}
            onChange={(checked) =>
              setSettings({
                ...settings,
                tax_enabled: checked,
              })
            }
          />

        </div>

      </Card>

    </div>

  );

}
