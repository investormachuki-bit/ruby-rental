"use client";

import StatCard from "@/components/ui/StatCard";

import {
  FileText,
  Clock3,
  Wallet,
  CheckCircle2,
  AlertTriangle,
  Receipt,
} from "lucide-react";

type Props = {
  totalInvoices: number;
  unpaid: number;
  partiallyPaid: number;
  paid: number;
  overdue: number;
  outstanding: number;
};

export default function InvoiceSummaryCards({
  totalInvoices,
  unpaid,
  partiallyPaid,
  paid,
  overdue,
  outstanding,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-6">

      <StatCard
        title="Invoices"
        value={totalInvoices}
        subtitle="Total invoices"
        icon={
          <FileText className="h-6 w-6 text-[#D4AF37]" />
        }
      />

      <StatCard
        title="Unpaid"
        value={unpaid}
        subtitle="Awaiting payment"
        icon={
          <Clock3 className="h-6 w-6 text-amber-500" />
        }
      />

      <StatCard
        title="Partially Paid"
        value={partiallyPaid}
        subtitle="Partially settled"
        icon={
          <Wallet className="h-6 w-6 text-blue-600" />
        }
      />

      <StatCard
        title="Paid"
        value={paid}
        subtitle="Fully settled"
        icon={
          <CheckCircle2 className="h-6 w-6 text-green-600" />
        }
      />

      <StatCard
        title="Overdue"
        value={overdue}
        subtitle="Past due date"
        icon={
          <AlertTriangle className="h-6 w-6 text-red-600" />
        }
      />

      <StatCard
        title="Outstanding"
        value={`KES ${outstanding.toLocaleString()}`}
        subtitle="Outstanding balance"
        valueClassName="text-[#D4AF37]"
        icon={
          <Receipt className="h-6 w-6 text-[#D4AF37]" />
        }
      />

    </div>
  );
}
