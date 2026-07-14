"use client";

import { ReactNode } from "react";
import { X } from "lucide-react";

type ModalProps = {
  open: boolean;
  title: string;
  description?: string;
  children: ReactNode;
  onClose: () => void;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
};

export default function Modal({
  open,
  title,
  description,
  children,
  onClose,
  footer,
  size = "md",
}: ModalProps) {
  if (!open) return null;

  const widths = {
    sm: "max-w-md",
    md: "max-w-xl",
    lg: "max-w-3xl",
    xl: "max-w-5xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

      <div
        className={`w-full ${widths[size]} overflow-hidden rounded-3xl bg-white shadow-xl`}
      >

        {/* Header */}

        <div className="flex items-start justify-between border-b border-gray-200 p-6">

          <div>

            <h2 className="text-2xl font-bold text-gray-900">
              {title}
            </h2>

            {description && (
              <p className="mt-2 text-gray-500">
                {description}
              </p>
            )}

          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 transition hover:bg-gray-100"
          >
            <X size={20} />
          </button>

        </div>

        {/* Body */}

        <div className="max-h-[70vh] overflow-y-auto p-6">

          {children}

        </div>

        {/* Footer */}

        {footer && (

          <div className="flex flex-wrap justify-end gap-3 border-t border-gray-200 p-6">

            {footer}

          </div>

        )}

      </div>

    </div>
  );
}
