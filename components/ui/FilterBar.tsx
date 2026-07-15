"use client";

import { ReactNode } from "react";

import SearchInput from "./SearchInput";

type FilterBarProps = {
  search: string;

  onSearchChange: (value: string) => void;

  searchPlaceholder?: string;

  filters?: ReactNode;

  actions?: ReactNode;

  className?: string;
};

export default function FilterBar({
  search,
  onSearchChange,
  searchPlaceholder = "Search...",
  filters,
  actions,
  className = "",
}: FilterBarProps) {
  return (
    <div
      className={`flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between ${className}`}
    >
      <div className="flex-1">
        <SearchInput
          value={search}
          onChange={onSearchChange}
          placeholder={searchPlaceholder}
        />
      </div>

      {(filters || actions) && (
        <div className="flex flex-wrap items-center gap-3">
          {filters}

          {actions}
        </div>
      )}
    </div>
  );
}
