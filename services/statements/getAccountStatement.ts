import { buildStatement } from "./buildStatement";

export async function getAccountStatement(
  leaseId: string
) {
  return buildStatement(
    leaseId,
    "Account Statement",
    "ACCOUNT"
  );
}
