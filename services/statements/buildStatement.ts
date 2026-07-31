import { getLeaseLedger } from "@/services/leases/getLeaseLedger";

import type {
  Statement,
  StatementTransaction,
} from "./types";

export async function buildStatement(
  leaseId: string,
  title: string,
  reference: string
): Promise<Statement> {

  const ledger =
    await getLeaseLedger(leaseId);

  const transactions: StatementTransaction[] =
    ledger.map((entry) => ({
      id: entry.id,
      date: entry.date,
      type: entry.type,
      reference: entry.reference,
      description: entry.description,
      debit: entry.debit,
      credit: entry.credit,
      balance: entry.balance,
    }));

  return {

    title,

    reference,

    openingBalance: 0,

    closingBalance:
      transactions.length
        ? transactions[
            transactions.length - 1
          ].balance
        : 0,

    transactions,

  };

}
