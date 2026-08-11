import { getFinanceDashboard } from "@/services/finance/getFinanceDashboard";
import { getAgingReport } from "./aging/getAgingReport";
import { getCashFlow } from "./cashflow/getCashFlow";
import { getRentRoll } from "./rentRoll/getRentRoll";
import { getPropertyPerformance } from "./property/getPropertyPerformance";
import { getOutstandingBalances } from "./outstanding/getOutstandingBalances";

export async function getFinanceReports() {
  const [
    dashboard,
    aging,
    cashFlow,
    rentRoll,
    propertyPerformance,
    outstandingBalances,
  ] = await Promise.all([
    getFinanceDashboard(),
    getAgingReport(),
    getCashFlow(),
    getRentRoll(),
    getPropertyPerformance(),
    getOutstandingBalances(),
  ]);

  return {
    revenue: dashboard.revenueThisMonth,

    outstanding: dashboard.outstandingRent,

    collections: dashboard.collectionsToday,

    collectionRate: dashboard.collectionRate,

    recentPayments: dashboard.recentPayments,

    outstandingInvoices: dashboard.outstandingInvoices,

    revenueTrend: dashboard.revenueTrend,

    aging,

    cashFlow,

    rentRoll,

    propertyPerformance,

    outstandingBalances,
  };
}
