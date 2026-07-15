"use client";

import { ReactNode } from "react";

type SettingItemProps = {

  title: string;

  description?: string;

  children?: ReactNode;

  action?: ReactNode;

  className?: string;

};

export default function SettingItem({

  title,

  description,

  children,

  action,

  className = "",

}: SettingItemProps) {

  return (

    <div
      className={`flex flex-col gap-5 rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-[#D4AF37] md:flex-row md:items-center md:justify-between ${className}`}
    >

      <div className="flex-1">

        <h3 className="text-lg font-semibold text-gray-900">

          {title}

        </h3>

        {description && (

          <p className="mt-2 text-sm text-gray-500">

            {description}

          </p>

        )}

        {children && (

          <div className="mt-4">

            {children}

          </div>

        )}

      </div>

      {action && (

        <div className="flex items-center">

          {action}

        </div>

      )}

    </div>

  );

}
