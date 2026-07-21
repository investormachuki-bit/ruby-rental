"use client";

import clsx from "clsx";

type Props = {
  status: string;
};

const statusStyles: Record<
  string,
  string
> = {
  Draft:
    "bg-gray-100 text-gray-700 border-gray-200",

  Unpaid:
    "bg-amber-100 text-amber-800 border-amber-200",

  "Partially Paid":
    "bg-blue-100 text-blue-800 border-blue-200",

  Paid:
    "bg-green-100 text-green-800 border-green-200",

  Overdue:
    "bg-red-100 text-red-800 border-red-200",

  Cancelled:
    "bg-gray-200 text-gray-700 border-gray-300",
};

export default function InvoiceStatusBadge({
  status,
}: Props) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold",
        statusStyles[status] ??
          "bg-gray-100 text-gray-700 border-gray-200"
      )}
    >
      {status}
    </span>
  );
}
