"use client";

import {
  SelectHTMLAttributes,
} from "react";

type SelectOption = {
  label: string;
  value: string;
};

type SelectProps =
  SelectHTMLAttributes<HTMLSelectElement> & {
    label?: string;
    error?: string;
    options: SelectOption[];
  };

export default function Select({
  label,
  error,
  options,
  className = "",
  ...props
}: SelectProps) {
  return (
    <div className="space-y-2">

      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <select
        {...props}
        className={`
          h-12
          w-full
          rounded-xl
          border
          border-gray-300
          bg-white
          px-4
          text-sm
          text-gray-900
          transition
          focus:border-[#D4AF37]
          focus:ring-2
          focus:ring-[#D4AF37]/20
          focus:outline-none
          disabled:bg-gray-100
          disabled:cursor-not-allowed
          ${className}
        `}
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}

    </div>
  );
}
