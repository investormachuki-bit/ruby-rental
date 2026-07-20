"use client";

import {
  Wallet,
  CreditCard,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

interface Props {
  summary: {
    outstandingBalance: number;
    totalPaid: number;
    totalInvoiced: number;
    overdueInvoices: number;
  };
}

export default function TenantFinancialSummary({
  summary,
}: Props) {
  const cards = [
    {
      title: "Outstanding Balance",
      value: `KSh ${summary.outstandingBalance.toLocaleString()}`,
      icon: AlertTriangle,
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      title: "Total Paid",
      value: `KSh ${summary.totalPaid.toLocaleString()}`,
      icon: Wallet,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Total Invoiced",
      value: `KSh ${summary.totalInvoiced.toLocaleString()}`,
      icon: CreditCard,
      color: "text-[#D4AF37]",
      bg: "bg-yellow-50",
    },
    {
      title: "Overdue Invoices",
      value: summary.overdueInvoices.toString(),
      icon: TrendingUp,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-2xl border bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  {card.title}
                </p>

                <h3 className={`mt-2 text-2xl font-bold ${card.color}`}>
                  {card.value}
                </h3>
              </div>

              <div
                className={`rounded-xl p-3 ${card.bg}`}
              >
                <Icon
                  size={26}
                  className={card.color}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
