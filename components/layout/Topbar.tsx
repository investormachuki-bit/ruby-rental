"use client";

import {
  Bell,
  Menu,
  Search,
} from "lucide-react";

import { usePathname } from "next/navigation";

import { useBranding } from "@/contexts/BrandingContext";

type TopbarProps = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
};

export default function Topbar({
  sidebarOpen,
  setSidebarOpen,
}: TopbarProps) {
  const pathname = usePathname();

  const {
    branding,
  } = useBranding();

  const whiteLabelEnabled =
    branding?.enable_white_label === true;

  const accentColor =
    whiteLabelEnabled &&
    branding?.accent_color
      ? branding.accent_color
      : "#D4AF37";

  const primaryColor =
    whiteLabelEnabled &&
    branding?.primary_color
      ? branding.primary_color
      : "#111111";

  const appName =
    whiteLabelEnabled &&
    branding?.app_name
      ? branding.app_name
      : "Rental Management Platform";

  const companyName =
    whiteLabelEnabled &&
    branding?.company_name
      ? branding.company_name
      : "Ruby Rental";

  const companyInitial =
    companyName
      .trim()
      .charAt(0)
      .toUpperCase() || "R";

  function getTitle() {
    if (pathname === "/")
      return "Dashboard";

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

    return companyName;
  }

  function getSubtitle() {
    return pathname === "/"
      ? "Welcome back."
      : appName;
  }

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur-md">
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

          <button
            className="hidden h-10 w-10 items-center justify-center rounded-xl border border-gray-200 transition lg:flex"
            style={{
              borderColor: undefined,
            }}
            onMouseEnter={(event) => {
              event.currentTarget.style.borderColor =
                accentColor;
              event.currentTarget.style.backgroundColor =
                "#f9fafb";
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.borderColor =
                "#e5e7eb";
              event.currentTarget.style.backgroundColor =
                "transparent";
            }}
            title="Search"
          >
            <Search size={18} />
          </button>

          <button
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 transition"
            onMouseEnter={(event) => {
              event.currentTarget.style.borderColor =
                accentColor;
              event.currentTarget.style.backgroundColor =
                "#f9fafb";
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.borderColor =
                "#e5e7eb";
              event.currentTarget.style.backgroundColor =
                "transparent";
            }}
            title="Notifications"
          >
            <Bell size={18} />

            <span
              className="absolute right-2 top-2 h-2 w-2 rounded-full"
              style={{
                backgroundColor: accentColor,
              }}
            />
          </button>

          <button
            className="flex h-10 w-10 items-center justify-center rounded-full font-semibold shadow-sm transition hover:scale-105"
            style={{
              backgroundColor: primaryColor,
              color: accentColor,
            }}
            title={companyName}
          >
            {companyInitial}
          </button>

        </div>

      </div>
    </header>
  );
}