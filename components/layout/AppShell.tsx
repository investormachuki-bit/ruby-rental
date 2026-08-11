"use client";

import { useState } from "react";

import Sidebar from "./sidebar/Sidebar";
import Topbar from "./Topbar";

import { useBranding } from "@/contexts/BrandingContext";

type AppShellProps = {
  children: React.ReactNode;
};

export default function AppShell({
  children,
}: AppShellProps) {
  const [
    sidebarOpen,
    setSidebarOpen,
  ] = useState(false);

  const {
    branding,
  } = useBranding();

  const whiteLabelEnabled =
    branding?.enable_white_label === true;

  const backgroundColor =
    whiteLabelEnabled &&
    branding?.secondary_color
      ? branding.secondary_color
      : "#F8FAFC";

  const textColor =
    whiteLabelEnabled &&
    branding?.primary_color
      ? branding.primary_color
      : "#111827";

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor,
        color: textColor,
      }}
    >
      {/* Mobile Overlay */}

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() =>
            setSidebarOpen(false)
          }
        />
      )}

      {/* Sidebar */}

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Content */}

      <div className="flex min-h-screen flex-col md:ml-64">

        <Topbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main
          className="flex-1 overflow-x-hidden"
          style={{
            backgroundColor,
          }}
        >
          <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>

      </div>

    </div>
  );
}