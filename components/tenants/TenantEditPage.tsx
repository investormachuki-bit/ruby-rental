"use client";

import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import TenantForm, {
  TenantFormValues,
} from "@/components/tenants/TenantForm";

import { getTenant } from "@/services/tenants/getTenant";
import { updateTenant } from "@/services/tenants/updateTenant";

type Props = {
  tenantId: string;
};

export default function TenantEditPage({
  tenantId,
}: Props) {

  const router = useRouter();

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [tenant, setTenant] =
    useState<any>(null);

  useEffect(() => {
    loadTenant();
  }, [tenantId]);

  async function loadTenant() {

    try {

      setLoading(true);

      const data =
        await getTenant(tenantId);

      setTenant(data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  }

  async function handleSubmit(
    values: TenantFormValues
  ) {

    try {

      setSaving(true);

      await updateTenant({

        tenantId,

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

      alert("Tenant updated successfully.");

      router.push(
        `/tenants/${tenantId}`
      );

    } catch (error: any) {

      console.error(error);

      alert(
        error?.message ??
        "Failed to update tenant."
      );

    } finally {

      setSaving(false);

    }

  }

  if (loading) {

    return (
      <div className="p-8">
        Loading...
      </div>
    );

  }

  if (!tenant) {

    return (
      <div className="p-8">
        Tenant not found.
      </div>
    );

  }

  return (

    <div className="space-y-6 p-6">

      <div>

        <Link
          href={`/tenants/${tenantId}`}
          className="mb-4 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black"
        >
          <ArrowLeft size={16} />
          Back to Tenant
        </Link>

        <h1 className="text-3xl font-bold">
          Edit Tenant
        </h1>

        <p className="mt-1 text-gray-500">
          Update tenant information.
        </p>

      </div>

      <div className="rounded-2xl border bg-white shadow-sm">

        <TenantForm
          loading={saving}
          submitLabel="Update Tenant"
          initialValues={{
            fullName:
              tenant.full_name ?? "",
            phone:
              tenant.phone ?? "",
            email:
              tenant.email ?? "",
            idNumber:
              tenant.id_number ?? "",
            occupation:
              tenant.occupation ?? "",
            employer:
              tenant.employer ?? "",
            emergencyContactName:
              tenant.emergency_contact_name ?? "",
            emergencyContactPhone:
              tenant.emergency_contact_phone ?? "",
            notes:
              tenant.notes ?? "",
          }}
          onSubmit={handleSubmit}
          onCancel={() =>
            router.back()
          }
        />

      </div>

    </div>

  );

}
