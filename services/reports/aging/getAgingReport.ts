import { getInvoices } from "@/services/invoices/getInvoices";

export type AgingBucket = {
  current: number;
  days30: number;
  days60: number;
  days90: number;
  over90: number;
};

export async function getAgingReport(): Promise<AgingBucket> {
  const invoices = await getInvoices();

  const today = new Date();

  const aging: AgingBucket = {
    current: 0,
    days30: 0,
    days60: 0,
    days90: 0,
    over90: 0,
  };

  for (const invoice of invoices) {
    const balance = Number(invoice.balance ?? 0);

    if (balance <= 0) continue;

    const due = new Date(invoice.due_date);

    const days =
      Math.floor(
        (today.getTime() - due.getTime()) /
        (1000 * 60 * 60 * 24)
      );

    if (days <= 0) {
      aging.current += balance;
    } else if (days <= 30) {
      aging.days30 += balance;
    } else if (days <= 60) {
      aging.days60 += balance;
    } else if (days <= 90) {
      aging.days90 += balance;
    } else {
      aging.over90 += balance;
    }
  }

  return aging;
}
