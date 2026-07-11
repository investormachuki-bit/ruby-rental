"use client";

type Props = {
  title: string;
  value: string | number;
  icon: string;
  color:
    | "blue"
    | "green"
    | "orange"
    | "purple";
};

export default function KpiCard({
  title,
  value,
  icon,
  color,
}: Props) {
  const colors = {
    blue: "border-blue-500 bg-blue-50",
    green: "border-green-500 bg-green-50",
    orange: "border-orange-500 bg-orange-50",
    purple: "border-purple-500 bg-purple-50",
  };

  return (
    <div
      className={`rounded-2xl border-l-4 ${colors[color]} bg-white p-5 shadow-sm transition hover:shadow-lg`}
    >
      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-gray-500">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {value}
          </h2>

        </div>

        <div className="text-4xl">
          {icon}
        </div>

      </div>
    </div>
  );
}
