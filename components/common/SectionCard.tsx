"use client";

type Props = {
  title: string;
  description?: string;
  completed?: boolean;
  children: React.ReactNode;
};

export default function SectionCard({
  title,
  description,
  completed = false,
  children,
}: Props) {
  return (
    <div className="rounded-2xl border bg-white shadow-sm">

      <div className="flex items-start justify-between border-b p-6">

        <div>

          <h3 className="text-xl font-semibold">
            {title}
          </h3>

          {description && (
            <p className="mt-1 text-sm text-gray-500">
              {description}
            </p>
          )}

        </div>

        {completed && (
          <div className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
            ✓ Complete
          </div>
        )}

      </div>

      <div className="p-6">
        {children}
      </div>

    </div>
  );
}
