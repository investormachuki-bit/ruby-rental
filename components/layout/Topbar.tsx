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

  const { branding } = useBranding();

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
    if (
      pathname === "/dashboard" ||
      pathname === "/"
    ) {
      return "Dashboard";
    }

    if (pathname.startsWith("/properties")) {
      return "Properties";
    }

    if (pathname.startsWith("/units")) {
      return "Units";
    }

    if (pathname.startsWith("/occupants")) {
      return "Occupants";
    }

    if (pathname.startsWith("/leases")) {
      return "Leases";
    }

    if (pathname.startsWith("/rent")) {
      return "Rent";
    }

    if (pathname.startsWith("/expenses")) {
      return "Expenses";
    }

    if (pathname.startsWith("/maintenance")) {
      return "Maintenance";
    }

    if (pathname.startsWith("/reports")) {
      return "Reports";
    }

    if (pathname.startsWith("/settings")) {
      return "Settings";
    }

    return companyName;
  }

  function getSubtitle() {
    return pathname === "/" ||
      pathname === "/dashboard"
      ? "Welcome back."
      : appName;
  }

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur-md">

      <div className="flex h-16 items-center justify-between px-4 sm:h-[72px] sm:px-6 lg:px-8">

        {/* LEFT SIDE */}

        <div className="flex min-w-0 items-center gap-3 sm:gap-4">

          {/* Mobile Menu */}

          <button
            type="button"
            onClick={() =>
              setSidebarOpen(!sidebarOpen)
            }
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-gray-700 transition hover:bg-gray-100 hover:text-gray-900 md:hidden"
            aria-label="Toggle Menu"
            aria-expanded={sidebarOpen}
          >
            <Menu size={22} />
          </button>

          {/* Page Title */}

          <div className="min-w-0">

            <h1 className="truncate text-xl font-bold text-gray-900 sm:text-2xl">
              {getTitle()}
            </h1>

            <p className="hidden truncate text-sm text-gray-500 md:block">
              {getSubtitle()}
            </p>

          </div>

        </div>

        {/* RIGHT SIDE */}

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">

          {/* Search */}

          <button
            type="button"
            className="hidden h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-600 transition lg:flex"
            onMouseEnter={(event) => {
              event.currentTarget.style.borderColor =
                accentColor;

              event.currentTarget.style.backgroundColor =
                "#f9fafb";

              event.currentTarget.style.color =
                primaryColor;
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.borderColor =
                "#e5e7eb";

              event.currentTarget.style.backgroundColor =
                "transparent";

              event.currentTarget.style.color =
                "#4b5563";
            }}
            title="Search"
            aria-label="Search"
          >
            <Search size={18} />
          </button>

          {/* Notifications */}

          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-700 transition sm:h-11 sm:w-11"
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
            aria-label="Notifications"
          >
            <Bell size={18} />

            <span
              className="absolute right-2 top-2 h-2 w-2 rounded-full"
              style={{
                backgroundColor: accentColor,
              }}
            />
          </button>

          {/* ADAPTIVE COMPANY LOGO */}

          {branding?.logo_url ? (

            <div
              className="flex h-10 max-w-[120px] items-center overflow-hidden rounded-xl border border-gray-200 bg-white px-2 shadow-sm sm:h-11 sm:max-w-[150px]"
              title={companyName}
            >
              <img
                src={branding.logo_url}
                alt={`${companyName} Logo`}
                className="block h-auto max-h-8 w-auto max-w-full object-contain sm:max-h-9"
              />
            </div>

          ) : (

            /* Fallback when no logo exists */

            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-semibold shadow-sm transition hover:scale-105 sm:h-11 sm:w-11"
              style={{
                backgroundColor: primaryColor,
                color: accentColor,
              }}
              title={companyName}
              aria-label={companyName}
            >
              {companyInitial}
            </div>

          )}

        </div>

      </div>

    </header>
  );
}