"use client";

import { useEffect, useState } from "react";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import TextArea from "@/components/ui/TextArea";
import Card from "@/components/ui/Card";
import ToggleSwitch from "@/components/ui/ToggleSwitch";

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

        </div>

        <div className="mt-5">

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
