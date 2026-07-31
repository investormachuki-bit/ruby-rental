import { buildStatement } from "./buildStatement";

export async function getPropertyStatement(
  propertyId: string
) {
  return buildStatement({
    title: "Property Statement",
    reference: propertyId,
    openingBalance: 0,
    closingBalance: 0,
    transactions: [],
  });
}
