"use client";

import { ReactNode } from "react";

type SettingsSectionProps = {

  title: string;

  description?: string;

  children: ReactNode;

  className?: string;

};

export default function SettingsSection({

  title,

  description,

  children,

  className = "",

}: SettingsSectionProps) {

  return (

    <section
      className={`space-y-6 ${className}`}
    >

      <div>

        <h2 className="text-2xl font-bold text-gray-900">

          {title}

        </h2>

        {description && (

          <p className="mt-2 text-gray-500">

            {description}

          </p>

        )}

      </div>

      {children}

    </section>

  );

}
