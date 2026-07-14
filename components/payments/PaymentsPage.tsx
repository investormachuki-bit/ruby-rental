"use client";

import { useEffect, useMemo, useState } from "react";

import {
  DollarSign,
  CheckCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";

import AppShell from "@/components/layout/AppShell";

import Breadcrumb from "@/components/common/Breadcrumb";

import PageContainer from "@/components/ui/PageContainer";
import PageHeader from "@/components/ui/PageHeader";
import Section from "@/components/ui/Section";
import StatCard from "@/components/ui/StatCard";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import SearchInput from "@/components/ui/SearchInput";
import Loading from "@/components/ui/Loading";
import EmptyState from "@/components/ui/EmptyState";

import PaymentsList from "./PaymentsList";
import ReceivePaymentModal from "./ReceivePaymentModal";

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
    | "Overdue"
    | "Pending";
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

  const [showReceiveModal, setShowReceiveModal] =
    useState(false);

  useEffect(() => {
    loadPayments();
  }, []);

  async function loadPayments() {

    try {

      setLoading(true);

      // TODO:
      // Replace with Supabase service
      // getPayments()

      setPayments([]);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  }

  const filteredPayments =
    useMemo(() => {

      return payments.filter((payment) => {

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
            .includes(keyword);

        const matchesStatus =
          status === "All" ||
          payment.status === status;

        return (
          matchesSearch &&
          matchesStatus
        );

      });

    }, [
      payments,
      search,
      status,
    ]);
    const expectedAmount =
    filteredPayments.reduce(
      (sum, payment) =>
        sum + payment.amount_due,
      0
    );

  const collectedAmount =
    filteredPayments.reduce(
      (sum, payment) =>
        sum + payment.amount_paid,
      0
    );

  const outstandingAmount =
    filteredPayments.reduce(
      (sum, payment) =>
        sum + payment.balance,
      0
    );

  const overduePayments =
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
          <Button
            variant="primary"
            onClick={() =>
              setShowReceiveModal(true)
            }
          >

            Record Payment

          </Button>

        </PageHeader>

        {/* Executive Summary */}

        <Section>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">

            <StatCard
              title="Expected"
              value={`KSh ${expectedAmount.toLocaleString()}`}
              subtitle="Expected collections"
              icon={
                <DollarSign className="h-6 w-6 text-[#D4AF37]" />
              }
              valueClassName="text-[#D4AF37]"
            />

            <StatCard
              title="Collected"
              value={`KSh ${collectedAmount.toLocaleString()}`}
              subtitle="Payments received"
              icon={
                <CheckCircle className="h-6 w-6 text-green-600" />
              }
              valueClassName="text-green-600"
            />

            <StatCard
              title="Outstanding"
              value={`KSh ${outstandingAmount.toLocaleString()}`}
              subtitle="Outstanding balances"
              icon={
                <Clock className="h-6 w-6 text-amber-500" />
              }
              valueClassName="text-amber-500"
            />

            <StatCard
              title="Overdue"
              value={overduePayments}
              subtitle="Past due payments"
              icon={
                <AlertTriangle className="h-6 w-6 text-red-600" />
              }
              valueClassName="text-red-600"
            />

          </div>

        </Section>

        <Section>

          <Card>

            <div className="mb-6">

              <h2 className="text-2xl font-bold text-gray-900">

                Payment Ledger

              </h2>

              <p className="mt-2 text-gray-500">

                View, search and record rent payments across all properties.

              </p>

            </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-2">

              <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="Search occupant, property or unit..."
              />

              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value)
                }
                className="rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-black"
              >

                <option value="All">
                  All Statuses
                </option>

                <option value="Paid">
                  Paid
                </option>

                <option value="Partial">
                  Partial
                </option>

                <option value="Pending">
                  Pending
                </option>

                <option value="Overdue">
                  Overdue
                </option>

              </select>

            </div>

            <div className="mt-8">

              {loading ? (

                <Loading
                  title="Loading Payments"
                  description="Preparing payment records..."
                />

              ) : filteredPayments.length === 0 ? (

                <EmptyState
                  title="No Payments Found"
                  description="Payment records will appear here once rent invoices and collections have been created."
                />

              ) : (

                <PaymentsList
                  payments={filteredPayments}
                />

              )}

            </div>

          </Card>

        </Section>
              </PageContainer>

      {showReceiveModal && (

        <ReceivePaymentModal
          onClose={() =>
            setShowReceiveModal(false)
          }
          onSaved={() => {
            setShowReceiveModal(false);
            loadPayments();
          }}
        />

      )}

    </AppShell>

  );
}
