"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import type { LeaseDetails } from "@/types/lease";

import Breadcrumb from "@/components/common/Breadcrumb";

import { getLease } from "@/services/leases/getLease";

import ReceivePaymentModal from "@/components/payments/ReceivePaymentModal";
import { getPayments } from "@/services/payments/getPayments";

import CreateInvoiceModal from "@/components/invoices/CreateInvoiceModal";
import { getInvoices } from "@/services/invoices/getInvoices";
import RenewLeaseModal from "@/components/leases/RenewLeaseModal";

import TerminateLeaseModal from "@/components/leases/TerminateLeaseModal";

import LeaseLedger from "@/components/leases/LeaseLedger";

import LeaseActivityTimeline from "@/components/leases/LeaseActivityTimeline";

type Props = {
  leaseId: string;
};

type Payment = {
  id: string;

  receipt_number: string;

  payment_date: string;

  payment_method: string;

  payment_type: string;

  amount: number;
};

type Invoice = {
  id: string;

  invoice_number: string;

  billing_period: string;

  due_date: string;

  amount: number;

  balance: number;

  status: string;
};

export default function LeaseDetailsPage({
  leaseId,
}: Props) {

  const [lease, setLease] =
    useState<LeaseDetails | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [activeTab, setActiveTab] =
    useState("Overview");

  const [payments, setPayments] =
    useState<Payment[]>([]);

  const [showPaymentModal, setShowPaymentModal] =
    useState(false);

  const [invoices, setInvoices] =
    useState<Invoice[]>([]);

  const [showInvoiceModal, setShowInvoiceModal] =
    useState(false);
const [showRenewModal, setShowRenewModal] =
  useState(false);

const [showTerminateModal, setShowTerminateModal] =
  useState(false);
  
  const totalInvoiced =
    invoices.reduce(
      (sum, invoice) =>
        sum + Number(invoice.amount ?? 0),
      0
    );

  const totalPaid =
    payments.reduce(
      (sum, payment) =>
        sum + Number(payment.amount ?? 0),
      0
    );

  const outstandingBalance =
    invoices.reduce(
      (sum, invoice) =>
        sum + Number(invoice.balance ?? 0),
      0
    );

  const latestInvoice =
    invoices.length > 0
      ? invoices[0]
      : null;

  const latestPayment =
    payments.length > 0
      ? payments[0]
      : null;

  useEffect(() => {
    loadLease();
  }, []);

  async function loadLease() {

    try {

      setLoading(true);

      const leaseData =
        await getLease(leaseId);

      setLease(leaseData);

      const paymentData =
        await getPayments(leaseId);

      setPayments(paymentData ?? []);

      const invoiceData =
        await getInvoices(leaseId);

      setInvoices(invoiceData ?? []);

    } catch (error: any) {

  alert(JSON.stringify(error, null, 2));

} finally {

  setLoading(false);

}

  }

  if (loading) {

    return (

      <div className="rounded-2xl border bg-white p-12 text-center">

        Loading lease...

      </div>

    );

  }

  if (!lease) {

    return (

      <div className="rounded-2xl border bg-white p-12 text-center">

        Lease not found.

      </div>

    );

  }
    return (

    <div className="space-y-8">

      <Breadcrumb
        items={[
          {
            label: "Dashboard",
            href: "/",
          },
          {
            label: "Leases",
            href: "/leases",
          },
          {
            label: lease.lease_number,
          },
        ]}
      />

      {/* Header */}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <Link
            href="/leases"
            className="text-sm text-gray-500 hover:text-black"
          >
            ← Back to Leases
          </Link>

          <h1 className="mt-3 text-4xl font-bold">
            {lease.tenant.full_name}
          </h1>

          <p className="mt-2 text-gray-500">
            {lease.property.name}
            {" • "}
            Unit {lease.unit.unit_number}
          </p>

        </div>

        <div className="flex flex-wrap gap-3">

          <span
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              lease.status === "Active"
                ? "bg-green-100 text-green-700"
                : lease.status === "Ended"
                ? "bg-gray-200 text-gray-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {lease.status}
          </span>

          <button
            onClick={() => setShowPaymentModal(true)}
            className="rounded-xl bg-black px-5 py-3 font-semibold text-white"
          >
            Record Payment
          </button>

          <button
  onClick={() => setShowRenewModal(true)}
  className="rounded-xl border px-5 py-3"
>
  Renew Lease
</button>
<button
  onClick={() => setShowTerminateModal(true)}
  className="rounded-xl border border-red-300 px-5 py-3 text-red-600"
>
  Terminate
</button>

        </div>

      </div>

      {/* Executive Summary */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-2xl border bg-white p-5 shadow-sm">

          <p className="text-sm text-gray-500">
            Monthly Rent
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            KSh {Number(lease.rent_amount).toLocaleString()}
          </h2>

        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">

          <p className="text-sm text-gray-500">
            Deposit
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            KSh {Number(lease.deposit_amount).toLocaleString()}
          </h2>

        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">

          <p className="text-sm text-gray-500">
            Billing Day
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {lease.billing_day}
          </h2>

        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">

          <p className="text-sm text-gray-500">
            Outstanding
          </p>

          <h2 className="mt-2 text-3xl font-bold text-red-600">
            KSh {outstandingBalance.toLocaleString()}
          </h2>

        </div>

      </div>

      {/* Navigation */}

      <div className="overflow-x-auto">

        <div className="flex gap-2 rounded-2xl border bg-white p-2">

          {[
            "Overview",
            "Payments",
            "Invoices",
            "Ledger",
            "Documents",
            "Activity",
          ].map((tab) => (

            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-xl px-5 py-3 font-medium transition ${
                activeTab === tab
                  ? "bg-black text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              {tab}
            </button>

          ))}

        </div>

      </div>
      {activeTab === "Overview" && (

  <div className="grid gap-6 xl:grid-cols-2">

    {/* Tenant Information */}

    <div className="rounded-2xl border bg-white p-6 shadow-sm">

      <h3 className="text-xl font-bold">
        Tenant Information
      </h3>

      <div className="mt-6 grid gap-5 md:grid-cols-2">

        <div>

          <p className="text-sm text-gray-500">
            Full Name
          </p>

          <p className="mt-1 font-semibold">
            {lease.tenant.full_name}
          </p>

        </div>

        <div>

          <p className="text-sm text-gray-500">
            Phone Number
          </p>

          <p className="mt-1 font-semibold">
            {lease.tenant.phone || "-"}
          </p>

        </div>

        <div>

          <p className="text-sm text-gray-500">
            Email
          </p>

          <p className="mt-1 font-semibold">
            {lease.tenant.email || "-"}
          </p>

        </div>

        <div>

          <p className="text-sm text-gray-500">
            ID Number
          </p>

          <p className="mt-1 font-semibold">
            {lease.tenant.id_number || "-"}
          </p>

        </div>

      </div>

    </div>

    {/* Property Information */}

    <div className="rounded-2xl border bg-white p-6 shadow-sm">

      <h3 className="text-xl font-bold">
        Property Information
      </h3>

      <div className="mt-6 grid gap-5 md:grid-cols-2">

        <div>

          <p className="text-sm text-gray-500">
            Property
          </p>

          <p className="mt-1 font-semibold">
            {lease.property.name}
          </p>

        </div>

        <div>

          <p className="text-sm text-gray-500">
            Unit
          </p>

          <p className="mt-1 font-semibold">
            {lease.unit.unit_number}
          </p>

        </div>

        <div>

          <p className="text-sm text-gray-500">
            County
          </p>

          <p className="mt-1 font-semibold">
            {lease.property.county || "-"}
          </p>

        </div>

        <div>

          <p className="text-sm text-gray-500">
            Town
          </p>

          <p className="mt-1 font-semibold">
            {lease.property.town || "-"}
          </p>

        </div>

        <div>

          <p className="text-sm text-gray-500">
            Floor
          </p>

          <p className="mt-1 font-semibold">
            {lease.unit.floor_name || "-"}
          </p>

        </div>

      </div>

    </div>

    {/* Lease Information */}

    <div className="rounded-2xl border bg-white p-6 shadow-sm">

      <h3 className="text-xl font-bold">
        Lease Information
      </h3>

      <div className="mt-6 grid gap-5 md:grid-cols-2">

        <div>

          <p className="text-sm text-gray-500">
            Lease Number
          </p>

          <p className="mt-1 font-semibold">
            {lease.lease_number}
          </p>

        </div>

        <div>

          <p className="text-sm text-gray-500">
            Status
          </p>

          <p className="mt-1 font-semibold">
            {lease.status}
          </p>

        </div>

        <div>

          <p className="text-sm text-gray-500">
            Move In Date
          </p>

          <p className="mt-1 font-semibold">
            {lease.move_in_date}
          </p>

        </div>

        <div>

          <p className="text-sm text-gray-500">
            Move Out Date
          </p>

          <p className="mt-1 font-semibold">
            {lease.move_out_date || "Open-ended"}
          </p>

        </div>

        <div>

          <p className="text-sm text-gray-500">
            Billing Day
          </p>

          <p className="mt-1 font-semibold">
            Every {lease.billing_day}
            {lease.billing_day === 1
              ? "st"
              : lease.billing_day === 2
              ? "nd"
              : lease.billing_day === 3
              ? "rd"
              : "th"}
          </p>

        </div>

      </div>

    </div>

    {/* Financial Information */}

    <div className="rounded-2xl border bg-white p-6 shadow-sm">

      <h3 className="text-xl font-bold">
        Financial Information
      </h3>

      <div className="mt-6 grid gap-5 md:grid-cols-2">

        <div>

          <p className="text-sm text-gray-500">
            Monthly Rent
          </p>

          <p className="mt-1 text-2xl font-bold">
            KSh {Number(lease.rent_amount).toLocaleString()}
          </p>

        </div>

        <div>

          <p className="text-sm text-gray-500">
            Deposit
          </p>

          <p className="mt-1 text-2xl font-bold">
            KSh {Number(lease.deposit_amount).toLocaleString()}
          </p>

        </div>

        <div>

          <p className="text-sm text-gray-500">
            Total Invoiced
          </p>

          <p className="mt-1 text-2xl font-bold">
            KSh {totalInvoiced.toLocaleString()}
          </p>

        </div>

        <div>

          <p className="text-sm text-gray-500">
            Total Paid
          </p>

          <p className="mt-1 text-2xl font-bold text-green-600">
            KSh {totalPaid.toLocaleString()}
          </p>

        </div>

        <div>

          <p className="text-sm text-gray-500">
            Outstanding Balance
          </p>

          <p className="mt-1 text-2xl font-bold text-red-600">
            KSh {outstandingBalance.toLocaleString()}
          </p>

        </div>

      </div>

      {lease.notes && (

        <div className="mt-8 border-t pt-6">

          <h4 className="font-semibold">
            Notes
          </h4>

          <p className="mt-3 whitespace-pre-wrap text-gray-600">
            {lease.notes}
          </p>

        </div>

      )}

    </div>

  </div>

)}
      {activeTab === "Payments" && (

  <div className="rounded-2xl border bg-white shadow-sm">

    <div className="flex items-center justify-between border-b p-6">

      <div>

        <h3 className="text-xl font-bold">
          Payments
        </h3>

        <p className="text-gray-500">
          Payment history for this lease.
        </p>

      </div>

      <button
        onClick={() => setShowPaymentModal(true)}
        className="rounded-xl bg-black px-5 py-3 font-semibold text-white"
      >
        + Receive Payment
      </button>

    </div>

    {payments.length === 0 ? (

      <div className="p-12 text-center text-gray-500">

        No payments recorded.

      </div>

    ) : (

      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead className="bg-gray-50">

            <tr>

              <th className="p-4 text-left">
                Date
              </th>

              <th className="p-4 text-left">
                Receipt
              </th>

              <th className="p-4 text-left">
                Method
              </th>

              <th className="p-4 text-left">
                Type
              </th>

              <th className="p-4 text-right">
                Amount
              </th>

            </tr>

          </thead>

          <tbody>

            {payments.map((payment) => (

              <tr
                key={payment.id}
                className="border-t"
              >

                <td className="p-4">
                  {payment.payment_date}
                </td>

                <td className="p-4">
                  {payment.receipt_number}
                </td>

                <td className="p-4">
                  {payment.payment_method}
                </td>

                <td className="p-4">
                  {payment.payment_type}
                </td>

                <td className="p-4 text-right font-semibold">
                  KSh {Number(payment.amount).toLocaleString()}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    )}

  </div>

)}

{activeTab === "Invoices" && (

  <div className="rounded-2xl border bg-white shadow-sm">

    <div className="flex items-center justify-between border-b p-6">

      <div>

        <h3 className="text-xl font-bold">
          Invoices
        </h3>

        <p className="text-gray-500">
          Billing history for this lease.
        </p>

      </div>

      <button
        onClick={() => setShowInvoiceModal(true)}
        className="rounded-xl bg-black px-5 py-3 font-semibold text-white"
      >
        + Create Invoice
      </button>

    </div>

    {invoices.length === 0 ? (

      <div className="p-12 text-center text-gray-500">

        No invoices created.

      </div>

    ) : (

      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead className="bg-gray-50">

            <tr>

              <th className="p-4 text-left">
                Invoice
              </th>

              <th className="p-4 text-left">
                Period
              </th>

              <th className="p-4 text-left">
                Due Date
              </th>

              <th className="p-4 text-left">
                Status
              </th>

              <th className="p-4 text-right">
                Amount
              </th>

              <th className="p-4 text-right">
                Balance
              </th>

            </tr>

          </thead>

          <tbody>

            {invoices.map((invoice) => (

              <tr
                key={invoice.id}
                className="border-t"
              >

                <td className="p-4">
                  {invoice.invoice_number}
                </td>

                <td className="p-4">
                  {invoice.billing_period}
                </td>

                <td className="p-4">
                  {invoice.due_date}
                </td>

                <td className="p-4">

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      invoice.status === "Paid"
                        ? "bg-green-100 text-green-700"
                        : invoice.status === "Partially Paid"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {invoice.status}
                  </span>

                </td>

                <td className="p-4 text-right">
                  KSh {Number(invoice.amount).toLocaleString()}
                </td>

                <td className="p-4 text-right font-semibold">
                  KSh {Number(invoice.balance).toLocaleString()}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    )}

  </div>

)}
{/* Ledger */}

{activeTab === "Ledger" && (

  <LeaseLedger
    leaseId={lease.id}
  />

)}

{/* Documents */}

{activeTab === "Documents" && (

  <div className="rounded-2xl border border-dashed bg-white p-16 text-center">

    <h2 className="text-2xl font-bold">
      Documents
    </h2>

    <p className="mt-3 text-gray-500">
      Document management will be available soon.
    </p>

  </div>

)}

{/* Activity */}

{activeTab === "Activity" && (

  <LeaseActivityTimeline
    leaseId={lease.id}
  />

)}

{showPaymentModal && lease && (

  <ReceivePaymentModal
    lease={lease}
    onCancel={() => setShowPaymentModal(false)}
    onSuccess={() => {
      setShowPaymentModal(false);
      loadLease();
    }}
  />

)}

{showInvoiceModal && lease && (

  <CreateInvoiceModal
    lease={lease}
    onCancel={() => setShowInvoiceModal(false)}
    onSuccess={() => {
      setShowInvoiceModal(false);
      loadLease();
    }}
  />

)}

{/* Renew Lease */}

{showRenewModal && lease && (

  <RenewLeaseModal
    lease={lease}
    onCancel={() => setShowRenewModal(false)}
    onSuccess={() => {
      setShowRenewModal(false);
      loadLease();
    }}
  />

)}

{/* Terminate Lease */}

{showTerminateModal && lease && (

  <TerminateLeaseModal
    lease={lease}
    onCancel={() => setShowTerminateModal(false)}
    onSuccess={() => {
      setShowTerminateModal(false);
      loadLease();
    }}
  />

)}
    </div>

  );

}
