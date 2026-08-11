"use client";

import SidebarHeader from "./SidebarHeader";
import SidebarFooter from "./SidebarFooter";
import SidebarNavigation from "./SidebarNavigation";

import { useEnabledFeatures } from "@/hooks/useEnabledFeatures";
import { useBranding } from "@/contexts/BrandingContext";

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

  const {
    branding,
  } = useBranding();

  const whiteLabelEnabled =
    branding?.enable_white_label === true;

  const primaryColor =
    whiteLabelEnabled &&
    branding?.primary_color
      ? branding.primary_color
      : "#0F0F10";

  const secondaryColor =
    whiteLabelEnabled &&
    branding?.secondary_color
      ? branding.secondary_color
      : "#232323";

  const loadingColor =
    whiteLabelEnabled &&
    branding?.secondary_color
      ? branding.secondary_color
      : "#1B1B1D";

  return (
    <>
      {/* Desktop Sidebar */}

      <aside
        className="fixed left-0 top-0 hidden h-screen w-64 flex-col border-r md:flex"
        style={{
          backgroundColor: primaryColor,
          borderColor: secondaryColor,
        }}
      >
        <SidebarHeader />

        <nav className="flex-1 overflow-y-auto px-4 py-5">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 8 }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="h-12 animate-pulse rounded-2xl"
                    style={{
                      backgroundColor:
                        loadingColor,
                    }}
                  />
                ),
              )}
            </div>
          ) : (
            <SidebarNavigation items={features} />
          )}
        </nav>

        <SidebarFooter />
      </aside>

      {/* Mobile Backdrop */}

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r shadow-2xl transition-transform duration-300 md:hidden ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
        style={{
          backgroundColor: primaryColor,
          borderColor: secondaryColor,
        }}
      >
        <SidebarHeader />

        <nav className="flex-1 overflow-y-auto px-4 py-5">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 8 }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="h-12 animate-pulse rounded-2xl"
                    style={{
                      backgroundColor:
                        loadingColor,
                    }}
                  />
                ),
              )}
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