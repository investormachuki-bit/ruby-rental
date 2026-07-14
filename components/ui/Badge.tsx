import { ReactNode } from "react";

type BadgeVariant =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "secondary";

type BadgeProps = {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
};

export default function Badge({
  children,
  variant = "secondary",
  className = "",
}: BadgeProps) {
  const variants = {
    success:
      "bg-green-100 text-green-700",

    warning:
      "bg-amber-100 text-amber-700",

    danger:
      "bg-red-100 text-red-700",

    info:
      "bg-blue-100 text-blue-700",

    secondary:
      "bg-gray-100 text-gray-700",
  };

  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-full
        px-3
        py-1
        text-xs
        font-semibold
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
