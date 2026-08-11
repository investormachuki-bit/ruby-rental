"use client";

import Image from "next/image";

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
          className="h-12 w-full animate-pulse rounded-xl"
          style={{
            backgroundColor: loadingColor,
          }}
        />
      </div>
    );
  }

  return (
    <div
      className="border-b p-6"
      style={{
        borderColor: secondaryColor,
      }}
    >
      <div className="flex items-center gap-4">

        {branding?.logo_url ? (
          <Image
            src={branding.logo_url}
            alt={`${companyName} Logo`}
            width={52}
            height={52}
            className="rounded-xl bg-white object-contain p-1"
          />
        ) : (
          <div
            className="flex h-12 w-12 items-center justify-center rounded-xl text-xl font-bold"
            style={{
              backgroundColor: accentColor,
              color: primaryColor,
            }}
          >
            {companyInitial}
          </div>
        )}

        <div>
          <h2 className="text-lg font-bold text-white">
            {companyName}
          </h2>

          <p
            className="text-sm"
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