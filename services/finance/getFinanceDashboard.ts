import { getInvoices } from "@/services/invoices/getInvoices";
import { getAllPayments } from "@/services/payments/getAll";

export type FinanceDashboardData = {
  revenueThisMonth: number;
  collectionsToday: number;
  outstandingRent: number;
  expectedIncome: number;
  collectionRate: number;
  overdueInvoices: number;
  overdueAmount: number;

  recentPayments: any[];
  outstandingInvoices: any[];

  revenueTrend: {
    month: string;
    revenue: number;
  }[];
};

function sameMonth(dateValue: string, year: number, month: number) {
  const date = new Date(dateValue);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month
  );
}

function sameDate(dateValue: string, target: Date) {
  const date = new Date(dateValue);

  return (
    date.getFullYear() === target.getFullYear() &&
    date.getMonth() === target.getMonth() &&
    date.getDate() === target.getDate()
  );
}

export async function getFinanceDashboard(): Promise<FinanceDashboardData> {
  const [invoices, payments] = await Promise.all([
    getInvoices(),
    getAllPayments(),
  ]);

  const now = new Date();

  /*
  ------------------------------------------------------------
  REAL CASH RECEIVED
  ------------------------------------------------------------
  Derived directly from actual payment records.
  ------------------------------------------------------------
  */

  const revenueThisMonth = payments
    .filter((payment) =>
      payment.payment_date &&
      sameMonth(
        payment.payment_date,
        now.getFullYear(),
        now.getMonth()
      )
    )
    .reduce(
      (sum, payment) =>
        sum + Number(payment.amount ?? 0),
      0
    );

  const collectionsToday = payments
    .filter(
      (payment) =>
        payment.payment_date &&
        sameDate(payment.payment_date, now)
    )
    .reduce(
      (sum, payment) =>
        sum + Number(payment.amount ?? 0),
      0
    );

  /*
  ------------------------------------------------------------
  OUTSTANDING
  ------------------------------------------------------------
  ------------------------------------------------------------
  */

  const outstandingInvoices = invoices
    .filter(
      (invoice) =>
        Number(invoice.balance ?? 0) > 0
    )
    .sort(
      (a, b) =>
        new Date(a.due_date ?? "").getTime() -
        new Date(b.due_date ?? "").getTime()
    );

  const outstandingRent = outstandingInvoices.reduce(
    (sum, invoice) =>
      sum + Number(invoice.balance ?? 0),
    0
  );

  /*
  ------------------------------------------------------------
  OVERDUE
  ------------------------------------------------------------
  Use the actual due date rather than trusting a possibly stale
  invoice status.
  ------------------------------------------------------------
  */

  const overdue = outstandingInvoices.filter(
    (invoice) => {
      if (!invoice.due_date) return false;

      const dueDate = new Date(invoice.due_date);

      return dueDate < now;
    }
  );

  const overdueAmount = overdue.reduce(
    (sum, invoice) =>
      sum + Number(invoice.balance ?? 0),
    0
  );

  /*
  ------------------------------------------------------------
  CURRENT BILLING CYCLE
  ------------------------------------------------------------
  Use invoices due in the current month for collection rate.
  ------------------------------------------------------------
  */

  const currentMonthInvoices = invoices.filter(
    (invoice) =>
      invoice.due_date &&
      sameMonth(
        invoice.due_date,
        now.getFullYear(),
        now.getMonth()
      )
  );

  const expectedIncome = currentMonthInvoices.reduce(
    (sum, invoice) =>
      sum + Number(invoice.amount ?? 0),
    0
  );

  const currentMonthCollected = currentMonthInvoices.reduce(
    (sum, invoice) =>
      sum + Number(invoice.amount_paid ?? 0),
    0
  );

  const collectionRate =
    expectedIncome > 0
      ? Number(
          (
            (currentMonthCollected /
              expectedIncome) *
            100
          ).toFixed(1)
        )
      : 0;

  /*
  ------------------------------------------------------------
  REVENUE TREND
  ------------------------------------------------------------
  Last 12 months from actual payment records.
  ------------------------------------------------------------
  */

  const revenueMap = new Map<string, number>();

  for (let i = 11; i >= 0; i--) {
    const date = new Date(
      now.getFullYear(),
      now.getMonth() - i,
      1
    );

    const key = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;

    revenueMap.set(key, 0);
  }

  for (const payment of payments) {
    if (!payment.payment_date) continue;

    const date = new Date(payment.payment_date);

    const key = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;

    if (revenueMap.has(key)) {
      revenueMap.set(
        key,
        (revenueMap.get(key) ?? 0) +
          Number(payment.amount ?? 0)
      );
    }
  }

  const revenueTrend = Array.from(
    revenueMap.entries()
  ).map(([key, revenue]) => {
    const [year, month] = key.split("-");

    const date = new Date(
      Number(year),
      Number(month) - 1,
      1
    );

    return {
      month: date.toLocaleDateString(
        "en-US",
        { month: "short" }
      ),
      revenue,
    };
  });

  return {
    revenueThisMonth,

    collectionsToday,

    outstandingRent,

    expectedIncome,

    collectionRate,

    overdueInvoices: overdue.length,

    overdueAmount,

    recentPayments:
      payments.slice(0, 10),

    outstandingInvoices:
      outstandingInvoices.slice(0, 10),

    revenueTrend,
  };
}
