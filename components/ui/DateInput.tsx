"use client";

import {
  InputHTMLAttributes,
} from "react";

type DateInputProps =
  InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    error?: string;
  };

export default function DateInput({
  label,
  error,
  className = "",
  ...props
}: DateInputProps) {
  return (
    <div className="space-y-2">

      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <input
        type="date"
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
      />

      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}

    </div>
  );
}
