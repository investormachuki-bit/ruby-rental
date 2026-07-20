"use client";

import TenantCard from "./TenantCard";

type Tenant = {
  id: string;
  tenant_code: string;
  full_name: string;
  phone: string;
  property_name?: string | null;
  unit_number?: string | null;
  move_in_date?: string | null;
  status: string;
  monthly_rent?: number;
};

type Props = {
  tenants: Tenant[];
};

export default function TenantsList({
  tenants,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {tenants.map((tenant) => (
        <TenantCard
          key={tenant.id}
          tenant={tenant}
        />
      ))}
    </div>
  );
}
