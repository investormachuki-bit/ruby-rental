import { buildStatement } from "./buildStatement";

export async function getUnitStatement(
  unitId: string
) {
  return buildStatement({
    title: "Unit Statement",
    reference: unitId,
    openingBalance: 0,
    closingBalance: 0,
    transactions: [],
  });
}
