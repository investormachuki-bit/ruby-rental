"use client";

type Lease = {
  id: string;
  lease_number?: string;
  tenant?: {
    id?: string;
    full_name?: string;
    first_name?: string;
    last_name?: string;
  };
  property?: {
    id?: string;
    name?: string;
  };
  unit?: {
    id?: string;
    unit_number?: string;
  };
};

type Props = {
  leases: Lease[];
  value: string;
  onChange: (leaseId: string) => void;
  statementType?: string;
};

export default function StatementLeaseSelector({
  leases,
  value,
  onChange,
  statementType = "Tenant Statement",
}: Props) {
  const label =
    statementType === "Property Statement"
      ? "Select Property"
      : statementType === "Unit Statement"
        ? "Select Unit"
        : statementType === "Account Statement"
          ? "Select Account"
          : "Select Tenant";

  const uniqueProperties = Array.from(
    new Map(
      leases
        .filter((lease) => lease.property?.id)
        .map((lease) => [
          lease.property!.id!,
          lease.property!.name ?? "Unnamed Property",
        ])
    )
  );

  const uniqueUnits = Array.from(
    new Map(
      leases
        .filter((lease) => lease.unit?.id)
        .map((lease) => [
          lease.unit!.id!,
          `${lease.property?.name ?? "Property"} • Unit ${
            lease.unit?.unit_number ?? "-"
          }`,
        ])
    )
  );

  return (
    <select
      className="w-full rounded-lg border p-3"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">{label}</option>

      {statementType === "Tenant Statement" &&
        leases.map((lease) => {
          const tenant =
            lease.tenant?.full_name ||
            `${lease.tenant?.first_name ?? ""} ${
              lease.tenant?.last_name ?? ""
            }`.trim();

          return (
            <option key={lease.id} value={lease.id}>
              {tenant || "Unnamed Tenant"} •{" "}
              {lease.property?.name ?? "Property"} • Unit{" "}
              {lease.unit?.unit_number ?? "-"}
            </option>
          );
        })}

      {statementType === "Property Statement" &&
        uniqueProperties.map(([id, name]) => (
          <option key={id} value={id}>
            {name}
          </option>
        ))}

      {statementType === "Unit Statement" &&
        uniqueUnits.map(([id, name]) => (
          <option key={id} value={id}>
            {name}
          </option>
        ))}

      {statementType === "Account Statement" && (
        <option value="ACCOUNT">All Accounts</option>
      )}
    </select>
  );
}
