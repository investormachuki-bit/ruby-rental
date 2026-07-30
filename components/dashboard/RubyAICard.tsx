"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Brain,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Activity,
  AlertTriangle,
  TrendingUp,
  Building2,
  Home,
  DollarSign,
  Bell,
  Clock3,
} from "lucide-react";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Loading from "@/components/ui/Loading";

import {
  RubyAIService,
  RubyAISummary,
} from "@/lib/ai/ruby-ai-service";

import {
  getCurrentWorkspace,
} from "@/services/workspaces/getCurrentWorkspace";

/* ============================================================
   RUBY AI CARD
============================================================ */

export default function RubyAICard() {

  const [loading, setLoading] =
    useState(true);

  const [analysis, setAnalysis] =
    useState<RubyAISummary | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  const [lastUpdated, setLastUpdated] =
    useState<Date | null>(null);

  useEffect(() => {

    loadAnalysis();

  }, []);

  async function loadAnalysis() {

    try {

      setLoading(true);

      setError(null);

      const workspace =
        await getCurrentWorkspace();

      const result =
        await RubyAIService.generateSummary(
          workspace.id
        );

      setAnalysis(result);

      setLastUpdated(new Date());

    } catch (err) {

      console.error(err);

      setError(
        "Unable to analyse your portfolio."
      );

    } finally {

      setLoading(false);

    }

  }

  const scoreColor = useMemo(() => {

    if (!analysis)
      return "text-gray-900";

    if (analysis.healthScore >= 90)
      return "text-green-600";

    if (analysis.healthScore >= 75)
      return "text-blue-600";

    if (analysis.healthScore >= 60)
      return "text-amber-600";

    return "text-red-600";

  }, [analysis]);

  const todayFocus = useMemo(() => {

    if (!analysis)
      return "";

    if (
      analysis.dashboard.collection_rate < 80
    ) {

      return `Collection rate is ${analysis.dashboard.collection_rate}% with KES ${analysis.dashboard.outstanding_rent.toLocaleString()} outstanding.`;

    }

    if (
      analysis.dashboard.overdue_invoices > 0
    ) {

      return `${analysis.dashboard.overdue_invoices} overdue invoice(s) require immediate follow-up.`;

    }

    if (
      analysis.dashboard.pending_maintenance > 0
    ) {

      return `${analysis.dashboard.pending_maintenance} maintenance request(s) require attention.`;

    }

    if (
      analysis.dashboard.pending_notifications > 0
    ) {

      return `${analysis.dashboard.pending_notifications} notification(s) are waiting to be processed.`;

    }

    return "Everything is operating normally today.";

  }, [analysis]);

  const executiveBrief = useMemo(() => {

    if (!analysis)
      return "";

    return `${analysis.workspaceName} currently manages ${analysis.dashboard.total_properties} propert${
      analysis.dashboard.total_properties === 1
        ? "y"
        : "ies"
    } containing ${analysis.dashboard.total_units} unit(s). Occupancy stands at ${analysis.dashboard.occupancy_rate}% while rent collection is ${analysis.dashboard.collection_rate}%.`;

  }, [analysis]);

  if (loading) {

    return (

      <Card>

        <Loading
          title="Ruby AI"
          description="Analysing your portfolio..."
        />

      </Card>

    );

  }

  if (error) {

    return (

      <Card className="border-red-200">

        <div className="p-8">

          <div className="flex items-center gap-3">

            <AlertTriangle className="h-8 w-8 text-red-500" />

            <div>

              <h2 className="font-semibold">

                Ruby AI

              </h2>

              <p className="text-sm text-gray-500">

                {error}

              </p>

            </div>

          </div>

          <div className="mt-6">

            <Button
              onClick={loadAnalysis}
            >

              Retry Analysis

            </Button>

          </div>

        </div>

      </Card>

    );

  }

  if (!analysis)
    return null;

  return (
        <Card className="overflow-hidden rounded-3xl border border-[#D4AF37]/25 bg-white shadow-xl">

      <div className="border-b border-[#D4AF37]/15 bg-gradient-to-r from-white via-[#FFFDF7] to-white px-8 py-8">

        <div className="flex flex-col gap-8 xl:flex-row xl:items-start xl:justify-between">

          {/* Left */}

          <div className="flex-1">

            <div className="flex items-center gap-4">

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#D4AF37]/10">

                <Brain className="h-8 w-8 text-[#D4AF37]" />

              </div>

              <div>

                <div className="flex items-center gap-3">

                  <h2 className="text-2xl font-bold text-gray-900">

                    Ruby AI

                  </h2>

                  <Sparkles className="h-5 w-5 text-[#D4AF37]" />

                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">

                    ● LIVE

                  </span>

                </div>

                <p className="mt-1 text-sm text-gray-500">

                  Your Property Intelligence Assistant

                </p>

              </div>

            </div>

            <div className="mt-8">

              <h1 className="text-3xl font-bold text-gray-900">

                {analysis.greeting},

                {" "}
                {analysis.workspaceName}

              </h1>

              <p className="mt-3 max-w-2xl text-gray-600">

                Here's what's happening across your portfolio today.

              </p>

            </div>

          </div>

          {/* Health */}

          <div className="w-full xl:w-[280px]">

            <div className="rounded-2xl border border-[#D4AF37]/20 bg-gray-50 p-6">

              <div className="flex justify-center">

                <ShieldCheck className="h-9 w-9 text-[#D4AF37]" />

              </div>

              <p className="mt-4 text-center text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">

                Portfolio Health

              </p>

              <h2 className={`mt-4 text-center text-6xl font-bold ${scoreColor}`}>

                {analysis.healthScore}

              </h2>

              <p className="mt-2 text-center font-semibold text-[#D4AF37]">

                {analysis.healthStatus}

              </p>

              <div className="mt-6">

                <div className="h-2 overflow-hidden rounded-full bg-gray-200">

                  <div
                    className="h-full rounded-full bg-[#D4AF37] transition-all duration-700"
                    style={{
                      width: `${analysis.healthScore}%`,
                    }}
                  />

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      <div className="p-8">

        {/* Today's Focus */}

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">

          <div className="flex items-center gap-3">

            <TrendingUp className="h-6 w-6 text-amber-600" />

            <div>

              <h3 className="text-lg font-semibold text-gray-900">

                Today's Focus

              </h3>

              <p className="text-sm text-gray-500">

                Highest priority requiring your attention.

              </p>

            </div>

          </div>

          <p className="mt-5 text-lg leading-8 text-gray-800">

            {todayFocus}

          </p>

        </div>

        {/* Executive Brief */}

        <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-6">

          <div className="flex items-center gap-3">

            <Brain className="h-5 w-5 text-[#D4AF37]" />

            <h3 className="text-lg font-semibold text-gray-900">

              Executive Brief

            </h3>

          </div>

          <p className="mt-5 leading-8 text-gray-700">

            {executiveBrief}

          </p>

        </div>

        {/* Dashboard Snapshot */}

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">

            <Building2 className="h-7 w-7 text-[#D4AF37]" />

            <p className="mt-4 text-sm text-gray-500">

              Properties

            </p>

            <h3 className="mt-2 text-3xl font-bold text-gray-900">

              {analysis.dashboard.total_properties}

            </h3>

          </div>

          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">

            <Home className="h-7 w-7 text-blue-600" />

            <p className="mt-4 text-sm text-gray-500">

              Units

            </p>

            <h3 className="mt-2 text-3xl font-bold text-gray-900">

              {analysis.dashboard.total_units}

            </h3>

          </div>

          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">

            <DollarSign className="h-7 w-7 text-green-600" />

            <p className="mt-4 text-sm text-gray-500">

              Outstanding Rent

            </p>

            <h3 className="mt-2 text-2xl font-bold text-gray-900">

              KES {analysis.dashboard.outstanding_rent.toLocaleString()}

            </h3>

          </div>

          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">

            <Bell className="h-7 w-7 text-amber-600" />

            <p className="mt-4 text-sm text-gray-500">

              Notifications

            </p>

            <h3 className="mt-2 text-3xl font-bold text-gray-900">

              {analysis.dashboard.pending_notifications}

            </h3>

          </div>

        </div>

        <div className="my-10 border-b border-gray-200" />
                {/* Executive Insights & System Health */}

        <div className="grid gap-8 xl:grid-cols-2">

          {/* Executive Insights */}

          <div>

            <div className="mb-5 flex items-center gap-3">

              <AlertTriangle className="h-5 w-5 text-[#D4AF37]" />

              <h3 className="text-lg font-semibold text-gray-900">

                Executive Insights

              </h3>

            </div>

            <div className="space-y-4">

              {analysis.priorityInsights.map((insight, index) => {

                const cardClass =
                  insight.priority >= 90
                    ? "border-red-200 bg-red-50"

                    : insight.priority >= 70
                    ? "border-amber-200 bg-amber-50"

                    : "border-green-200 bg-green-50";

                const badgeClass =
                  insight.priority >= 90
                    ? "bg-red-100 text-red-700"

                    : insight.priority >= 70
                    ? "bg-amber-100 text-amber-700"

                    : "bg-green-100 text-green-700";

                return (

                  <div
                    key={index}
                    className={`rounded-2xl border p-5 ${cardClass}`}
                  >

                    <div className="flex items-start justify-between gap-4">

                      <div className="flex gap-3">

                        <div className="mt-2 h-2 w-2 rounded-full bg-[#D4AF37]" />

                        <div>

                          <p className="text-xs font-semibold uppercase tracking-widest text-[#D4AF37]">

                            {insight.category}

                          </p>

                          <p className="mt-2 leading-7 text-gray-800">

                            {insight.message}

                          </p>

                        </div>

                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}
                      >

                        P{insight.priority}

                      </span>

                    </div>

                  </div>

                );

              })}

            </div>

          </div>

          {/* System Health */}

          <div>

            <div className="mb-5 flex items-center gap-3">

              <Activity className="h-5 w-5 text-green-600" />

              <h3 className="text-lg font-semibold text-gray-900">

                System Health

              </h3>

            </div>

            <div className="space-y-4">

              {analysis.systemHealth.map((item, index) => (

                <div
                  key={index}
                  className="rounded-2xl border border-gray-200 bg-gray-50 p-5"
                >

                  <div className="flex items-center gap-3">

                    <ShieldCheck className="h-5 w-5 text-green-600" />

                    <p className="leading-7 text-gray-700">

                      {item}

                    </p>

                  </div>

                </div>

              ))}

            </div>

          </div>

        </div>

        {/* Footer */}

        <div className="mt-10 border-t border-gray-200 pt-6">

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex items-center gap-3 text-sm text-gray-500">

              <Clock3 className="h-4 w-4" />

              <span>

                Last analysed{" "}

                {lastUpdated
                  ? lastUpdated.toLocaleString()
                  : "-"}

              </span>

            </div>

            <Button
              variant="primary"
              onClick={loadAnalysis}
            >

              <RefreshCw className="mr-2 h-4 w-4" />

              Refresh Analysis

            </Button>

          </div>

        </div>

      </div>

    </Card>

  );

}
