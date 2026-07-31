import { buildStatement } from "./buildStatement";

export async function getUnitStatement(
  leaseId: string,
  unitNumber: string
) {
  return buildStatement(
    leaseId,
    "Unit Statement",
    unitNumber
  );
}
