"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import AppShell from "@/components/layout/AppShell";

import Breadcrumb from "@/components/common/Breadcrumb";

import PageContainer from "@/components/ui/PageContainer";
import PageHeader from "@/components/ui/PageHeader";
import Section from "@/components/ui/Section";
import StatCard from "@/components/ui/StatCard";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Loading from "@/components/ui/Loading";
import EmptyState from "@/components/ui/EmptyState";

import {
  DollarSign,
  CheckCircle2,
  Clock3,
  AlertTriangle,
} from "lucide-react";

import PaymentsList from "@/components/payments/PaymentsList";

import { getPaymentDashboard } from "@/services/payments/getPaymentDashboard";

type Payment = {
  lease_id: string;

  property_id: string;

  unit_id: string;

  occupant_id: string;

  lease_number: string;

  property_name: string;

  unit_number: string;

  occupant_name: string;

  monthly_rent: number;

  amount_paid: number;

  balance: number;

  due_day: number;

  payment_status: string;
};

export default function PaymentsPage() {

  const [payments, setPayments] =
    useState<Payment[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("All");

  useEffect(() => {
    loadPayments();
  }, []);

  async function loadPayments() {

    try {

      setLoading(true);

      const data =
        await getPaymentDashboard();

      setPayments(data ?? []);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  }

  const filteredPayments =
    useMemo(() => {

      const keyword =
        search.toLowerCase();

      return payments.filter(
        (payment) => {

          const matchesSearch =

            payment.occupant_name
              .toLowerCase()
              .includes(keyword) ||

            payment.property_name
              .toLowerCase()
              .includes(keyword) ||

            payment.unit_number
              .toLowerCase()
              .includes(keyword) ||

            payment.lease_number
              .toLowerCase()
              .includes(keyword);

          const matchesStatus =

            status === "All" ||

            payment.payment_status ===
              status;

          return (
            matchesSearch &&
            matchesStatus
          );

        }
      );

    }, [
      payments,
      search,
      status,
    ]);

  const expectedCollections =
    filteredPayments.reduce(
      (sum, payment) =>
        sum + Number(payment.monthly_rent),
      0
    );

  const collected =
    filteredPayments.reduce(
      (sum, payment) =>
        sum + Number(payment.amount_paid),
      0
    );

  const outstanding =
    filteredPayments.reduce(
      (sum, payment) =>
        sum + Number(payment.balance),
      0
    );

  const overdue =
    filteredPayments.filter(
      (payment) =>
        payment.payment_status ===
        "Overdue"
    ).length;
    return (

    <AppShell>

      <PageContainer>

        <Breadcrumb
          items={[
            {
              label: "Dashboard",
              href: "/",
            },
            {
              label: "Payments",
            },
          ]}
        />

        <PageHeader
          title="Payments"
          description="Manage rent collections, balances and payment history."
        >

          <Link href="/leases">

            <Button variant="primary">

              Record Payment

            </Button>

          </Link>

        </PageHeader>

        {/* Workflow Notice */}

        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">

          <p className="text-sm text-amber-800">

            Payments are always recorded against an active lease.
            To collect rent, open the tenant's lease and click
            <strong> Record Payment</strong>.

          </p>

        </div>

        {/* Executive Summary */}

        <Section>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">

            <StatCard
              title="Expected Rent"
              value={`KSh ${expectedCollections.toLocaleString()}`}
              subtitle="Monthly expected collections"
              valueClassName="text-[#D4AF37]"
              icon={
                <DollarSign className="h-6 w-6 text-[#D4AF37]" />
              }
            />

            <StatCard
              title="Collected"
              value={`KSh ${collected.toLocaleString()}`}
              subtitle="Payments received"
              valueClassName="text-green-600"
              icon={
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              }
            />

            <StatCard
              title="Outstanding"
              value={`KSh ${outstanding.toLocaleString()}`}
              subtitle="Balances remaining"
              valueClassName="text-amber-500"
              icon={
                <Clock3 className="h-6 w-6 text-amber-500" />
              }
            />

            <StatCard
              title="Overdue"
              value={overdue}
              subtitle="Leases requiring attention"
              valueClassName="text-red-600"
              icon={
                <AlertTriangle className="h-6 w-6 text-red-600" />
              }
            />

          </div>

        </Section>

        {/* Payment Dashboard */}

        <Section>

          <Card>

            <div className="mb-6">

              <h2 className="text-2xl font-bold text-gray-900">

                Rent Collection Dashboard

              </h2>

              <p className="mt-2 text-gray-500">

                Monitor rent collection progress for every active lease.

              </p>

            </div>
                        {loading ? (

              <Loading
                title="Loading Payment Dashboard"
                description="Preparing rent collection summary..."
              />

            ) : filteredPayments.length === 0 ? (

              <div className="space-y-6">

                <EmptyState
                  title="No Active Leases Found"
                  description="Create an active lease before recording rent payments."
                />

                <div className="flex justify-center">

                  <Link href="/leases">

                    <Button variant="secondary">

                      Go to Leases

                    </Button>

                  </Link>

                </div>

              </div>

            ) : (

              <pre className="overflow-auto rounded bg-gray-100 p-4 text-xs">
  {JSON.stringify(filteredPayments, null, 2)}
</pre>

            )}

          </Card>

        </Section>

      </PageContainer>

    </AppShell>

  );

}
