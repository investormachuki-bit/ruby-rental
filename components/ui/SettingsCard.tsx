"use client";

import { ReactNode } from "react";

type SettingsCardProps = {

  title: string;

  description?: string;

  children: ReactNode;

  actions?: ReactNode;

  className?: string;

};

export default function SettingsCard({

  title,

  description,

  children,

  actions,

  className = "",

}: SettingsCardProps) {

  return (

    <div
      className={`rounded-2xl border border-gray-200 bg-white shadow-sm ${className}`}
    >

      <div className="border-b border-gray-100 p-6">

        <div className="flex items-start justify-between gap-4">

          <div>

            <h2 className="text-xl font-bold text-gray-900">

              {title}

            </h2>

            {description && (

              <p className="mt-2 text-sm text-gray-500">

                {description}

              </p>

            )}

          </div>

          {actions && (

            <div>

              {actions}

            </div>

          )}

        </div>

      </div>

      <div className="p-6">

        {children}

      </div>

    </div>

  );

}
