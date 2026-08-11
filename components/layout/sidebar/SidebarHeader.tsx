"use client";

import { useBranding } from "@/contexts/BrandingContext";

export default function SidebarHeader() {
  const {
    branding,
    loading,
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

  const accentColor =
    whiteLabelEnabled &&
    branding?.accent_color
      ? branding.accent_color
      : "#D4AF37";

  const companyName =
    whiteLabelEnabled &&
    branding?.company_name
      ? branding.company_name
      : "Ruby Rental";

  const appName =
    whiteLabelEnabled &&
    branding?.app_name
      ? branding.app_name
      : "Property Management";

  const companyInitial =
    companyName
      .trim()
      .charAt(0)
      .toUpperCase() || "R";

  if (loading) {
    return (
      <div
        className="border-b p-6"
        style={{
          borderColor: secondaryColor,
        }}
      >
        <div
          className="h-14 w-full animate-pulse rounded-xl"
          style={{
            backgroundColor: loadingColor,
          }}
        />
      </div>
    );
  }

  return (
    <div
      className="border-b px-5 py-5 sm:px-6 sm:py-6"
      style={{
        borderColor: secondaryColor,
      }}
    >
      <div className="flex min-w-0 items-center gap-4">

        {/* Adaptive Company Logo */}

        {branding?.logo_url ? (
          <div
            className="flex h-14 max-w-[170px] shrink-0 items-center overflow-hidden rounded-xl bg-white px-2.5 py-1.5 shadow-sm"
            title={companyName}
          >
            <img
              src={branding.logo_url}
              alt={`${companyName} Logo`}
              className="block h-auto max-h-11 w-auto max-w-[155px] object-contain"
            />
          </div>
        ) : (
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-2xl font-bold"
            style={{
              backgroundColor: accentColor,
              color: primaryColor,
            }}
          >
            {companyInitial}
          </div>
        )}

        {/* Company Information */}

        <div className="min-w-0 flex-1">

          <h2 className="truncate text-lg font-bold text-white">
            {companyName}
          </h2>

          <p
            className="mt-0.5 truncate text-sm"
            style={{
              color: accentColor,
            }}
          >
            {appName}
          </p>

        </div>

      </div>
    </div>
  );
}