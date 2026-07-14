import { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: ReactNode;
};

export default function EmptyState({
  title,
  description,
  icon,
  action,
}: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">

      {icon && (
        <div className="mb-6 flex justify-center text-gray-400">
          {icon}
        </div>
      )}

      <h3 className="text-xl font-semibold text-gray-900">
        {title}
      </h3>

      <p className="mx-auto mt-3 max-w-md text-gray-500">
        {description}
      </p>

      {action && (
        <div className="mt-8 flex justify-center">
          {action}
        </div>
      )}

    </div>
  );
}
