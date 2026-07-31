import { buildStatement } from "./buildStatement";

export async function getTenantStatement(
  leaseId: string,
  tenantName: string
) {

  return buildStatement(
    leaseId,
    "Tenant Statement",
    tenantName
  );

}
