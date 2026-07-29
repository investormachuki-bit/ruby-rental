"use client";

import { useEffect } from "react";

import { useBranding } from "@/contexts/BrandingContext";

export default function BrandingMetadata() {

  const {
    branding,
  } = useBranding();

  useEffect(() => {

    if (!branding) return;

    document.title =
      branding.browser_title ||
      branding.company_name ||
      "Ruby Rental";

    let favicon =
      document.querySelector(
        "link[rel='icon']"
      ) as HTMLLinkElement | null;

    if (!favicon) {

      favicon =
        document.createElement("link");

      favicon.rel = "icon";

      document.head.appendChild(favicon);

    }

    if (branding.favicon_url) {

      favicon.href =
        branding.favicon_url;

    }

    let themeColor =
      document.querySelector(
        "meta[name='theme-color']"
      ) as HTMLMetaElement | null;

    if (!themeColor) {

      themeColor =
        document.createElement("meta");

      themeColor.name =
        "theme-color";

      document.head.appendChild(
        themeColor
      );

    }

    themeColor.content =
      branding.primary_color;

  }, [branding]);

  return null;

}
