"use client";

import { useEffect, useState } from "react";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import Input from "@/components/ui/Input";

import {
  getOrCreateAutomationSettings,
  updateAutomationSettings,
  AutomationSettings,
} from "@/services/automation";

export default function AutomationSettingsPage() {

  const [settings, setSettings] =
    useState<AutomationSettings | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  useEffect(() => {

    async function load() {

      try {

        const data =
          await getOrCreateAutomationSettings();

        setSettings(data);

      } finally {

        setLoading(false);

      }

    }

    load();

  }, []);

  async function save() {

    if (!settings) return;

    setSaving(true);

    try {

      const updated =
        await updateAutomationSettings(settings);

      setSettings(updated);

    } finally {

      setSaving(false);

    }

  }

  if (loading || !settings) {

    return (
      <div className="p-10 text-center">
        Loading automation settings...
      </div>
    );

  }

  return (

    <div className="space-y-6">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold">
            Automation Center
          </h1>

          <p className="mt-2 text-gray-500">
            Configure automatic business processes.
          </p>

        </div>

        <Button
          onClick={save}
          loading={saving}
        >
          Save Changes
        </Button>

      </div>
            {/* Invoice Automation */}

      <Card>

        <h2 className="mb-6 text-xl font-semibold">
          Invoice Automation
        </h2>

        <div className="space-y-6">

          <ToggleSwitch
            label="Generate invoices automatically"
            description="Automatically generate rent invoices before the due date."
            checked={settings.invoice_generation_enabled}
            onChange={(checked) =>
              setSettings({
                ...settings,
                invoice_generation_enabled: checked,
              })
            }
          />

          <Input
            type="number"
            label="Generate invoices (days before due date)"
            value={String(
              settings.invoice_generation_days_before
            )}
            onChange={(e) =>
              setSettings({
                ...settings,
                invoice_generation_days_before:
                  Number(e.target.value),
              })
            }
          />

          <div className="flex justify-end">

            <Button
              variant="secondary"
              onClick={() => {
                // TODO
                alert(
                  "Invoice generation will be added in the Automation Engine."
                );
              }}
            >
              Run Now
            </Button>

          </div>

        </div>

      </Card>

      {/* Recurring Charges */}

      <Card>

        <h2 className="mb-6 text-xl font-semibold">
          Recurring Charges
        </h2>

        <div className="space-y-6">

          <ToggleSwitch
            label="Automatically include recurring charges"
            description="Include recurring utilities when generating monthly invoices."
            checked={settings.recurring_charges_enabled}
            onChange={(checked) =>
              setSettings({
                ...settings,
                recurring_charges_enabled: checked,
              })
            }
          />

          <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">

            Enabled recurring charges such as Water,
            Garbage, Security, Parking, WiFi and
            Service Charge will automatically be added
            to the generated rent invoice.

          </div>

        </div>

      </Card>
            {/* Rent Reminders */}

      <Card>

        <h2 className="mb-6 text-xl font-semibold">
          Rent Reminders
        </h2>

        <div className="space-y-6">

          <ToggleSwitch
            label="Enable Rent Reminders"
            description="Automatically remind tenants before and after the rent due date."
            checked={settings.rent_reminders_enabled}
            onChange={(checked) =>
              setSettings({
                ...settings,
                rent_reminders_enabled: checked,
              })
            }
          />

          <div className="grid gap-5 md:grid-cols-2">

            <Input
              type="number"
              label="First Reminder (Days Before Due Date)"
              value={String(
                settings.first_reminder_days_before
              )}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  first_reminder_days_before:
                    Number(e.target.value),
                })
              }
            />

            <Input
              type="number"
              label="Overdue Reminder Frequency (Days)"
              value={String(
                settings.overdue_reminder_frequency
              )}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  overdue_reminder_frequency:
                    Number(e.target.value),
                })
              }
            />

          </div>

          <div className="flex justify-end">

            <Button
              variant="secondary"
              onClick={() =>
                alert("Rent reminders will be executed by the Automation Engine.")
              }
            >
              Run Now
            </Button>

          </div>

        </div>

      </Card>

      {/* Late Fees */}

      <Card>

        <h2 className="mb-6 text-xl font-semibold">
          Late Fee Automation
        </h2>

        <div className="space-y-6">

          <ToggleSwitch
            label="Automatically Apply Late Fees"
            description="Apply configured late fees to overdue invoices."
            checked={settings.late_fees_enabled}
            onChange={(checked) =>
              setSettings({
                ...settings,
                late_fees_enabled: checked,
              })
            }
          />

          <Input
            type="number"
            label="Apply Late Fee After (Days)"
            value={String(
              settings.late_fee_days
            )}
            onChange={(e) =>
              setSettings({
                ...settings,
                late_fee_days:
                  Number(e.target.value),
              })
            }
          />

          <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">

            Once the grace period expires,
            Ruby Rental will calculate and apply
            the configured late fee automatically.

          </div>

        </div>

      </Card>

      {/* Lease Renewals */}

      <Card>

        <h2 className="mb-6 text-xl font-semibold">
          Lease Renewal Reminders
        </h2>

        <div className="space-y-6">

          <ToggleSwitch
            label="Enable Lease Expiry Reminders"
            description="Notify both landlord and tenant before lease expiry."
            checked={settings.lease_reminders_enabled}
            onChange={(checked) =>
              setSettings({
                ...settings,
                lease_reminders_enabled: checked,
              })
            }
          />

          <Input
            type="number"
            label="Notify Before Expiry (Days)"
            value={String(
              settings.lease_reminder_days
            )}
            onChange={(e) =>
              setSettings({
                ...settings,
                lease_reminder_days:
                  Number(e.target.value),
              })
            }
          />

        </div>

      </Card>
            {/* Maintenance Follow-ups */}

      <Card>

        <h2 className="mb-6 text-xl font-semibold">
          Maintenance Follow-ups
        </h2>

        <div className="space-y-6">

          <ToggleSwitch
            label="Automatically Follow Up Open Maintenance Requests"
            description="Remind assigned employees about unresolved maintenance work."
            checked={settings.maintenance_followup_enabled}
            onChange={(checked) =>
              setSettings({
                ...settings,
                maintenance_followup_enabled: checked,
              })
            }
          />

          <Input
            type="number"
            label="Follow-up Every (Days)"
            value={String(
              settings.maintenance_followup_days
            )}
            onChange={(e) =>
              setSettings({
                ...settings,
                maintenance_followup_days: Number(
                  e.target.value
                ),
              })
            }
          />

          <div className="flex justify-end">

            <Button
              variant="secondary"
              onClick={() =>
                alert(
                  "Maintenance follow-up will run through the Automation Engine."
                )
              }
            >
              Run Now
            </Button>

          </div>

        </div>

      </Card>

      {/* Owner Statements */}

      <Card>

        <h2 className="mb-6 text-xl font-semibold">
          Owner Statements
        </h2>

        <div className="space-y-6">

          <ToggleSwitch
            label="Generate Owner Statements Automatically"
            description="Generate monthly owner statements."
            checked={settings.owner_statement_enabled}
            onChange={(checked) =>
              setSettings({
                ...settings,
                owner_statement_enabled: checked,
              })
            }
          />

          <Input
            type="number"
            label="Generate On Day"
            value={String(
              settings.owner_statement_day
            )}
            onChange={(e) =>
              setSettings({
                ...settings,
                owner_statement_day: Number(
                  e.target.value
                ),
              })
            }
          />

          <div className="rounded-xl bg-blue-50 p-4 text-sm text-blue-700">

            Statements include rental income,
            expenses, maintenance deductions,
            commissions and owner balances.

          </div>

          <div className="flex justify-end">

            <Button
              variant="secondary"
              onClick={() =>
                alert(
                  "Owner statements will be generated by the Automation Engine."
                )
              }
            >
              Run Now
            </Button>

          </div>

        </div>

      </Card>

    </div>

  );

}
