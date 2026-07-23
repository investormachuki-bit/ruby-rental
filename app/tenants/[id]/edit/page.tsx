"use client";

import TenantEditPage
from "@/components/tenants/TenantEditPage";

export default function Page({
  params,
}: {
  params: {
    id: string;
  };
}) {
  return (
    <TenantEditPage
      tenantId={params.id}
    />
  );
}
