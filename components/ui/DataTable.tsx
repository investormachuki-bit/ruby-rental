"use client";

import { ReactNode } from "react";

type Column<T> = {
  key: keyof T | string;
  header: string;
  className?: string;
  render?: (row: T) => ReactNode;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
};

export default function DataTable<T>({
  columns,
  data,
  loading = false,
  emptyTitle = "No records found",
  emptyDescription = "There is no data available.",
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
        <h3 className="text-lg font-semibold text-gray-900">{emptyTitle}</h3>
        <p className="mt-2 text-sm text-gray-500">{emptyDescription}</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="w-full overflow-hidden">
        <table className="w-full min-w-0 table-fixed">
          <thead className="sticky top-0 bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`border-b border-gray-200 px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 sm:px-4 sm:py-3.5 ${column.className ?? ""}`}
                >
                  <span className="block break-words">{column.header}</span>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((row, index) => (
              <tr
                key={index}
                className="transition hover:bg-gray-50"
              >
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className={`border-b border-gray-100 px-3 py-3 text-sm text-gray-700 sm:px-4 sm:py-4 ${column.className ?? ""}`}
                  >
                    <div className="min-w-0 break-words">
                      {column.render
                        ? column.render(row)
                        : String(row[column.key as keyof T] ?? "")}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
