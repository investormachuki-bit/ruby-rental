"use client";

import { useEffect, useState } from "react";

import Card from "@/components/ui/Card";
import Loading from "@/components/ui/Loading";

import {
  getCashFlow,
  CashFlowSummary,
} from "@/services/reports/cashflow/getCashFlow";

export default function CashFlowDashboard() {

  const [loading, setLoading] =
    useState(true);

  const [summary, setSummary] =
    useState<CashFlowSummary>();

  useEffect(() => {

    load();

  }, []);

  async function load() {

    try {

      setSummary(
        await getCashFlow()
      );

    } finally {

      setLoading(false);

    }

  }

  if (loading) {

    return <Loading />;

  }

  return (

    <div className="grid gap-6 md:grid-cols-3">

      <Card>

        <p className="text-sm text-gray-500">
          Total Income
        </p>

        <h2 className="mt-3 text-3xl font-bold">
          KES {summary?.totalIncome.toLocaleString()}
        </h2>

      </Card>

      <Card>

        <p className="text-sm text-gray-500">
          Total Expenses
        </p>

        <h2 className="mt-3 text-3xl font-bold">
          KES {summary?.totalExpenses.toLocaleString()}
        </h2>

      </Card>

      <Card>

        <p className="text-sm text-gray-500">
          Net Cash Flow
        </p>

        <h2 className="mt-3 text-3xl font-bold">
          KES {summary?.netCashFlow.toLocaleString()}
        </h2>

      </Card>

    </div>

  );

}
