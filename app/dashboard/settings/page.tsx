"use client";

import Link from "next/link";

import {
  Building2,
  Users,
  Shield,
  CreditCard,
  Home,
  MessageSquare,
  Lock,
  Plug,
  Settings2,
  ChevronRight,
} from "lucide-react";

const sections = [
  {
    title: "Company & Workspace",
    description: "Company profile, branding, tax and workspace settings.",
    href: "/dashboard/settings/company",
    icon: Building2,
  },
  {
    title: "Employees",
    description: "Create and manage staff members.",
    href: "/dashboard/settings/employees",
    icon: Users,
  },
  {
    title: "Roles & Permissions",
    description: "Control employee access rights.",
    href: "/dashboard/settings/roles",
    icon: Shield,
  },
  {
    title: "Billing & Finance",
    description: "Invoice numbering, receipts and rent settings.",
    href: "/dashboard/settings/billing",
    icon: CreditCard,
  },
  {
    title: "Property Configuration",
    description: "Property, unit and maintenance configuration.",
    href: "/dashboard/settings/property",
    icon: Home,
  },
  {
    title: "Communication",
    description: "SMS, WhatsApp and email settings.",
    href: "/dashboard/settings/communication",
    icon: MessageSquare,
  },
  {
    title: "Security",
    description: "PINs, passwords and security policies.",
    href: "/dashboard/settings/security",
    icon: Lock,
  },
  {
    title: "Integrations",
    description: "Mpesa, Airtel Money and external services.",
    href: "/dashboard/settings/integrations",
    icon: Plug,
  },
  {
    title: "System",
    description: "Subscription, backups and workspace information.",
    href: "/dashboard/settings/system",
    icon: Settings2,
  },
];

export default function SettingsPage() {
  return (
    <div className="space-y-8">

      <div>

        <h1 className="text-3xl font-bold text-gray-900">
          Settings
        </h1>

        <p className="mt-2 text-gray-500">
          Configure every aspect of your Ruby Rental workspace.
        </p>

      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

        {sections.map((section) => {

          const Icon = section.icon;

          return (

            <Link
              key={section.title}
              href={section.href}
              className="group rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#D4AF37] hover:shadow-xl"
            >

              <div className="flex items-center justify-between">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 transition-colors group-hover:bg-[#D4AF37]">

                  <Icon
                    size={26}
                    className="text-gray-700 group-hover:text-black"
                  />

                </div>

                <ChevronRight
                  className="text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-[#D4AF37]"
                />

              </div>

              <h2 className="mt-6 text-xl font-semibold text-gray-900">

                {section.title}

              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">

                {section.description}

              </p>

            </Link>

          );

        })}

      </div>

    </div>
  );
}
