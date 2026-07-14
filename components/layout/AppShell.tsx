"use client";

import { useState } from "react";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

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

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Mobile Overlay */}

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
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

      {/* Content */}

      <div className="flex min-h-screen flex-col md:ml-64">

        <Topbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="flex-1 bg-slate-50">

          <div className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">

            {children}

          </div>

        </main>

      </div>

    </div>
  );
}
