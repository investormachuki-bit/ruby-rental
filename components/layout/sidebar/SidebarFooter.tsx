"use client";

import { useBranding } from "@/contexts/BrandingContext";

export default function SidebarFooter() {
  const {
    branding,
  } = useBranding();

  const whiteLabelEnabled =
    branding?.enable_white_label === true;

  const secondaryColor =
    whiteLabelEnabled &&
    branding?.secondary_color
      ? branding.secondary_color
      : "#232323";

  const footerText =
    whiteLabelEnabled &&
    branding?.footer_text
      ? branding.footer_text
      : "Ruby Rental v1.0";

  const showRubyBranding =
    !whiteLabelEnabled ||
    branding?.remove_ruby_branding !== true;

  return (
    <div
      className="border-t p-5"
      style={{
        borderColor: secondaryColor,
      }}
    >
      {showRubyBranding ? (
        <p className="text-center text-xs text-gray-600">
          {footerText}
        </p>
      ) : (
        <p className="text-center text-xs text-gray-600">
          {footerText}
        </p>
      )}
    </div>
  );
}