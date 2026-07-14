import { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  description?: string;
  children?: ReactNode;
};

export default function PageHeader({
  title,
  description,
  children,
}: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

      <div>

        <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
          {title}
        </h1>

        {description && (
          <p className="mt-2 text-base text-gray-500">
            {description}
          </p>
        )}

      </div>

      {children && (
        <div className="flex flex-wrap gap-3">
          {children}
        </div>
      )}

    </div>
  );
}
