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
   COMPONENT
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
        "Ruby AI could not analyse your portfolio."
      );

    } finally {

      setLoading(false);

    }

  }

  const scoreColor = useMemo(() => {

    if (!analysis)
      return "text-white";

    if (analysis.healthScore >= 90)
      return "text-green-400";

    if (analysis.healthScore >= 75)
      return "text-blue-400";

    if (analysis.healthScore >= 60)
      return "text-amber-400";

    return "text-red-400";

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

      return `${analysis.dashboard.overdue_invoices} overdue invoice(s) require follow-up.`;

    }

    if (
      analysis.dashboard.pending_maintenance > 0
    ) {

      return `${analysis.dashboard.pending_maintenance} maintenance request(s) need attention.`;

    }

    if (
      analysis.dashboard.pending_notifications > 0
    ) {

      return `${analysis.dashboard.pending_notifications} notification(s) are waiting to be sent.`;

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
    } with ${
      analysis.dashboard.total_units
    } unit(s). Occupancy stands at ${
      analysis.dashboard.occupancy_rate
    }% while rent collection is ${
      analysis.dashboard.collection_rate
    }%.`;

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

              Try Again

            </Button>

          </div>

        </div>

      </Card>

    );

  }

  if (!analysis)
    return null;

  return (

    <Card className="overflow-hidden border border-[#D4AF37]/20 bg-gradient-to-br from-[#161616] via-[#1C1C1C] to-[#101010] text-white">

      <div className="p-8">

        {/* Header */}

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">

          <div>

            <div className="flex items-center gap-4">

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#D4AF37]/15">

                <Brain className="h-8 w-8 text-[#D4AF37]" />

              </div>

              <div>

                <div className="flex items-center gap-2">

                  <h2 className="text-2xl font-bold">

                    Ruby AI

                  </h2>

                  <Sparkles className="h-5 w-5 text-[#D4AF37]" />

                  <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-semibold text-green-300">

                    LIVE

                  </span>

                </div>

                <p className="mt-2 text-sm text-neutral-400">

                  Your Property Intelligence Assistant

                </p>

              </div>

            </div>

            <div className="mt-8">

              <h1 className="text-3xl font-bold">

                {analysis.greeting},

                {" "}
                {analysis.workspaceName}

              </h1>

              <p className="mt-3 max-w-2xl text-neutral-300">

                Here's what's happening across your portfolio today.

              </p>

            </div>

          </div>
                   {/* Health Panel */}

          <div className="w-full lg:w-[320px]">

            <div className="rounded-3xl border border-[#D4AF37]/20 bg-white/5 p-6 backdrop-blur">

              <div className="flex items-center justify-center">

                <ShieldCheck className="h-9 w-9 text-[#D4AF37]" />

              </div>

              <p className="mt-4 text-center text-xs uppercase tracking-[0.25em] text-neutral-400">

                Portfolio Health

              </p>

              <div className="mt-5 text-center">

                <h2 className={`text-6xl font-bold ${scoreColor}`}>

                  {analysis.healthScore}

                </h2>

                <p className="mt-2 text-lg font-semibold text-[#D4AF37]">

                  {analysis.healthStatus}

                </p>

              </div>

              <div className="mt-6">

                <div className="h-2 overflow-hidden rounded-full bg-neutral-800">

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

        {/* Today's Focus */}

        <div className="mt-10 rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/10 p-6">

          <div className="flex items-center gap-3">

            <TrendingUp className="h-6 w-6 text-[#D4AF37]" />

            <div>

              <h3 className="text-lg font-semibold">

                Today's Focus

              </h3>

              <p className="text-sm text-neutral-400">

                Highest priority requiring your attention.

              </p>

            </div>

          </div>

          <p className="mt-5 text-lg leading-8 text-neutral-100">

            {todayFocus}

          </p>

        </div>

        {/* Executive Brief */}

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">

          <div className="flex items-center gap-3">

            <Brain className="h-5 w-5 text-[#D4AF37]" />

            <h3 className="text-lg font-semibold">

              Executive Brief

            </h3>

          </div>

          <p className="mt-5 leading-8 text-neutral-300">

            {executiveBrief}

          </p>

        </div>

        {/* Dashboard Snapshot */}

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">

            <div className="flex items-center justify-between">

              <Building2 className="h-6 w-6 text-[#D4AF37]" />

              <span className="text-xs uppercase tracking-widest text-neutral-500">

                Properties

              </span>

            </div>

            <h3 className="mt-5 text-3xl font-bold">

              {analysis.dashboard.total_properties}

            </h3>

          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">

            <div className="flex items-center justify-between">

              <Home className="h-6 w-6 text-sky-400" />

              <span className="text-xs uppercase tracking-widest text-neutral-500">

                Units

              </span>

            </div>

            <h3 className="mt-5 text-3xl font-bold">

              {analysis.dashboard.total_units}

            </h3>

          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">

            <div className="flex items-center justify-between">

              <DollarSign className="h-6 w-6 text-green-400" />

              <span className="text-xs uppercase tracking-widest text-neutral-500">

                Outstanding

              </span>

            </div>

            <h3 className="mt-5 text-2xl font-bold">

              KES{" "}

              {analysis.dashboard.outstanding_rent.toLocaleString()}

            </h3>

          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">

            <div className="flex items-center justify-between">

              <Bell className="h-6 w-6 text-amber-400" />

              <span className="text-xs uppercase tracking-widest text-neutral-500">

                Notifications

              </span>

            </div>

            <h3 className="mt-5 text-3xl font-bold">

              {analysis.dashboard.pending_notifications}

            </h3>

          </div>

        </div>

        <div className="my-10 h-px bg-white/10" /> 
                {/* Executive Insights & System Health */}

        <div className="grid gap-8 lg:grid-cols-2">

          {/* Executive Insights */}

          <div>

            <div className="mb-5 flex items-center gap-3">

              <AlertTriangle className="h-5 w-5 text-[#D4AF37]" />

              <h3 className="text-lg font-semibold">

                Executive Insights

              </h3>

            </div>

            <div className="space-y-4">

              {analysis.priorityInsights.map((insight, index) => {

                const color =

                  insight.priority >= 90
                    ? "border-red-500/20 bg-red-500/10"

                    : insight.priority >= 70
                    ? "border-amber-500/20 bg-amber-500/10"

                    : "border-green-500/20 bg-green-500/10";

                return (

                  <div
                    key={index}
                    className={`rounded-2xl border p-5 transition-all ${color}`}
                  >

                    <div className="flex items-start gap-3">

                      <div className="mt-2 h-2 w-2 rounded-full bg-[#D4AF37]" />

                      <div className="flex-1">

                        <div className="flex items-center justify-between">

                          <span className="text-xs font-semibold uppercase tracking-widest text-[#D4AF37]">

                            {insight.category}

                          </span>

                          <span className="rounded-full bg-black/20 px-2 py-1 text-[11px]">

                            P{insight.priority}

                          </span>

                        </div>

                        <p className="mt-2 leading-7 text-neutral-100">

                          {insight.message}

                        </p>

                      </div>

                    </div>

                  </div>

                );

              })}

            </div>

          </div>

          {/* System Health */}

          <div>

            <div className="mb-5 flex items-center gap-3">

              <Activity className="h-5 w-5 text-green-400" />

              <h3 className="text-lg font-semibold">

                System Health

              </h3>

            </div>

            <div className="space-y-4">

              {analysis.systemHealth.map((item, index) => (

                <div
                  key={index}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5"
                >

                  <div className="flex items-center gap-3">

                    <ShieldCheck className="h-5 w-5 text-green-400" />

                    <p className="leading-7 text-neutral-200">

                      {item}

                    </p>

                  </div>

                </div>

              ))}

            </div>

          </div>

        </div>

        {/* Footer */}

        <div className="mt-10 border-t border-white/10 pt-6">

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex items-center gap-3 text-sm text-neutral-400">

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
