import { buildStatement } from "./buildStatement";

export async function getAccountStatement() {
  return buildStatement({
    title: "Account Statement",
    reference: "ACCOUNT",
    openingBalance: 0,
    closingBalance: 0,
    transactions: [],
  });
}
