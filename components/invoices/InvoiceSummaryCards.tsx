"use client";

import StatCard from "@/components/ui/StatCard";
import {
  FileText,
  Clock3,
  Wallet,
  CheckCircle2,
  AlertTriangle,
  Receipt,
  Send,
  FilePlus2,
} from "lucide-react";

type Props = {
  totalInvoices: number;
  totalAmount: number;
  paid: number;
  outstanding: number;
  overdue: number;
  draft: number;
  sent: number;
  partiallyPaid: number;
};

export default function InvoiceSummaryCards({
  totalInvoices,
  totalAmount,
  paid,
  outstanding,
  overdue,
  draft,
  sent,
  partiallyPaid,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Invoices"
        value={totalInvoices}
        subtitle="Total invoices"
        icon={<FileText className="h-6 w-6 text-[#D4AF37]" />}
      />

      <StatCard
        title="Total Amount"
        value={`KSh ${totalAmount.toLocaleString()}`}
        subtitle="Issued value"
        valueClassName="text-[#D4AF37]"
        icon={<Receipt className="h-6 w-6 text-[#D4AF37]" />}
      />

      <StatCard
        title="Paid"
        value={paid}
        subtitle="Fully settled"
        icon={<CheckCircle2 className="h-6 w-6 text-green-600" />}
      />

      <StatCard
        title="Outstanding"
        value={`KSh ${outstanding.toLocaleString()}`}
        subtitle="Current balance"
        valueClassName="text-amber-500"
        icon={<Clock3 className="h-6 w-6 text-amber-500" />}
      />

      <StatCard
        title="Overdue"
        value={overdue}
        subtitle="Past due date"
        icon={<AlertTriangle className="h-6 w-6 text-red-600" />}
      />

      <StatCard
        title="Draft"
        value={draft}
        subtitle="Not yet issued"
        icon={<FilePlus2 className="h-6 w-6 text-gray-500" />}
      />

      <StatCard
        title="Sent"
        value={sent}
        subtitle="Issued and active"
        icon={<Send className="h-6 w-6 text-blue-600" />}
      />

      <StatCard
        title="Partially Paid"
        value={partiallyPaid}
        subtitle="Partially settled"
        icon={<Wallet className="h-6 w-6 text-blue-600" />}
      />
    </div>
  );
}
