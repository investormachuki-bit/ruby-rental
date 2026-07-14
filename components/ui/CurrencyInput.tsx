"use client";

import { InputHTMLAttributes } from "react";

type CurrencyInputProps =
  InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    error?: string;
  };

export default function CurrencyInput({
  label,
  error,
  className = "",
  ...props
}: CurrencyInputProps) {
  return (
    <div className="space-y-2">

      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div className="relative">

        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-500">
          KSh
        </span>

        <input
          type="number"
          step="0.01"
          min="0"
          {...props}
          className={`
            h-12
            w-full
            rounded-xl
            border
            border-gray-300
            bg-white
            pl-14
            pr-4
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

      </div>

      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}

    </div>
  );
}
