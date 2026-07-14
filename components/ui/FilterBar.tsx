"use client";

type Option = {
  label: string;
  value: string;
};

type Filter = {
  value: string;
  options: Option[];
  onChange: (value: string) => void;
};

type FilterBarProps = {
  filters: Filter[];
};

export default function FilterBar({
  filters,
}: FilterBarProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:flex lg:flex-wrap">
      {filters.map((filter, index) => (
        <select
          key={index}
          value={filter.value}
          onChange={(e) =>
            filter.onChange(e.target.value)
          }
          className="h-12 min-w-[180px] rounded-xl border border-gray-300 bg-white px-4 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
        >
          {filter.options.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>
      ))}
    </div>
  );
}
