"use client";

type Lease = {
  id: string;
  lease_number?: string;
  tenant?: {
    full_name?: string;
    first_name?: string;
    last_name?: string;
  };
  property?: {
    name?: string;
  };
  unit?: {
    unit_number?: string;
  };
};

type Props = {
  leases: Lease[];
  value: string;
  onChange: (leaseId: string) => void;
  statementType: string;
};

export default function StatementLeaseSelector({
  leases,
  value,
  onChange,
  statementType,
}: Props) {
  const label =
    statementType === "Tenant Statement"
      ? "Select Tenant"
      : statementType === "Property Statement"
        ? "Select Property"
        : statementType === "Unit Statement"
          ? "Select Unit"
          : "Select Account";

  return (
    <select
      className="w-full rounded-lg border p-3"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">Select Lease</option>

      {leases.map((lease) => {
        const tenant =
          lease.tenant?.full_name ||
          `${lease.tenant?.first_name ?? ""} ${lease.tenant?.last_name ?? ""}`.trim();

        return (
          <option
            key={lease.id}
            value={lease.id}
          >
            {lease.lease_number} • {tenant} • {lease.property?.name} • Unit {lease.unit?.unit_number}
          </option>
        );
      })}
    </select>
  );
}
