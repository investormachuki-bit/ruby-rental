"use client";

import { ReactNode } from "react";

type Props = {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  color?: "blue" | "green" | "orange" | "purple";
};

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  color = "blue",
}: Props) {
  const colors = {
    blue: {
      border: "border-blue-500",
      bg: "bg-blue-50",
      text: "text-blue-600",
    },
    green: {
      border: "border-green-500",
      bg: "bg-green-50",
      text: "text-green-600",
    },
    orange: {
      border: "border-orange-500",
      bg: "bg-orange-50",
      text: "text-orange-600",
    },
    purple: {
      border: "border-purple-500",
      bg: "bg-purple-50",
      text: "text-purple-600",
    },
  };

  const theme = colors[color];

  return (
    <div
      className={`rounded-2xl border-l-4 ${theme.border} bg-white p-5 shadow-sm transition hover:shadow-md`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {value}
          </h2>

          {subtitle && (
            <p className="mt-2 text-sm text-gray-400">
              {subtitle}
            </p>
          )}
        </div>

        <div
          className={`flex h-14 w-14 items-center justify-center rounded-xl ${theme.bg} ${theme.text}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
