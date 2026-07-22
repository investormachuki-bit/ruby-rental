"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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

  function isActive(route: string) {
    if (route === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(route);
  }

  function getLinkClass(route: string) {
    return `group flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-200 ${
      isActive(route)
        ? "bg-[#D4AF37] shadow-lg"
        : "hover:bg-white/5"
    }`;
  }

  return (
    <ul className="space-y-2">
      {items
        .filter((item) => item.sidebar)
        .map((item) => {
          const Icon = item.icon;

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
              >
                <Icon
                  size={20}
                  className={
                    isActive(item.route)
                      ? "text-[#0F0F10]"
                      : "text-white transition-colors duration-200 group-hover:text-[#D4AF37]"
                  }
                />

                <span
                  className={
                    isActive(item.route)
                      ? "font-semibold tracking-wide text-[#0F0F10]"
                      : "font-semibold tracking-wide text-white transition-colors duration-200 group-hover:text-[#D4AF37]"
                  }
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
