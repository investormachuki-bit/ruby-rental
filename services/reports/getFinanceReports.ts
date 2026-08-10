import { getFinanceDashboard } from "@/services/finance/getFinanceDashboard";
import { getAgingReport } from "./aging/getAgingReport";
import { getCashFlow } from "./cashflow/getCashFlow";
import { getPropertyRentRoll } from "./property/getPropertyRentRoll";
import { getRentRollReport } from "./rentRoll/getRentRollReport";
import { getPropertyPerformance } from "./property/getPropertyPerformance";

export async function getFinanceReports() {
  const [
    dashboard,
    aging,
    cashFlow,
    propertyPerformance,
  ] = await Promise.all([
    getFinanceDashboard(),
    getAgingReport(),
    getCashFlow(),
    getPropertyPerformance(),
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
    propertyPerformance,
  };
}
