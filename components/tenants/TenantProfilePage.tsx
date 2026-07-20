"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Edit,
  Phone,
  Mail,
  Briefcase,
  CreditCard,
  Building2,
  FileText,
  Wallet,
  Activity,
} from "lucide-react";
import Link from "next/link";

import { getTenant } from "@/services/tenants/getTenant";
import { getLeases } from "@/services/leases/getLeases";
import { getTenantInvoices } from "@/services/invoices/getTenantInvoices";
import TenantFinancialSummary from "@/components/tenants/TenantFinancialSummary";
import { getTenantPayments } from "@/services/payments/getTenantPayments";
import TenantPaymentsTable from "@/components/tenants/TenantPaymentsTable";

interface Props {
  tenantId: string;
}

export default function TenantProfilePage({
  tenantId,
}: Props) {
  const [tenant, setTenant] = useState<any>(null);
  const [lease, setLease] = useState<any>(null);

  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<
    "overview" | "payments" | "documents" | "activity"
  >("overview");

  const [invoiceSummary, setInvoiceSummary] = useState({
  outstandingBalance: 0,
  totalPaid: 0,
  totalInvoiced: 0,
  overdueInvoices: 0,
});

  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, [tenantId]);

  async function loadData() {
    try {
      setLoading(true);
const tenantData = await getTenant(tenantId);

const leases = await getLeases();

const invoiceData = await getTenantInvoices(tenantId);
      const tenantPayments =
  await getTenantPayments(tenantId);

const currentLease =
  leases.find(
    (lease: any) =>
      lease.tenant_id === tenantId &&
      lease.status === "Active"
  ) ?? null;

setTenant(tenantData);
setLease(currentLease);
setInvoiceSummary(invoiceData.summary);
setPayments(tenantPayments);
      
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-72 rounded bg-gray-200" />
          <div className="h-48 rounded-xl bg-gray-200" />
          <div className="h-64 rounded-xl bg-gray-200" />
        </div>
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">
            Tenant not found
          </h2>

          <Link
            href="/tenants"
            className="mt-4 inline-flex rounded-lg bg-[#D4AF37] px-5 py-3 text-white"
          >
            Back to Tenants
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">

      {/* Header */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <Link
            href="/tenants"
            className="mb-4 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black"
          >
            <ArrowLeft size={16} />
            Back to Tenants
          </Link>

          <h1 className="text-3xl font-bold">
            {tenant.full_name}
          </h1>

          <p className="mt-1 text-gray-500">
            {tenant.tenant_code}
          </p>

        </div>

        <button
          className="inline-flex items-center gap-2 rounded-lg bg-[#D4AF37] px-5 py-3 font-medium text-white shadow"
        >
          <Edit size={18} />
          Edit Tenant
        </button>

      </div>

      {/* Summary Card */}

      <div className="rounded-2xl border bg-white p-6 shadow-sm">

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

          <div className="flex items-center gap-3">
            <Phone className="text-[#D4AF37]" />
            <div>
              <p className="text-sm text-gray-500">
                Phone
              </p>
              <p className="font-semibold">
                {tenant.phone || "-"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Mail className="text-[#D4AF37]" />
            <div>
              <p className="text-sm text-gray-500">
                Email
              </p>
              <p className="font-semibold">
                {tenant.email || "-"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <CreditCard className="text-[#D4AF37]" />
            <div>
              <p className="text-sm text-gray-500">
                ID Number
              </p>
              <p className="font-semibold">
                {tenant.id_number || "-"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Briefcase className="text-[#D4AF37]" />
            <div>
              <p className="text-sm text-gray-500">
                Occupation
              </p>
              <p className="font-semibold">
                {tenant.occupation || "-"}
              </p>
            </div>
          </div>

        </div>

      </div>
            {/* Current Lease */}

      <div className="grid gap-6 lg:grid-cols-3">

        <div className="rounded-2xl border bg-white p-6 shadow-sm lg:col-span-2">

          <div className="mb-5 flex items-center gap-2">
            <Building2 className="text-[#D4AF37]" />
            <h2 className="text-xl font-semibold">
              Current Lease
            </h2>
          </div>

          {lease ? (
            <div className="grid gap-5 md:grid-cols-2">

              <div>
                <p className="text-sm text-gray-500">
                  Property
                </p>

                <p className="mt-1 font-semibold">
                  {lease.property?.name ?? "-"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Unit
                </p>

                <p className="mt-1 font-semibold">
                  {lease.unit?.unit_number ?? "-"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Monthly Rent
                </p>

                <p className="mt-1 text-lg font-bold text-[#D4AF37]">
                  KSh {Number(lease.monthly_rent ?? 0).toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Deposit
                </p>

                <p className="mt-1 font-semibold">
                  KSh {Number(lease.deposit ?? 0).toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Lease Start
                </p>

                <p className="mt-1 font-semibold">
                  {lease.start_date}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Lease End
                </p>

                <p className="mt-1 font-semibold">
                  {lease.end_date}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Status
                </p>

                <span className="mt-1 inline-flex rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                  {lease.status}
                </span>
              </div>

            </div>
          ) : (
            <div className="rounded-xl border border-dashed p-8 text-center text-gray-500">
              No active lease assigned.
            </div>
          )}

        </div>

        {/* Financial Summary */}
<TenantFinancialSummary
  summary={invoiceSummary}
/>

      </div>

      {/* Tabs */}

      <div className="rounded-2xl border bg-white shadow-sm">

        <div className="flex flex-wrap gap-2 border-b p-4">

          {[
            {
              id: "overview",
              label: "Overview",
              icon: Building2,
            },
            {
              id: "payments",
              label: "Payments",
              icon: Wallet,
            },
            {
              id: "documents",
              label: "Documents",
              icon: FileText,
            },
            {
              id: "activity",
              label: "Activity",
              icon: Activity,
            },
          ].map((tab) => {
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 transition ${
                  activeTab === tab.id
                    ? "bg-[#D4AF37] text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}

        </div>
                {/* Tab Content */}

        <div className="p-6">

          {activeTab === "overview" && (
            <div className="grid gap-6 lg:grid-cols-2">

              <div className="rounded-xl border p-5">
                <h3 className="mb-4 text-lg font-semibold">
                  Personal Information
                </h3>

                <div className="space-y-3">

                  <div className="flex justify-between">
                    <span className="text-gray-500">First Name</span>
                    <span className="font-medium">
                      {tenant.first_name || "-"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500">Last Name</span>
                    <span className="font-medium">
                      {tenant.last_name || "-"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500">Employer</span>
                    <span className="font-medium">
                      {tenant.employer || "-"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500">Occupation</span>
                    <span className="font-medium">
                      {tenant.occupation || "-"}
                    </span>
                  </div>

                </div>
              </div>

              <div className="rounded-xl border p-5">
                <h3 className="mb-4 text-lg font-semibold">
                  Lease Information
                </h3>

                {lease ? (
                  <div className="space-y-3">

                    <div className="flex justify-between">
                      <span className="text-gray-500">Property</span>
                      <span className="font-medium">
                        {lease.property?.name}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-500">Unit</span>
                      <span className="font-medium">
                        {lease.unit?.unit_number}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-500">Rent</span>
                      <span className="font-medium">
                        KSh {Number(lease.monthly_rent ?? 0).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-500">Deposit</span>
                      <span className="font-medium">
                        KSh {Number(lease.deposit ?? 0).toLocaleString()}
                      </span>
                    </div>

                  </div>
                ) : (
                  <p className="text-gray-500">
                    No active lease.
                  </p>
                )}

              </div>

            </div>
          )}

          {activeTab === "payments" && (
  <TenantPaymentsTable
    payments={payments}
  />
)}

          {activeTab === "documents" && (
            <div className="rounded-xl border border-dashed p-12 text-center">

              <FileText
                size={50}
                className="mx-auto mb-4 text-[#D4AF37]"
              />

              <h3 className="text-xl font-semibold">
                Documents
              </h3>

              <p className="mt-2 text-gray-500">
                Upload lease agreements, IDs,
                passports and other tenant documents.
              </p>

              <button className="mt-6 rounded-lg bg-[#D4AF37] px-6 py-3 font-medium text-white">
                Upload Document
              </button>

            </div>
          )}

          {activeTab === "activity" && (
            <div className="space-y-5">

              <div className="flex gap-4">

                <div className="mt-1 h-3 w-3 rounded-full bg-[#D4AF37]" />

                <div>
                  <p className="font-semibold">
                    Tenant profile created
                  </p>

                  <p className="text-sm text-gray-500">
                    {tenant.created_at
                      ? new Date(
                          tenant.created_at
                        ).toLocaleString()
                      : "-"}
                  </p>
                </div>

              </div>

              {lease && (
                <div className="flex gap-4">

                  <div className="mt-1 h-3 w-3 rounded-full bg-green-500" />

                  <div>
                    <p className="font-semibold">
                      Lease activated
                    </p>

                    <p className="text-sm text-gray-500">
                      {lease.start_date}
                    </p>
                  </div>

                </div>
              )}

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
