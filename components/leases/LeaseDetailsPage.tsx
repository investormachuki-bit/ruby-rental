"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import Breadcrumb from "@/components/common/Breadcrumb";
import { getLease } from "@/services/leases/getLease";
import ReceivePaymentModal from "@/components/payments/ReceivePaymentModal";
import { getPayments } from "@/services/payments/getPayments";

type Props = {
  leaseId: string;
};

export default function LeaseDetailsPage({
  leaseId,
}: Props) {

  const [lease, setLease] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  const [activeTab, setActiveTab] =
    useState("Overview");
  const [payments, setPayments] =
  useState<any[]>([]);

const [showPaymentModal, setShowPaymentModal] =
  useState(false);

  useEffect(() => {
    loadLease();
  }, []);

  async function loadLease() {

  try {

    setLoading(true);

    const data =
      await getLease(leaseId);

    setLease(data);

    const paymentData =
      await getPayments(leaseId);

    setPayments(paymentData);

  } catch (error) {

    console.error(error);

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

            {lease.occupant.first_name}{" "}
            {lease.occupant.last_name}

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
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {lease.status}
          </span>
<button
  onClick={() =>
    setShowPaymentModal(true)
  }
  className="rounded-xl bg-black px-5 py-3 font-semibold text-white"
>

            Record Payment

          </button>

          <button className="rounded-xl border px-5 py-3">

            Renew Lease

          </button>

          <button className="rounded-xl border border-red-300 px-5 py-3 text-red-600">

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
            KSh{" "}
            {Number(
              lease.rent_amount
            ).toLocaleString()}
          </h2>

        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">

          <p className="text-sm text-gray-500">
            Deposit
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            KSh{" "}
            {Number(
              lease.deposit_amount
            ).toLocaleString()}
          </h2>

        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">

          <p className="text-sm text-gray-500">
            Rent Due Day
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {lease.rent_due_day}
          </h2>

        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">

          <p className="text-sm text-gray-500">
            Outstanding
          </p>

          <h2 className="mt-2 text-3xl font-bold text-red-600">
            KSh 0
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
              onClick={() =>
                setActiveTab(tab)
              }
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

      {activeTab ===
        "Overview" && (

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
                  {lease.occupant.first_name}{" "}
                  {lease.occupant.last_name}
                </p>

              </div>

              <div>

                <p className="text-sm text-gray-500">
                  Phone Number
                </p>

                <p className="mt-1 font-semibold">
                  {lease.occupant.phone_number || "-"}
                </p>

              </div>

              <div>

                <p className="text-sm text-gray-500">
                  Email
                </p>

                <p className="mt-1 font-semibold">
                  {lease.occupant.email || "-"}
                </p>

              </div>

              <div>

                <p className="text-sm text-gray-500">
                  ID Number
                </p>

                <p className="mt-1 font-semibold">
                  {lease.occupant.id_number || "-"}
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
                  Lease Type
                </p>

                <p className="mt-1 font-semibold">
                  {lease.lease_type}
                </p>

              </div>

              <div>

                <p className="text-sm text-gray-500">
                  Start Date
                </p>

                <p className="mt-1 font-semibold">
                  {lease.start_date}
                </p>

              </div>

              <div>

                <p className="text-sm text-gray-500">
                  End Date
                </p>

                <p className="mt-1 font-semibold">
                  {lease.end_date ??
                    "Open-ended"}
                </p>

              </div>

              <div>

                <p className="text-sm text-gray-500">
                  Grace Period
                </p>

                <p className="mt-1 font-semibold">
                  {lease.grace_period_days} Days
                </p>

              </div>

              <div>

                <p className="text-sm text-gray-500">
                  Rent Due Day
                </p>

                <p className="mt-1 font-semibold">
                  Every {lease.rent_due_day}
                  {lease.rent_due_day === 1
                    ? "st"
                    : lease.rent_due_day === 2
                    ? "nd"
                    : lease.rent_due_day === 3
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
                  KSh{" "}
                  {Number(
                    lease.rent_amount
                  ).toLocaleString()}
                </p>

              </div>

              <div>

                <p className="text-sm text-gray-500">
                  Deposit
                </p>

                <p className="mt-1 text-2xl font-bold">
                  KSh{" "}
                  {Number(
                    lease.deposit_amount
                  ).toLocaleString()}
                </p>

              </div>

              <div>

                <p className="text-sm text-gray-500">
                  Outstanding Balance
                </p>

                <p className="mt-1 text-2xl font-bold text-red-600">
                  KSh 0
                </p>

              </div>

              <div>

                <p className="text-sm text-gray-500">
                  Current Balance
                </p>

                <p className="mt-1 text-2xl font-bold text-green-600">
                  KSh 0
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
{activeTab ===
"Payments" && (

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
onClick={() =>
setShowPaymentModal(true)
}
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

{payments.map(
(payment) => (

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

KSh{" "}

{Number(
payment.amount
).toLocaleString()}

</td>

</tr>

)
)}

</tbody>

</table>

</div>

)}

</div>

)}

{activeTab !== "Overview" &&
  activeTab !== "Payments" && (

  <div className="rounded-2xl border border-dashed bg-white p-16 text-center">

    <h2 className="text-2xl font-bold">
      {activeTab}
    </h2>

    <p className="mt-3 text-gray-500">
      Coming soon.
    </p>

  </div>

)}

{showPaymentModal &&
  lease && (

  <ReceivePaymentModal
    lease={lease}
    onCancel={() =>
      setShowPaymentModal(false)
    }
    onSuccess={() => {

      setShowPaymentModal(false);

      loadLease();

    }}
  />

)}

    </div>

  );

}
