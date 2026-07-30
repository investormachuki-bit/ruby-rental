"use client";

import Card from "@/components/ui/Card";

import {
  Building2,
  Home,
  User,
  Phone,
  Mail,
  CalendarRange,
  BadgeDollarSign,
} from "lucide-react";

type Props = {
  branding: {
    companyName: string;
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
  };

  invoice: {
    billing_period: string;
    invoice_number: string;
    invoice_date: string;
    due_date: string;
  };

  tenant: {
    full_name: string;
    phone?: string;
    email?: string;
  };

  property: {
    name: string;
    address?: string;
  };

  unit: {
    unit_number: string;
  };

  lease: {
    lease_number?: string;
    start_date?: string;
    end_date?: string;
    rent_amount?: number;
  };

  currency?: string;
};

export default function InvoicePartyCard({
  branding,
  invoice,
  tenant,
  property,
  unit,
  lease,
  currency = "KES",
}: Props) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">

      {/* LANDLORD */}

      <Card>

        <div className="mb-5 flex items-center gap-3">

          <div className="rounded-xl bg-amber-50 p-3">

            <Building2 className="h-6 w-6 text-amber-600" />

          </div>

          <div>

            <h2 className="text-lg font-bold">

              Landlord

            </h2>

            <p className="text-sm text-gray-500">

              Invoice Issuer

            </p>

          </div>

        </div>

        <div className="space-y-3 text-sm">

          <p className="font-semibold text-lg">

            {branding.companyName}

          </p>

          {branding.address && (
            <p className="text-gray-600">
              {branding.address}
            </p>
          )}

          {branding.phone && (
            <div className="flex items-center gap-2">

              <Phone className="h-4 w-4 text-gray-400" />

              {branding.phone}

            </div>
          )}

          {branding.email && (
            <div className="flex items-center gap-2">

              <Mail className="h-4 w-4 text-gray-400" />

              {branding.email}

            </div>
          )}

        </div>

      </Card>

      {/* TENANT */}

      <Card>

        <div className="mb-5 flex items-center gap-3">

          <div className="rounded-xl bg-sky-50 p-3">

            <User className="h-6 w-6 text-sky-600" />

          </div>

          <div>

            <h2 className="text-lg font-bold">

              Tenant

            </h2>

            <p className="text-sm text-gray-500">

              Billed To

            </p>

          </div>

        </div>

        <div className="space-y-3 text-sm">

          <p className="text-lg font-semibold">

            {tenant.full_name}

          </p>

          {tenant.phone && (

            <div className="flex items-center gap-2">

              <Phone className="h-4 w-4 text-gray-400" />

              {tenant.phone}

            </div>

          )}

          {tenant.email && (

            <div className="flex items-center gap-2">

              <Mail className="h-4 w-4 text-gray-400" />

              {tenant.email}

            </div>

          )}

        </div>

      </Card>

      {/* PROPERTY */}

      <Card>

        <div className="mb-5 flex items-center gap-3">

          <div className="rounded-xl bg-green-50 p-3">

            <Home className="h-6 w-6 text-green-600" />

          </div>

          <div>

            <h2 className="text-lg font-bold">

              Property

            </h2>

            <p className="text-sm text-gray-500">

              Lease Details

            </p>

          </div>

        </div>

        <div className="space-y-3 text-sm">

          <p className="font-semibold">

            {property.name}

          </p>

          {property.address && (

            <p className="text-gray-600">

              {property.address}

            </p>

          )}

          <div className="flex justify-between">

            <span className="text-gray-500">

              Unit

            </span>

            <span className="font-semibold">

              {unit.unit_number}

            </span>

          </div>

          <div className="flex justify-between">

            <span className="text-gray-500">

              Lease No.

            </span>

            <span className="font-semibold">

              {lease.lease_number || "-"}

            </span>

          </div>

          <div className="flex justify-between">

            <span className="text-gray-500">

              Rent

            </span>

            <span className="font-semibold">

              {currency}{" "}

              {Number(
                lease.rent_amount ?? 0
              ).toLocaleString()}

            </span>

          </div>

          <div className="flex justify-between">

            <span className="text-gray-500">

              Invoice

            </span>

            <span className="font-semibold">

              {invoice.invoice_number}

            </span>

          </div>

          <div className="flex justify-between">

            <span className="text-gray-500">

              Billing Period

            </span>

            <span className="font-semibold">

              {invoice.billing_period}

            </span>

          </div>

          <div className="flex justify-between">

            <span className="text-gray-500">

              Due Date

            </span>

            <span className="font-semibold">

              {invoice.due_date}

            </span>

          </div>

        </div>

      </Card>

    </div>
  );
}
