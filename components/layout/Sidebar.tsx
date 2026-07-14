"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Building2,
  Home,
  Users,
  FileText,
  Receipt,
  Wallet,
  BarChart3,
  Settings,
  Wrench,
} from "lucide-react";

import Logo from "./Logo";

type SidebarProps = {
  sidebarOpen: boolean;
  setSidebarOpen: (
    open: boolean
  ) => void;
};

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
}: SidebarProps) {

  const pathname =
    usePathname();

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
      name: "Leases",
      href: "/leases",
      icon: FileText,
    },
    {
      name: "Payments",
      href: "/payments",
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

  function isActive(
    href: string
  ) {

    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(
      href
    );

  }

  const linkClass = (
    href: string
  ) =>
    `group flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-200 ${
      isActive(href)
        ? "bg-[#D4AF37] text-[#0F0F10] shadow-lg"
        : "text-white hover:bg-white/5 hover:text-white"
    }`;

  return (
    <>
            {/* Desktop Sidebar */}

      <aside className="fixed left-0 top-0 hidden h-screen w-64 flex-col border-r border-[#232323] bg-[#0F0F10] md:flex">

        {/* Logo */}

        <div className="border-b border-[#232323] p-6">

          <Logo />

        </div>

        {/* Navigation */}

        <nav className="flex-1 overflow-y-auto px-4 py-5">

          <ul className="space-y-2">

            {menuItems.map((item) => {

              const Icon = item.icon;

              return (

                <li key={item.name}>

                  <Link
                    href={item.href}
                    className={linkClass(item.href)}
                  >

                    <Icon
                      size={20}
                      className={
                        isActive(item.href)
                          ? "text-[#0F0F10]"
                          : "text-white transition group-hover:text-[#D4AF37]"
                      }
                    />

                    <span className="font-semibold tracking-wide">

                      {item.name}

                    </span>

                  </Link>

                </li>

              );

            })}

          </ul>

        </nav>

        {/* Footer */}

        <div className="border-t border-[#232323] p-5">

          <p className="text-center text-xs text-gray-600">

            Ruby Rental v1.0

          </p>

        </div>

      </aside>

      {/* Mobile Sidebar */}

      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-64 transform border-r border-[#232323] bg-[#0F0F10] shadow-2xl transition-transform duration-300 md:hidden ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >

        {/* Logo */}

        <div className="border-b border-[#232323] p-6">

          <Logo />

        </div>

        {/* Navigation */}

        <nav className="overflow-y-auto px-4 py-5">

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
                    className={linkClass(item.href)}
                  >

                    <Icon
                      size={20}
                      className={
                        isActive(item.href)
                          ? "text-[#0F0F10]"
                          : "text-white transition group-hover:text-[#D4AF37]"
                      }
                    />

                    <span className="font-semibold tracking-wide">

                      {item.name}

                    </span>

                  </Link>

                </li>

              );

            })}

          </ul>

        </nav>

        {/* Footer */}

        <div className="border-t border-[#232323] p-5">

          <p className="text-center text-xs text-gray-600">

            Ruby Rental v1.0

          </p>

        </div>

      </aside>

    </>
  );

}
