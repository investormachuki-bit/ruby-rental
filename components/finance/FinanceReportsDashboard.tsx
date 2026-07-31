"use client";

import { useEffect, useState } from "react";

import Card from "@/components/ui/Card";
import Loading from "@/components/ui/Loading";

import { getFinanceReports } from "@/services/reports/getFinanceReports";

export default function FinanceReportsDashboard() {

  const [loading, setLoading] = useState(true);

  const [data, setData] = useState<any>(null);

  useEffect(() => {
    loadReports();
  }, []);

  async function loadReports() {

    try {

      const result =
        await getFinanceReports();

      setData(result);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  }

  if (loading) {

    return (
      <Loading
        title="Loading finance reports..."
      />
    );

  }

  const reports = [

    {
      title: "Revenue This Month",
      value: `KES ${Number(data?.revenue ?? 0).toLocaleString()}`
    },

    {
      title: "Outstanding Rent",
      value: `KES ${Number(data?.outstanding ?? 0).toLocaleString()}`
    },

    {
      title: "Collections Today",
      value: `KES ${Number(data?.collections ?? 0).toLocaleString()}`
    },

    {
      title: "Collection Rate",
      value: `${data?.collectionRate ?? 0}%`
    },

    {
      title: "Recent Payments",
      value: data?.recentPayments?.length ?? 0
    },

    {
      title: "Outstanding Invoices",
      value: data?.outstandingInvoices?.length ?? 0
    }

  ];

  return (

    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

      {reports.map((report) => (

        <Card key={report.title}>

          <p className="text-sm text-gray-500">
            {report.title}
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            {report.value}
          </h2>

        </Card>

      ))}

    </div>

  );

}
