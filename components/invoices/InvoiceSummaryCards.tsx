"use client";

import StatCard from "@/components/ui/StatCard";
import {
  Wallet,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";

type Props = {
  totalAmount: number;
  paidAmount: number;
  outstanding: number;
  overdue: number;
  overdueAmount?: number;
};

function money(value: number) {
  return `KSh ${Number(value ?? 0).toLocaleString()}`;
}

export default function InvoiceSummaryCards({
  totalAmount,
  paidAmount,
  outstanding,
  overdue,
  overdueAmount = 0,
}: Props) {
  const collectionRate =
    totalAmount > 0
      ? ((paidAmount / totalAmount) * 100).toFixed(1)
      : "0.0";

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

      <StatCard
        title="Outstanding"
        value={money(outstanding)}
        subtitle="Amount still to collect"
        valueClassName="text-amber-500"
        icon={
          <Wallet className="h-6 w-6 text-amber-500" />
        }
      />

      <StatCard
        title="Overdue"
        value={money(overdueAmount)}
        subtitle={`${overdue} invoice${overdue === 1 ? "" : "s"} past due`}
        valueClassName="text-red-600"
        icon={
          <AlertTriangle className="h-6 w-6 text-red-600" />
        }
      />

      <StatCard
        title="Collected"
        value={money(paidAmount)}
        subtitle="Payments received"
        valueClassName="text-green-600"
        icon={
          <CheckCircle2 className="h-6 w-6 text-green-600" />
        }
      />

      <StatCard
        title="Collection Rate"
        value={`${collectionRate}%`}
        subtitle={`${money(totalAmount)} issued`}
        valueClassName="text-[#D4AF37]"
        icon={
          <TrendingUp className="h-6 w-6 text-[#D4AF37]" />
        }
      />

    </div>
  );
}
