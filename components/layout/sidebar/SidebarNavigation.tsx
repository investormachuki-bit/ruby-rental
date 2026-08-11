"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useBranding } from "@/contexts/BrandingContext";
import { Feature } from "@/lib/featureRegistry";

type Props = {
  items: Feature[];
  mobile?: boolean;
  onNavigate?: () => void;
};

export default function SidebarNavigation({
  items,
  mobile = false,
  onNavigate,
}: Props) {
  const pathname = usePathname();

  const {
    branding,
  } = useBranding();

  const whiteLabelEnabled =
    branding?.enable_white_label === true;

  const accentColor =
    whiteLabelEnabled &&
    branding?.accent_color
      ? branding.accent_color
      : "#D4AF37";

  const activeTextColor =
    whiteLabelEnabled &&
    branding?.primary_color
      ? branding.primary_color
      : "#0F0F10";

  function isActive(route: string) {
    if (route === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(route);
  }

  function getLinkClass(route: string) {
    return `group flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-200 ${
      isActive(route)
        ? "shadow-lg"
        : "hover:bg-white/5"
    }`;
  }

  return (
    <ul className="space-y-2">
      {items
        .filter((item) => item.sidebar)
        .map((item) => {
          const Icon = item.icon;
          const active = isActive(item.route);

          return (
            <li key={item.moduleKey}>
              <Link
                href={item.route}
                onClick={() => {
                  if (mobile && onNavigate) {
                    onNavigate();
                  }
                }}
                className={getLinkClass(item.route)}
                style={
                  active
                    ? {
                        backgroundColor:
                          accentColor,
                        boxShadow:
                          `0 10px 24px ${accentColor}33`,
                      }
                    : undefined
                }
              >
                <Icon
                  size={20}
                  className="transition-colors duration-200"
                  style={{
                    color: active
                      ? activeTextColor
                      : undefined,
                  }}
                  onMouseEnter={(event) => {
                    if (!active) {
                      event.currentTarget.style.color =
                        accentColor;
                    }
                  }}
                  onMouseLeave={(event) => {
                    if (!active) {
                      event.currentTarget.style.color =
                        "white";
                    }
                  }}
                />

                <span
                  className="font-semibold tracking-wide transition-colors duration-200"
                  style={{
                    color: active
                      ? activeTextColor
                      : "white",
                  }}
                  onMouseEnter={(event) => {
                    if (!active) {
                      event.currentTarget.style.color =
                        accentColor;
                    }
                  }}
                  onMouseLeave={(event) => {
                    if (!active) {
                      event.currentTarget.style.color =
                        "white";
                    }
                  }}
                >
                  {item.name}
                </span>
              </Link>
            </li>
          );
        })}
    </ul>
  );
}