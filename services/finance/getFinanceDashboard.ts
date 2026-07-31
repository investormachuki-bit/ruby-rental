import { getPaymentDashboard } from "@/services/payments/getPaymentDashboard";
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
};

export async function getFinanceDashboard(): Promise<FinanceDashboardData> {
  const [
    paymentDashboard,
    invoices,
    payments,
  ] = await Promise.all([
    getPaymentDashboard(),
    getInvoices(),
    getAllPayments(),
  ]);

  const paymentSummary =
    Array.isArray(paymentDashboard) && paymentDashboard.length > 0
      ? paymentDashboard[0]
      : paymentDashboard ?? {};

  const outstandingInvoices = invoices
    .filter((invoice) => Number(invoice.balance) > 0)
    .sort(
      (a, b) =>
        new Date(a.due_date ?? "").getTime() -
        new Date(b.due_date ?? "").getTime()
    );

  const outstandingRent = outstandingInvoices.reduce(
    (sum, invoice) => sum + Number(invoice.balance ?? 0),
    0
  );

  const expectedIncome = invoices.reduce(
    (sum, invoice) => sum + Number(invoice.amount ?? 0),
    0
  );

  const overdueToday = new Date();

  const overdue = outstandingInvoices.filter((invoice) => {
    if (!invoice.due_date) return false;

    return new Date(invoice.due_date) < overdueToday;
  });

  const overdueAmount = overdue.reduce(
    (sum, invoice) => sum + Number(invoice.balance ?? 0),
    0
  );

  const collectionRate =
    expectedIncome > 0
      ? Number(
          (
            ((expectedIncome - outstandingRent) /
              expectedIncome) *
            100
          ).toFixed(1)
        )
      : 0;

  return {
    revenueThisMonth:
      Number(
        paymentSummary.revenue_this_month ??
          paymentSummary.total_collected ??
          0
      ),

    collectionsToday:
      Number(
        paymentSummary.collections_today ??
          paymentSummary.today_collections ??
          0
      ),

    outstandingRent,

    expectedIncome,

    collectionRate,

    overdueInvoices: overdue.length,

    overdueAmount,

    recentPayments: payments.slice(0, 10),

    outstandingInvoices:
      outstandingInvoices.slice(0, 10),
  };
}
