"use client";

import { useRouter } from "next/navigation";

import Card from "@/components/ui/Card";

import {
  CreditCard,
  ReceiptText,
  Repeat,
  Scale,
  FileText,
  BarChart3,
  ArrowRight,
} from "lucide-react";

type Action = {
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
};

const actions: Action[] = [
  {
    title: "Receive Payment",
    description: "Record tenant payments",
    icon: CreditCard,
    href: "/dashboard/payments",
  },
  {
    title: "Invoices",
    description: "View and manage invoices",
    icon: ReceiptText,
    href: "/dashboard/invoices",
  },
  {
    title: "Monthly Billing",
    description: "Generate recurring invoices",
    icon: Repeat,
    href: "/dashboard/recurring-charges",
  },
  {
    title: "Reconciliation",
    description: "Match invoices and payments",
    icon: Scale,
    href: "/dashboard/reconciliation",
  },
  {
    title: "Financial Reports",
    description: "Income and collection reports",
    icon: BarChart3,
    href: "/dashboard/reports",
  },
  {
    title: "Statements",
    description: "Tenant account statements",
    icon: FileText,
    href: "/dashboard/statements",
  },
];

export default function QuickActionsCard() {
  const router = useRouter();

  return (
    <Card>

      <div className="mb-6">

        <h2 className="text-xl font-bold">
          Quick Actions
        </h2>

        <p className="text-sm text-gray-500">
          Frequently used finance operations
        </p>

      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

        {actions.map((action) => {

          const Icon = action.icon;

          return (

            <button
              key={action.title}
              onClick={() => router.push(action.href)}
              className="group rounded-2xl border p-5 text-left transition-all hover:border-[#D4AF37] hover:bg-[#D4AF37]/5"
            >

              <div className="mb-4 flex items-center justify-between">

                <div className="rounded-xl bg-[#D4AF37]/10 p-3">

                  <Icon
                    size={24}
                    className="text-[#D4AF37]"
                  />

                </div>

                <ArrowRight
                  size={18}
                  className="text-gray-400 transition-transform group-hover:translate-x-1"
                />

              </div>

              <h3 className="font-semibold">

                {action.title}

              </h3>

              <p className="mt-2 text-sm text-gray-500">

                {action.description}

              </p>

            </button>

          );

        })}

      </div>

    </Card>
  );
}
