import { supabase } from "@/lib/supabase";

export type LeaseLedgerEntry = {
  id: string;

  type: "Invoice" | "Payment";

  date: string;

  reference: string;

  description: string;

  debit: number;

  credit: number;

  balance: number;
};

export async function getLeaseLedger(
  leaseId: string
): Promise<LeaseLedgerEntry[]> {

  const [
    invoicesResult,
    paymentsResult,
  ] = await Promise.all([

    supabase
      .from("invoices")
      .select(`
        id,
        invoice_number,
        billing_period,
        due_date,
        amount,
        balance
      `)
      .eq("lease_id", leaseId),

    supabase
      .from("payments")
      .select(`
        id,
        receipt_number,
        payment_date,
        payment_type,
        amount
      `)
      .eq("lease_id", leaseId),

  ]);

  if (invoicesResult.error) {
    throw invoicesResult.error;
  }

  if (paymentsResult.error) {
    throw paymentsResult.error;
  }

  const ledger: LeaseLedgerEntry[] = [];

  (invoicesResult.data ?? []).forEach(
    (invoice) => {

      ledger.push({

        id: invoice.id,

        type: "Invoice",

        date: invoice.due_date,

        reference: invoice.invoice_number,

        description:
          invoice.billing_period,

        debit: Number(invoice.amount),

        credit: 0,

        balance: Number(invoice.balance),

      });

    }
  );

  (paymentsResult.data ?? []).forEach(
    (payment) => {

      ledger.push({

        id: payment.id,

        type: "Payment",

        date: payment.payment_date,

        reference: payment.receipt_number,

        description:
          payment.payment_type,

        debit: 0,

        credit: Number(payment.amount),

        balance: 0,

      });

    }
  );

  ledger.sort(
  (a, b) =>
    new Date(a.date).getTime() -
    new Date(b.date).getTime()
);

let runningBalance = 0;

const runningLedger = ledger.map((entry) => {

  if (entry.type === "Invoice") {
    runningBalance += entry.debit;
  } else {
    runningBalance -= entry.credit;
  }

  return {
    ...entry,
    balance: runningBalance,
  };

});

return runningLedger;

  }
