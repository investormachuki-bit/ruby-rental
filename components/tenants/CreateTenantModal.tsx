"use client";

import { useState } from "react";

import TenantForm, {
  TenantFormValues,
} from "./TenantForm";

import { createTenant } from "@/services/tenants/createTenant";

type Props = {
  onClose: () => void;
  onSaved: () => void;
};

export default function CreateTenantModal({
  onClose,
  onSaved,
}: Props) {

  const [loading, setLoading] =
    useState(false);

  async function handleSubmit(
    values: TenantFormValues
  ) {

    try {

      setLoading(true);

      await createTenant({

        fullName: values.fullName,

        phone: values.phone,

        email: values.email,

        idNumber: values.idNumber,

        occupation: values.occupation,

        employer: values.employer,

        emergencyContactName:
          values.emergencyContactName,

        emergencyContactPhone:
          values.emergencyContactPhone,

        notes: values.notes,

      });

      alert("Tenant created successfully.");

      onSaved();

      onClose();

    } catch (error: any) {

      console.error(error);

      alert(
        error?.message ??
        "Failed to create tenant."
      );

    } finally {

      setLoading(false);

    }

  }

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">

      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">

        <div className="border-b p-6">

          <h2 className="text-2xl font-bold">

            Add Tenant

          </h2>

          <p className="mt-2 text-gray-500">

            Create a new tenant profile.

          </p>

        </div>

        <TenantForm
          loading={loading}
          submitLabel="Save Tenant"
          onSubmit={handleSubmit}
          onCancel={onClose}
        />

      </div>

    </div>

  );

}
