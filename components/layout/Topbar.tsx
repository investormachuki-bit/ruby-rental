"use client";

import { Menu } from "lucide-react";
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
    if (pathname.startsWith("/properties")) return "Properties";
    if (pathname.startsWith("/units")) return "Units";
    if (pathname.startsWith("/occupants")) return "Occupants";
    if (pathname.startsWith("/leases")) return "Leases";
    if (pathname.startsWith("/rent")) return "Rent";
    if (pathname.startsWith("/expenses")) return "Expenses";
    if (pathname.startsWith("/maintenance")) return "Maintenance";
    if (pathname.startsWith("/reports")) return "Reports";
    if (pathname.startsWith("/settings")) return "Settings";

    return "Ruby Rental";
  }

  function getSubtitle() {
    if (pathname === "/")
      return "Welcome back to Ruby Rental.";

    return "Rental Management System";
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">

      <div className="flex items-center gap-4">

        <button
          onClick={() =>
            setSidebarOpen(!sidebarOpen)
          }
          className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-gray-100 md:hidden"
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

      <button className="flex h-10 w-10 items-center justify-center rounded-full bg-black font-bold text-yellow-400 shadow">
        A
      </button>

    </header>
  );
}
