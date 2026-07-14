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
        <p className="text-sm text-gray-500">
          Loading...
        </p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
        <h3 className="text-lg font-semibold text-gray-900">
          {emptyTitle}
        </h3>

        <p className="mt-2 text-sm text-gray-500">
          {emptyDescription}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="sticky top-0 bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`whitespace-nowrap border-b border-gray-200 px-5 py-4 text-left text-sm font-semibold text-gray-700 ${column.className ?? ""}`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((row, index) => (
              <tr
                key={index}
                className="transition hover:bg-emerald-50"
              >
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className={`whitespace-nowrap border-b border-gray-100 px-5 py-4 text-sm text-gray-700 ${column.className ?? ""}`}
                  >
                    {column.render
                      ? column.render(row)
                      : String(
                          row[
                            column.key as keyof T
                          ] ?? ""
                        )}
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
