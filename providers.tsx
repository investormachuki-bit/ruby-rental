"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { BrandingProvider } from "@/contexts/BrandingContext";

import BrandingMetadata from "@/components/layout/BrandingMetadata";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <BrandingProvider>

        <BrandingMetadata />

        {children}

      </BrandingProvider>
    </AuthProvider>
  );
}
