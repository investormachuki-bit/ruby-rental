"use client";

import SidebarHeader from "./SidebarHeader";
import SidebarFooter from "./SidebarFooter";
import SidebarNavigation from "./SidebarNavigation";

import { useEnabledFeatures } from "@/hooks/useEnabledFeatures";

type SidebarProps = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
};

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
}: SidebarProps) {

  const {
    features,
    loading,
  } = useEnabledFeatures();

  return (
    <>

      {/* Desktop Sidebar */}

      <aside className="fixed left-0 top-0 hidden h-screen w-64 flex-col border-r border-[#232323] bg-[#0F0F10] md:flex">

        <SidebarHeader />

        <nav className="flex-1 overflow-y-auto px-4 py-5">

          {loading ? (

            <div className="space-y-3">

              {Array.from({ length: 8 }).map((_, index) => (

                <div
                  key={index}
                  className="h-12 animate-pulse rounded-2xl bg-[#1B1B1D]"
                />

              ))}

            </div>

          ) : (

            <SidebarNavigation
              items={features}
            />

          )}

        </nav>

        <SidebarFooter />

      </aside>

      {/* Mobile Sidebar */}

      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-64 transform border-r border-[#232323] bg-[#0F0F10] shadow-2xl transition-transform duration-300 md:hidden ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >

        <SidebarHeader />

        <nav className="flex-1 overflow-y-auto px-4 py-5">

          {loading ? (

            <div className="space-y-3">

              {Array.from({ length: 8 }).map((_, index) => (

                <div
                  key={index}
                  className="h-12 animate-pulse rounded-2xl bg-[#1B1B1D]"
                />

              ))}

            </div>

          ) : (

            <SidebarNavigation
              items={features}
              mobile
              onNavigate={() =>
                setSidebarOpen(false)
              }
            />

          )}

        </nav>

        <SidebarFooter />

      </aside>

    </>
  );

}
