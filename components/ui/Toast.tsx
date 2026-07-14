"use client";

import { CheckCircle, AlertCircle, Info, XCircle } from "lucide-react";

type ToastVariant =
  | "success"
  | "error"
  | "warning"
  | "info";

type ToastProps = {
  title: string;
  message?: string;
  variant?: ToastVariant;
};

export default function Toast({
  title,
  message,
  variant = "success",
}: ToastProps) {
  const styles = {
    success: {
      icon: CheckCircle,
      iconColor: "text-green-600",
      border: "border-green-200",
      bg: "bg-green-50",
    },
    error: {
      icon: XCircle,
      iconColor: "text-red-600",
      border: "border-red-200",
      bg: "bg-red-50",
    },
    warning: {
      icon: AlertCircle,
      iconColor: "text-amber-600",
      border: "border-amber-200",
      bg: "bg-amber-50",
    },
    info: {
      icon: Info,
      iconColor: "text-blue-600",
      border: "border-blue-200",
      bg: "bg-blue-50",
    },
  };

  const current = styles[variant];
  const Icon = current.icon;

  return (
    <div
      className={`flex items-start gap-4 rounded-2xl border p-4 shadow-md ${current.border} ${current.bg}`}
    >
      <Icon
        className={`mt-0.5 h-6 w-6 ${current.iconColor}`}
      />

      <div className="flex-1">

        <h4 className="font-semibold text-gray-900">
          {title}
        </h4>

        {message && (
          <p className="mt-1 text-sm text-gray-600">
            {message}
          </p>
        )}

      </div>
    </div>
  );
}
