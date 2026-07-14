"use client";

import { Menu, Bell, Search } from "lucide-react";
import { usePathname } from "next/navigation";

type TopbarProps = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
};

export default function Topbar({
  sidebarOpen,
  setSidebarOpen,
}: TopbarProps) {
  const pathname = usePathname();

  function getTitle() {
    if (pathname === "/") return "Dashboard";
    if (pathname.startsWith("/properties"))
      return "Properties";
    if (pathname.startsWith("/units"))
      return "Units";
    if (pathname.startsWith("/occupants"))
      return "Occupants";
    if (pathname.startsWith("/leases"))
      return "Leases";
    if (pathname.startsWith("/rent"))
      return "Rent";
    if (pathname.startsWith("/expenses"))
      return "Expenses";
    if (pathname.startsWith("/maintenance"))
      return "Maintenance";
    if (pathname.startsWith("/reports"))
      return "Reports";
    if (pathname.startsWith("/settings"))
      return "Settings";

    return "Ruby Rental";
  }

  function getSubtitle() {
    if (pathname === "/") {
      return "Welcome back.";
    }

    return "Rental Management Platform";
  }

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">

      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Left */}

        <div className="flex items-center gap-4">

          <button
            onClick={() =>
              setSidebarOpen(!sidebarOpen)
            }
            className="flex h-10 w-10 items-center justify-center rounded-xl transition hover:bg-gray-100 md:hidden"
            aria-label="Toggle Menu"
          >
            <Menu size={22} />
          </button>

          <div>

            <h1 className="text-xl font-bold text-gray-900">
              {getTitle()}
            </h1>

            <p className="hidden text-sm text-gray-500 md:block">
              {getSubtitle()}
            </p>

          </div>

        </div>

        {/* Right */}

        <div className="flex items-center gap-3">

          {/* Search */}

          <button className="hidden h-10 w-10 items-center justify-center rounded-xl border border-gray-200 transition hover:bg-gray-100 lg:flex">

            <Search size={18} />

          </button>

          {/* Notifications */}

          <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 transition hover:bg-gray-100">

            <Bell size={18} />

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#D4AF37]" />

          </button>

          {/* User */}

          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#111111] font-bold text-[#D4AF37] shadow-sm">

            R

          </button>

        </div>

      </div>

    </header>
  );
}
