"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  {
    name: "Dashboard",
    href: "/dashboard/finance",
  },
  {
    name: "Payments",
    href: "/dashboard/finance/payments",
  },
  {
    name: "Invoices",
    href: "/dashboard/finance/invoices",
  },
  {
    name: "Billing",
    href: "/dashboard/finance/billing",
  },
  {
    name: "Reconciliation",
    href: "/dashboard/finance/reconciliation",
  },
  {
    name: "Statements",
    href: "/dashboard/finance/statements",
  },
  {
    name: "Expenses",
    href: "/dashboard/finance/expenses",
  },
  {
    name: "Reports",
    href: "/dashboard/finance/reports",
  },
];

export default function FinanceNavigation() {
  const pathname = usePathname();

  return (
    <div className="mb-6 border-b border-gray-200">
      <nav className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const active =
            pathname === tab.href ||
            (tab.href !== "/dashboard/finance" &&
              pathname.startsWith(tab.href));

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`rounded-t-xl px-5 py-3 text-sm font-semibold transition ${
                active
                  ? "bg-[#D4AF37] text-[#0F0F10]"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
