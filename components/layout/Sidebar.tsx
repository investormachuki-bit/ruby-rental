"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Building2,
  Home,
  Users,
  Receipt,
  Wallet,
  BarChart3,
  Settings,
  Wrench,
} from "lucide-react";

import Logo from "./Logo";

type SidebarProps = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
};

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
}: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    {
      name: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
    },
    {
      name: "Properties",
      href: "/properties",
      icon: Building2,
    },
    {
      name: "Units",
      href: "/units",
      icon: Home,
    },
    {
      name: "Occupants",
      href: "/occupants",
      icon: Users,
    },
    {
      name: "Rent",
      href: "/rent",
      icon: Receipt,
    },
    {
      name: "Expenses",
      href: "/expenses",
      icon: Wallet,
    },
    {
      name: "Maintenance",
      href: "/maintenance",
      icon: Wrench,
    },
    {
      name: "Reports",
      href: "/reports",
      icon: BarChart3,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ];

  function isActive(href: string) {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  }

  const renderMenu = () => (
    <ul className="space-y-2">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href);

        return (
          <li key={item.name}>
            <Link
              href={item.href}
              onClick={() =>
                setSidebarOpen(false)
              }
              className={`group flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-200 ${
                active
                  ? "bg-[#D4AF37] text-black shadow-md"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon size={20} />

              <span className="flex-1 font-medium">
                {item.name}
              </span>

              {active && (
                <div className="h-2 w-2 rounded-full bg-black" />
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      {/* Desktop */}

      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-gray-800 bg-[#111111] md:flex md:flex-col">

        <div className="border-b border-gray-800 p-6">

          <Logo />

        </div>

        <div className="flex-1 overflow-y-auto p-4">

          {renderMenu()}

        </div>

        <div className="border-t border-gray-800 p-5">

          <p className="text-center text-xs tracking-wider text-gray-500">

            Ruby Rental v1.0

          </p>

        </div>

      </aside>

      {/* Mobile */}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col bg-[#111111] shadow-2xl transition-transform duration-300 md:hidden ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >

        <div className="border-b border-gray-800 p-6">

          <Logo />

        </div>

        <div className="flex-1 overflow-y-auto p-4">

          {renderMenu()}

        </div>

        <div className="border-t border-gray-800 p-5">

          <p className="text-center text-xs tracking-wider text-gray-500">

            Ruby Rental v1.0

          </p>

        </div>

      </aside>
    </>
  );
}
