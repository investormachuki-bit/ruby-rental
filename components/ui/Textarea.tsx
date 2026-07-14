"use client";

import {
  TextareaHTMLAttributes,
} from "react";

type TextareaProps =
  TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label?: string;
    error?: string;
  };

export default function Textarea({
  label,
  error,
  className = "",
  ...props
}: TextareaProps) {
  return (
    <div className="space-y-2">

      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <textarea
        {...props}
        className={`
          min-h-32
          w-full
          rounded-xl
          border
          border-gray-300
          bg-white
          px-4
          py-3
          text-sm
          text-gray-900
          transition
          resize-y
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
