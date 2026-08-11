"use client";

import { useEffect, useState } from "react";

import { getPropertyOptions } from "@/services/properties/getPropertyOptions";
import { getPropertyConfiguration } from "@/services/settings/getPropertyConfiguration";
import { savePropertyConfiguration } from "@/services/settings/savePropertyConfiguration";

type PropertyOption = {
  id: string;
  name: string;
};

type FormState = {
  billingDay: number;
  rentDueDay: number;
  billingBasis: string;
  utilityBillingBasis: string;
  invoiceGenerationMode: string;

  waterEnabled: boolean;
  waterBillingMethod: string;
  waterBaseCharge: number;
  waterRatePerUnit: number;

  electricityEnabled: boolean;
  electricityBillingMethod: string;
  electricityBaseCharge: number;
  electricityRatePerUnit: number;

  gasEnabled: boolean;
  gasBillingMethod: string;
  gasBaseCharge: number;
  gasRatePerUnit: number;

  garbageFee: number;
  securityFee: number;
  sewerFee: number;
  parkingFee: number;
  internetFee: number;
  serviceCharge: number;
};

const defaults: FormState = {
  billingDay: 5,
  rentDueDay: 5,
  billingBasis: "Monthly",
  utilityBillingBasis: "Current Period",
  invoiceGenerationMode: "Advance",

  waterEnabled: true,
  waterBillingMethod: "meter",
  waterBaseCharge: 0,
  waterRatePerUnit: 0,

  electricityEnabled: true,
  electricityBillingMethod: "manual",
  electricityBaseCharge: 0,
  electricityRatePerUnit: 0,

  gasEnabled: false,
  gasBillingMethod: "manual",
  gasBaseCharge: 0,
  gasRatePerUnit: 0,

  garbageFee: 0,
  securityFee: 0,
  sewerFee: 0,
  parkingFee: 0,
  internetFee: 0,
  serviceCharge: 0,
};

export default function PropertyConfigurationPage() {
  const [properties, setProperties] =
    useState<PropertyOption[]>([]);

  const [propertyId, setPropertyId] =
    useState("");

  const [form, setForm] =
    useState<FormState>(defaults);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  useEffect(() => {
    loadProperties();
  }, []);

  useEffect(() => {
    if (propertyId) {
      loadConfiguration(propertyId);
    }
  }, [propertyId]);

  async function loadProperties() {
    try {
      const result = await getPropertyOptions();

      setProperties(result);

      if (result.length > 0) {
        setPropertyId(result[0].id);
      }
    } catch (error) {
      console.error(error);
      alert("Unable to load properties.");
    } finally {
      setLoading(false);
    }
  }

  async function loadConfiguration(id: string) {
    try {
      setLoading(true);

      const result =
        await getPropertyConfiguration(id);

      const property =
        result.property;

      const utility =
        result.utilities;

      setForm({
        billingDay:
          Number(property.billing_day ?? 5),

        rentDueDay:
          Number(property.rent_due_day ?? 5),

        billingBasis:
          property.billing_basis ??
          "Monthly",

        utilityBillingBasis:
          property.utility_billing_basis ??
          "Current Period",

        invoiceGenerationMode:
          property.invoice_generation_mode ??
          "Advance",

        waterEnabled:
          utility?.water_enabled ?? true,

        waterBillingMethod:
          utility?.water_billing_method ??
          "meter",

        waterBaseCharge:
          Number(
            utility?.water_base_charge ?? 0
          ),

        waterRatePerUnit:
          Number(
            utility?.water_rate_per_unit ?? 0
          ),

        electricityEnabled:
          utility?.electricity_enabled ??
          true,

        electricityBillingMethod:
          utility?.electricity_billing_method ??
          "manual",

        electricityBaseCharge:
          Number(
            utility?.electricity_base_charge ??
              0
          ),

        electricityRatePerUnit:
          Number(
            utility?.electricity_rate_per_unit ??
              0
          ),

        gasEnabled:
          utility?.gas_enabled ?? false,

        gasBillingMethod:
          utility?.gas_billing_method ??
          "manual",

        gasBaseCharge:
          Number(
            utility?.gas_base_charge ?? 0
          ),

        gasRatePerUnit:
          Number(
            utility?.gas_rate_per_unit ?? 0
          ),

        garbageFee:
          Number(
            utility?.default_garbage_fee ?? 0
          ),

        securityFee:
          Number(
            utility?.default_security_fee ?? 0
          ),

        sewerFee:
          Number(
            utility?.default_sewer_fee ?? 0
          ),

        parkingFee:
          Number(
            utility?.default_parking_fee ?? 0
          ),

        internetFee:
          Number(
            utility?.default_internet_fee ?? 0
          ),

        serviceCharge:
          Number(
            utility?.default_service_charge ?? 0
          ),
      });
    } catch (error) {
      console.error(error);
      alert(
        "Unable to load property configuration."
      );
    } finally {
      setLoading(false);
    }
  }

  function update<K extends keyof FormState>(
    key: K,
    value: FormState[K]
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function save() {
    if (!propertyId) {
      alert("Please select a property.");
      return;
    }

    try {
      setSaving(true);

      await savePropertyConfiguration({
        propertyId,

        billingDay: form.billingDay,
        rentDueDay: form.rentDueDay,
        billingBasis: form.billingBasis,
        utilityBillingBasis:
          form.utilityBillingBasis,
        invoiceGenerationMode:
          form.invoiceGenerationMode,

        waterEnabled:
          form.waterEnabled,
        waterBillingMethod:
          form.waterBillingMethod,
        waterBaseCharge:
          form.waterBaseCharge,
        waterRatePerUnit:
          form.waterRatePerUnit,

        electricityEnabled:
          form.electricityEnabled,
        electricityBillingMethod:
          form.electricityBillingMethod,
        electricityBaseCharge:
          form.electricityBaseCharge,
        electricityRatePerUnit:
          form.electricityRatePerUnit,

        gasEnabled:
          form.gasEnabled,
        gasBillingMethod:
          form.gasBillingMethod,
        gasBaseCharge:
          form.gasBaseCharge,
        gasRatePerUnit:
          form.gasRatePerUnit,

        garbageFee:
          form.garbageFee,
        securityFee:
          form.securityFee,
        sewerFee:
          form.sewerFee,
        parkingFee:
          form.parkingFee,
        internetFee:
          form.internetFee,
        serviceCharge:
          form.serviceCharge,
      });

      alert(
        "Property configuration saved successfully."
      );
    } catch (error: any) {
      console.error(error);

      alert(
        error?.message ??
          "Unable to save property configuration."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading && properties.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-gray-500">
          Loading property configuration...
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-6 lg:p-8">

      <div>
        <p className="text-sm font-medium text-[#B8952E]">
          SETTINGS
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          Property Configuration
        </h1>

        <p className="mt-2 max-w-3xl text-sm text-gray-500">
          Configure billing and utility defaults
          for an individual property.
        </p>
      </div>

      <section className="rounded-2xl border bg-white p-5 shadow-sm">
        <label className="block">
          <span className="mb-2 block text-sm font-medium">
            Property
          </span>

          <select
            value={propertyId}
            onChange={(e) =>
              setPropertyId(e.target.value)
            }
            className="w-full rounded-xl border px-4 py-3 md:max-w-xl"
          >
            {properties.map((property) => (
              <option
                key={property.id}
                value={property.id}
              >
                {property.name}
              </option>
            ))}
          </select>
        </label>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">

        {/* BILLING */}
        <Section
          title="Property Billing"
          description="Controls how this property is billed."
        >
          <NumberField
            label="Billing Day"
            value={form.billingDay}
            onChange={(value) =>
              update("billingDay", value)
            }
          />

          <NumberField
            label="Rent Due Day"
            value={form.rentDueDay}
            onChange={(value) =>
              update("rentDueDay", value)
            }
          />

          <SelectField
            label="Billing Basis"
            value={form.billingBasis}
            options={[
              "Monthly",
              "Weekly",
              "Daily",
            ]}
            onChange={(value) =>
              update("billingBasis", value)
            }
          />

          <SelectField
            label="Utility Billing Basis"
            value={form.utilityBillingBasis}
            options={[
              "Current Period",
              "Previous Period",
            ]}
            onChange={(value) =>
              update(
                "utilityBillingBasis",
                value
              )
            }
          />

          <SelectField
            label="Invoice Generation"
            value={form.invoiceGenerationMode}
            options={[
              "Advance",
              "On Due Date",
              "Manual",
            ]}
            onChange={(value) =>
              update(
                "invoiceGenerationMode",
                value
              )
            }
          />
        </Section>

        {/* WATER */}
        <UtilitySection
          title="Water"
          enabled={form.waterEnabled}
          onEnabledChange={(value) =>
            update("waterEnabled", value)
          }
        >
          <SelectField
            label="Billing Method"
            value={form.waterBillingMethod}
            options={[
              "meter",
              "manual",
              "fixed",
            ]}
            onChange={(value) =>
              update(
                "waterBillingMethod",
                value
              )
            }
          />

          <NumberField
            label="Base Charge"
            value={form.waterBaseCharge}
            onChange={(value) =>
              update(
                "waterBaseCharge",
                value
              )
            }
          />

          <NumberField
            label="Rate Per Unit"
            value={form.waterRatePerUnit}
            onChange={(value) =>
              update(
                "waterRatePerUnit",
                value
              )
            }
          />
        </UtilitySection>

        {/* ELECTRICITY */}
        <UtilitySection
          title="Electricity"
          enabled={form.electricityEnabled}
          onEnabledChange={(value) =>
            update(
              "electricityEnabled",
              value
            )
          }
        >
          <SelectField
            label="Billing Method"
            value={
              form.electricityBillingMethod
            }
            options={[
              "meter",
              "manual",
              "fixed",
            ]}
            onChange={(value) =>
              update(
                "electricityBillingMethod",
                value
              )
            }
          />

          <NumberField
            label="Base Charge"
            value={
              form.electricityBaseCharge
            }
            onChange={(value) =>
              update(
                "electricityBaseCharge",
                value
              )
            }
          />

          <NumberField
            label="Rate Per Unit"
            value={
              form.electricityRatePerUnit
            }
            onChange={(value) =>
              update(
                "electricityRatePerUnit",
                value
              )
            }
          />
        </UtilitySection>

        {/* GAS */}
        <UtilitySection
          title="Gas"
          enabled={form.gasEnabled}
          onEnabledChange={(value) =>
            update("gasEnabled", value)
          }
        >
          <SelectField
            label="Billing Method"
            value={form.gasBillingMethod}
            options={[
              "meter",
              "manual",
              "fixed",
            ]}
            onChange={(value) =>
              update(
                "gasBillingMethod",
                value
              )
            }
          />

          <NumberField
            label="Base Charge"
            value={form.gasBaseCharge}
            onChange={(value) =>
              update(
                "gasBaseCharge",
                value
              )
            }
          />

          <NumberField
            label="Rate Per Unit"
            value={form.gasRatePerUnit}
            onChange={(value) =>
              update(
                "gasRatePerUnit",
                value
              )
            }
          />
        </UtilitySection>

        {/* FIXED CHARGES */}
        <Section
          title="Recurring Property Charges"
          description="Default fixed charges for this property."
        >
          <NumberField
            label="Garbage Fee"
            value={form.garbageFee}
            onChange={(value) =>
              update("garbageFee", value)
            }
          />

          <NumberField
            label="Security Fee"
            value={form.securityFee}
            onChange={(value) =>
              update("securityFee", value)
            }
          />

          <NumberField
            label="Sewer Fee"
            value={form.sewerFee}
            onChange={(value) =>
              update("sewerFee", value)
            }
          />

          <NumberField
            label="Parking Fee"
            value={form.parkingFee}
            onChange={(value) =>
              update("parkingFee", value)
            }
          />

          <NumberField
            label="Internet Fee"
            value={form.internetFee}
            onChange={(value) =>
              update("internetFee", value)
            }
          />

          <NumberField
            label="Service Charge"
            value={form.serviceCharge}
            onChange={(value) =>
              update(
                "serviceCharge",
                value
              )
            }
          />
        </Section>
      </div>

      <div className="flex justify-end border-t pt-6">
        <button
          type="button"
          onClick={save}
          disabled={saving || !propertyId}
          className="rounded-xl bg-[#D4AF37] px-8 py-3 font-semibold text-black shadow-sm disabled:opacity-50"
        >
          {saving
            ? "Saving..."
            : "Save Property Configuration"}
        </button>
      </div>
    </div>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold">
        {title}
      </h2>

      <p className="mt-1 text-sm text-gray-500">
        {description}
      </p>

      <div className="mt-6 space-y-4">
        {children}
      </div>
    </section>
  );
}

function UtilitySection({
  title,
  enabled,
  onEnabledChange,
  children,
}: {
  title: string;
  enabled: boolean;
  onEnabledChange: (value: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">
            {title}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Configure {title.toLowerCase()} billing.
          </p>
        </div>

        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) =>
            onEnabledChange(e.target.checked)
          }
          className="h-5 w-5"
        />
      </div>

      {enabled && (
        <div className="mt-6 space-y-4">
          {children}
        </div>
      )}
    </section>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </span>

      <input
        type="number"
        min={0}
        value={value}
        onChange={(e) =>
          onChange(Number(e.target.value))
        }
        className="w-full rounded-xl border px-4 py-3 outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </span>

      <select
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full rounded-xl border px-4 py-3 outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20"
      >
        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
