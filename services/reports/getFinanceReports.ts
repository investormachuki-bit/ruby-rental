import { getFinanceDashboard } from "@/services/finance/getFinanceDashboard";

export async function getFinanceReports() {
  const dashboard = await getFinanceDashboard();

  return {
    revenue: dashboard.revenueThisMonth,
    outstanding: dashboard.outstandingRent,
    collections: dashboard.collectionsToday,
    collectionRate: dashboard.collectionRate,
    recentPayments: dashboard.recentPayments,
    outstandingInvoices: dashboard.outstandingInvoices,
  };
}
