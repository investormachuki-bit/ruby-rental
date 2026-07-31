import { buildStatement } from "./buildStatement";

export async function getTenantStatement(
  tenantId: string
) {
  return buildStatement({
    title: "Tenant Statement",
    reference: tenantId,
    openingBalance: 0,
    closingBalance: 0,
    transactions: [],
  });
}
