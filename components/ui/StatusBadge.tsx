"use client";

import Badge from "./Badge";

type StatusBadgeProps = {
  status: string;

  className?: string;
};

export default function StatusBadge({
  status,
  className = "",
}: StatusBadgeProps) {

  const normalized =
    status.trim().toLowerCase();

  let variant:
    | "default"
    | "success"
    | "warning"
    | "danger" = "default";

  switch (normalized) {

    case "active":

    case "paid":

    case "completed":

    case "occupied":

    case "enabled":

      variant = "success";
      break;

    case "pending":

    case "draft":

    case "scheduled":

    case "vacant":

      variant = "warning";
      break;

    case "overdue":

    case "failed":

    case "cancelled":

    case "inactive":

    case "disabled":

      variant = "danger";
      break;

    default:

      variant = "default";

  }

  return (

    <Badge
      variant={variant}
      className={className}
    >

      {status}

    </Badge>

  );

}
