import { buildStatement } from "./buildStatement";

export async function getPropertyStatement(
  leaseId: string,
  propertyName: string
) {
  return buildStatement(
    leaseId,
    "Property Statement",
    propertyName
  );
}
