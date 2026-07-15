"use client";

import Logo from "./Logo";
import SidebarNavigation from "./SidebarNavigation";

import { useEnabledFeatures } from "@/hooks/useEnabledFeatures";

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

  const {
    features,
    loading,
  } =
    useEnabledFeatures();

  return (
    <>

      {/* Desktop Sidebar */}

      <aside className="fixed left-0 top-0 hidden h-screen w-64 flex-col border-r border-[#232323] bg-[#0F0F10] md:flex">

        <div className="border-b border-[#232323] p-6">

          <Logo />

        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-5">

          {loading ? (

            <div className="px-4 py-3 text-sm text-gray-500">

              Loading...

            </div>

          ) : (

            <SidebarNavigation
              items={features}
            />

          )}

        </nav>

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

        <div className="border-b border-[#232323] p-6">

          <Logo />

        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-5">

          {loading ? (

            <div className="px-4 py-3 text-sm text-gray-500">

              Loading...

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

        <div className="border-t border-[#232323] p-5">

          <p className="text-center text-xs text-gray-600">

            Ruby Rental v1.0

          </p>

        </div>

      </aside>

    </>

  );

}
