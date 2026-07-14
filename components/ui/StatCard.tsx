import { ReactNode } from "react";

type StatCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  valueClassName?: string;
};

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  valueClassName = "",
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md">

      <div className="flex items-start justify-between">

        <div className="min-w-0 flex-1">

          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <h2
            className={`mt-2 text-3xl font-bold text-gray-900 ${valueClassName}`}
          >
            {value}
          </h2>

          {subtitle && (
            <p className="mt-2 text-sm text-gray-500">
              {subtitle}
            </p>
          )}

        </div>

        {icon && (
          <div className="ml-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
            {icon}
          </div>
        )}

      </div>

    </div>
  );
}
