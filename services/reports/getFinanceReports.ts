import { getFinanceDashboard } from "@/services/finance/getFinanceDashboard";
import { getAgingReport } from "./aging/getAgingReport";
import { getCashFlow } from "./cashflow/getCashFlow";

export async function getFinanceReports() {
  const [
    dashboard,
    aging,
    cashFlow,
  ] = await Promise.all([
    getFinanceDashboard(),
    getAgingReport(),
    getCashFlow(),
  ]);

  return {
    revenue:
      dashboard.revenueThisMonth,

    outstanding:
      dashboard.outstandingRent,

    collections:
      dashboard.collectionsToday,

    collectionRate:
      dashboard.collectionRate,

    recentPayments:
      dashboard.recentPayments,

    outstandingInvoices:
      dashboard.outstandingInvoices,

    revenueTrend:
      dashboard.revenueTrend,

    aging,

    cashFlow,
  };
}
