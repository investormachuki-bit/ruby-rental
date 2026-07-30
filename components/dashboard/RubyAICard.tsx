"use client";

import { useEffect, useState } from "react";

import {
  Brain,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Activity,
  AlertTriangle,
} from "lucide-react";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Loading from "@/components/ui/Loading";

import {
  RubyAIService,
  RubyAISummary,
} from "@/lib/ai/ruby-ai-service";

import { getCurrentWorkspace } from "@/services/workspaces/getCurrentWorkspace";

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

    } catch (err) {

      console.error(err);

      setError(
        "Unable to generate Ruby AI analysis."
      );

    } finally {

      setLoading(false);

    }

  }

  if (loading) {

    return (

      <Card>

        <Loading
          title="Ruby AI"
          description="Analyzing your portfolio..."
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

              <h2 className="text-lg font-semibold">

                Ruby AI

              </h2>

              <p className="text-sm text-gray-500">

                {error}

              </p>

            </div>

          </div>

          <div className="mt-6">

            <Button
              variant="primary"
              onClick={loadAnalysis}
            >

              <RefreshCw className="mr-2 h-4 w-4" />

              Try Again

            </Button>

          </div>

        </div>

      </Card>

    );

  }

  if (!analysis) {

    return null;

  }

  const scoreColor =

    analysis.healthScore >= 90

      ? "text-green-500"

      : analysis.healthScore >= 75

      ? "text-blue-500"

      : analysis.healthScore >= 60

      ? "text-yellow-500"

      : "text-red-500";
    return (

    <Card className="overflow-hidden border border-[#D4AF37]/20 bg-gradient-to-br from-neutral-950 via-black to-neutral-900 text-white">

      <div className="p-8">

        {/* Header */}

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">

          <div>

            <div className="flex items-center gap-4">

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#D4AF37]/20">

                <Brain className="h-9 w-9 text-[#D4AF37]" />

              </div>

              <div>

                <div className="flex items-center gap-2">

                  <h2 className="text-2xl font-bold">

                    Ruby AI

                  </h2>

                  <Sparkles className="h-5 w-5 text-[#D4AF37]" />

                </div>

                <p className="mt-1 text-sm text-neutral-400">

                  Executive Portfolio Intelligence

                </p>

              </div>

            </div>

            <div className="mt-8">

              <h1 className="text-3xl font-bold">

                {analysis.greeting}

              </h1>

              <p className="mt-2 text-xl font-medium text-[#D4AF37]">

                {analysis.workspaceName}

              </p>

            </div>

          </div>

          <div className="min-w-[220px] rounded-2xl border border-[#D4AF37]/20 bg-white/5 p-6 backdrop-blur">

            <div className="flex items-center justify-center">

              <ShieldCheck className="h-9 w-9 text-[#D4AF37]" />

            </div>

            <p className="mt-4 text-center text-xs uppercase tracking-[0.2em] text-neutral-400">

              Portfolio Health

            </p>

            <div className="mt-3 text-center">

              <h2 className={`text-6xl font-bold ${scoreColor}`}>

                {analysis.healthScore}

              </h2>

              <p className="mt-2 text-lg font-semibold text-[#D4AF37]">

                {analysis.healthStatus}

              </p>

            </div>

          </div>

        </div>

        {/* Dashboard Snapshot */}

        <div className="mt-10 grid gap-4 md:grid-cols-4">

          <div className="rounded-xl bg-white/5 p-5">

            <p className="text-xs uppercase tracking-widest text-neutral-400">

              Properties

            </p>

            <h3 className="mt-2 text-3xl font-bold">

              {analysis.dashboard.total_properties}

            </h3>

          </div>

          <div className="rounded-xl bg-white/5 p-5">

            <p className="text-xs uppercase tracking-widest text-neutral-400">

              Units

            </p>

            <h3 className="mt-2 text-3xl font-bold">

              {analysis.dashboard.total_units}

            </h3>

          </div>

          <div className="rounded-xl bg-white/5 p-5">

            <p className="text-xs uppercase tracking-widest text-neutral-400">

              Occupancy

            </p>

            <h3 className="mt-2 text-3xl font-bold">

              {analysis.dashboard.occupancy_rate}%

            </h3>

          </div>

          <div className="rounded-xl bg-white/5 p-5">

            <p className="text-xs uppercase tracking-widest text-neutral-400">

              Collection

            </p>

            <h3 className="mt-2 text-3xl font-bold">

              {analysis.dashboard.collection_rate}%

            </h3>

          </div>

        </div>

        <div className="my-10 h-px bg-white/10" />
                {/* Executive Intelligence */}

        <div className="grid gap-8 lg:grid-cols-2">

          {/* Priority Insights */}

          <div>

            <div className="mb-5 flex items-center gap-2">

              <AlertTriangle className="h-5 w-5 text-[#D4AF37]" />

              <h3 className="text-lg font-semibold">

                Executive Insights

              </h3>

            </div>

            <div className="space-y-3">

              {analysis.priorityInsights.map((insight, index) => (

                <div
                  key={index}
                  className="rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-[#D4AF37]/40"
                >

                  <div className="flex items-start gap-3">

                    <div className="mt-2 h-2 w-2 rounded-full bg-[#D4AF37]" />

                    <div>

                      <p className="text-sm font-semibold text-[#D4AF37]">

                        {insight.category}

                      </p>

                      <p className="mt-1 text-sm leading-6 text-neutral-200">

                        {insight.message}

                      </p>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          </div>

          {/* System Health */}

          <div>

            <div className="mb-5 flex items-center gap-2">

              <Activity className="h-5 w-5 text-green-400" />

              <h3 className="text-lg font-semibold">

                System Health

              </h3>

            </div>

            <div className="space-y-3">

              {analysis.systemHealth.map((item, index) => (

                <div
                  key={index}
                  className="rounded-xl border border-white/10 bg-white/5 p-4"
                >

                  <div className="flex items-center gap-3">

                    <ShieldCheck className="h-4 w-4 text-green-400" />

                    <span className="text-sm text-neutral-200">

                      {item}

                    </span>

                  </div>

                </div>

              ))}

            </div>

          </div>

        </div>

        {/* Footer */}

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 md:flex-row md:items-center md:justify-between">

          <div>

            <p className="text-xs uppercase tracking-widest text-neutral-500">

              Last Analysis

            </p>

            <p className="mt-1 text-sm text-neutral-300">

              {new Date(
                analysis.generatedAt
              ).toLocaleString()}

            </p>

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

    </Card>

  );

}
