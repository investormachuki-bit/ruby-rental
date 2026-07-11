"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type Props = {
  items: BreadcrumbItem[];
};

export default function Breadcrumb({
  items,
}: Props) {
  return (
    <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-500">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div
            key={index}
            className="flex items-center gap-2"
          >
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="transition hover:text-black"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={
                  isLast
                    ? "font-semibold text-black"
                    : ""
                }
              >
                {item.label}
              </span>
            )}

            {!isLast && (
              <ChevronRight
                size={16}
                className="text-gray-400"
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}
