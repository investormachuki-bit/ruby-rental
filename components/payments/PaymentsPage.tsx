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
import { getAllPayments } from "@/services/payments/getAll";

type Payment = {
  id: string;

  receipt_number: string;

  occupant_name: string;

  property_name: string;

  unit_number: string;

  amount_due: number;

  amount_paid: number;

  balance: number;

  due_date: string;

  payment_date?: string;

  payment_method?: string;

  status:
    | "Paid"
    | "Partial"
    | "Pending"
    | "Overdue";
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
  await getAllPayments();

      setPayments(data ?? []);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  }

  const filteredPayments =
    useMemo(() => {

      return payments.filter(
        (payment) => {

          const keyword =
            search.toLowerCase();

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

            payment.receipt_number
              .toLowerCase()
              .includes(keyword);

          const matchesStatus =

            status === "All" ||

            payment.status === status;

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
        sum + payment.amount_due,
      0
    );

  const collected =
    filteredPayments.reduce(
      (sum, payment) =>
        sum + payment.amount_paid,
      0
    );

  const outstanding =
    filteredPayments.reduce(
      (sum, payment) =>
        sum + payment.balance,
      0
    );

  const overdue =
    filteredPayments.filter(
      (payment) =>
        payment.status ===
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
          description="Manage rent collections, balances and receipts."
        >

          {payments.length > 0 ? (

            <Button
              variant="primary"
              onClick={() => {
                // Connected during business rules phase
              }}
            >
              Record Payment
            </Button>

          ) : (

            <Link href="/leases">

              <Button variant="primary">

                Create Lease

              </Button>

            </Link>

          )}

        </PageHeader>

        {/* Workflow Banner */}

        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">

          <p className="text-sm text-amber-800">

            Payments are recorded against active leases.
            Create a lease first before collecting rent.

          </p>

        </div>
                {/* Executive Summary */}

        <Section>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">

            <StatCard
              title="Expected"
              value={`KSh ${expectedCollections.toLocaleString()}`}
              subtitle="Expected collections"
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
              subtitle="Outstanding balances"
              valueClassName="text-amber-500"
              icon={
                <Clock3 className="h-6 w-6 text-amber-500" />
              }
            />

            <StatCard
              title="Overdue"
              value={overdue}
              subtitle="Past due payments"
              valueClassName="text-red-600"
              icon={
                <AlertTriangle className="h-6 w-6 text-red-600" />
              }
            />

          </div>

        </Section>

        {/* Payment Records */}

        <Section>

          <Card>

            <div className="mb-6">

              <h2 className="text-2xl font-bold text-gray-900">

                Payment Records

              </h2>

              <p className="mt-2 text-gray-500">

                Monitor rent collections and outstanding balances across your portfolio.

              </p>

            </div>
                        {loading ? (

              <Loading
                title="Loading Payments"
                description="Preparing payment records..."
              />

            ) : filteredPayments.length === 0 ? (

              <EmptyState
                title="No Payment Records Yet"
                description="Payments will appear automatically after creating a lease, generating rent invoices and recording tenant payments."
              >

                <Link href="/leases">

                  <Button
                    variant="secondary"
                    className="mt-6"
                  >

                    Go to Leases

                  </Button>

                </Link>

              </EmptyState>

            ) : (

              <PaymentsList
                payments={filteredPayments}
              />

            )}

          </Card>

        </Section>
              </PageContainer>

    </AppShell>

  );
}
