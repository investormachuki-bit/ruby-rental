"use client";

import { ReactNode } from "react";

type SectionProps = {
  title?: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
};

export default function Section({
  title,
  description,
  children,
  actions,
  className = "",
}: SectionProps) {
  return (
    <section className={`space-y-6 ${className}`}>

      {(title || actions) && (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div>

            {title && (
              <h2 className="text-xl font-bold text-gray-900">
                {title}
              </h2>
            )}

            {description && (
              <p className="mt-1 text-sm text-gray-500">
                {description}
              </p>
            )}

          </div>

          {actions && (
            <div className="flex flex-wrap gap-3">
              {actions}
            </div>
          )}

        </div>
      )}

      {children}

    </section>
  );
}
