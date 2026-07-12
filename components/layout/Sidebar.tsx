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

  return (
    <>
      {/* Desktop Sidebar */}

      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-gray-200 bg-white md:flex md:flex-col">

        <div className="border-b border-gray-200 p-6">
          <Logo />
        </div>

        <nav className="flex-1 overflow-y-auto p-4">

          <ul className="space-y-2">

            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <li key={item.name}>

                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                      isActive(item.href)
                        ? "bg-black text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Icon size={20} />

                    <span className="font-medium">
                      {item.name}
                    </span>

                  </Link>

                </li>
              );
            })}

          </ul>

        </nav>

      </aside>

      {/* Mobile Sidebar */}

      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-64 transform border-r border-gray-200 bg-white shadow-xl transition-transform duration-300 md:hidden ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >

        <div className="border-b border-gray-200 p-6">
          <Logo />
        </div>

        <nav className="overflow-y-auto p-4">

          <ul className="space-y-2">

            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <li key={item.name}>

                  <Link
                    href={item.href}
                    onClick={() =>
                      setSidebarOpen(false)
                    }
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                      isActive(item.href)
                        ? "bg-black text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Icon size={20} />

                    <span className="font-medium">
                      {item.name}
                    </span>

                  </Link>

                </li>
              );
            })}

          </ul>

        </nav>

      </aside>
    </>
  );
}
