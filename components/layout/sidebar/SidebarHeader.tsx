"use client";

import Image from "next/image";

import { useBranding } from "@/contexts/BrandingContext";

export default function SidebarHeader() {

  const {
    branding,
    loading,
  } = useBranding();

  if (loading) {

    return (
      <div className="border-b border-[#232323] p-6">
        <div className="h-12 w-full animate-pulse rounded-xl bg-[#1B1B1D]" />
      </div>
    );

  }

  return (

    <div className="border-b border-[#232323] p-6">

      <div className="flex items-center gap-4">

        {branding?.logo_url ? (

          <Image
            src={branding.logo_url}
            alt="Company Logo"
            width={52}
            height={52}
            className="rounded-xl bg-white object-contain p-1"
          />

        ) : (

          <div
            className="flex h-12 w-12 items-center justify-center rounded-xl text-xl font-bold"
            style={{
              backgroundColor:
                branding?.accent_color ?? "#D4AF37",
              color:
                branding?.primary_color ?? "#0F0F10",
            }}
          >
            {branding?.company_name?.charAt(0).toUpperCase() ?? "R"}
          </div>

        )}

        <div>

          <h2 className="text-lg font-bold text-white">
            {branding?.company_name ?? "Ruby Rental"}
          </h2>

          <p
            className="text-sm"
            style={{
              color:
                branding?.accent_color ?? "#D4AF37",
            }}
          >
            {branding?.app_name ?? "Property Management"}
          </p>

        </div>

      </div>

    </div>

  );

}
