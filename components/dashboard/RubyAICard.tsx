"use client";

import { useEffect, useState } from "react";

import {
  Brain,
  Activity,
  RefreshCw,
  Sparkles,
  ShieldCheck,
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

  useEffect(() => {

    loadAnalysis();

  }, []);

  async function loadAnalysis() {

    try {

      setLoading(true);

      const workspace =
        await getCurrentWorkspace();

      const data =
        await RubyAIService.generateSummary(
          workspace.id
        );

      setAnalysis(data);

    } catch (error) {

      console.error(error);

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

  if (!analysis) {

    return null;

  }

  const scoreColor =

    analysis.healthScore >= 90
      ? "text-green-600"

      : analysis.healthScore >= 75
      ? "text-blue-600"

      : analysis.healthScore >= 60
      ? "text-amber-600"

      : "text-red-600";
    return (

    <Card className="overflow-hidden border border-[#D4AF37]/20 bg-gradient-to-br from-black via-neutral-900 to-neutral-950 text-white">

      <div className="p-8">

        {/* Header */}

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

          <div>

            <div className="flex items-center gap-3">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D4AF37]/20">

                <Brain className="h-8 w-8 text-[#D4AF37]" />

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

              <p className="text-3xl font-semibold">

                {analysis.greeting}

              </p>

              <p className="mt-2 text-lg text-[#D4AF37]">

                {analysis.workspaceName}

              </p>

            </div>

          </div>

          <div className="rounded-2xl border border-[#D4AF37]/20 bg-white/5 p-6 text-center backdrop-blur">

            <div className="flex items-center justify-center">

              <ShieldCheck className="h-8 w-8 text-[#D4AF37]" />

            </div>

            <p className="mt-4 text-sm uppercase tracking-wider text-neutral-400">

              Portfolio Health

            </p>

            <h1 className={`mt-2 text-5xl font-bold ${scoreColor}`}>

              {analysis.healthScore}

            </h1>

            <p className="mt-2 text-base text-[#D4AF37]">

              {analysis.healthStatus}

            </p>

          </div>

        </div>

        {/* Divider */}

        <div className="my-8 h-px bg-white/10" />

        {/* Refresh */}

        <div className="flex justify-end">

          <Button

            variant="secondary"

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
        {/* Divider */}

        <div className="my-8 h-px bg-white/10" />

        {/* Executive Insights */}

        <div className="grid gap-8 lg:grid-cols-2">

          {/* Priority Insights */}

          <div>

            <div className="mb-4 flex items-center gap-2">

              <AlertTriangle className="h-5 w-5 text-[#D4AF37]" />

              <h3 className="text-lg font-semibold">

                Priority Insights

              </h3>

            </div>

            <div className="space-y-3">

              {analysis.summary.map((item, index) => (

                <div
                  key={index}
                  className="rounded-xl border border-white/10 bg-white/5 p-4"
                >

                  <div className="flex items-start gap-3">

                    <div className="mt-1 h-2 w-2 rounded-full bg-[#D4AF37]" />

                    <p className="text-sm leading-6 text-neutral-200">

                      {item}

                    </p>

                  </div>

                </div>

              ))}

            </div>

          </div>

          {/* System Health */}

          <div>

            <div className="mb-4 flex items-center gap-2">

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

                  <div className="flex items-start gap-3">

                    <ShieldCheck className="mt-0.5 h-4 w-4 text-green-400" />

                    <p className="text-sm leading-6 text-neutral-200">

                      {item}

                    </p>

                  </div>

                </div>

              ))}

            </div>

          </div>

        </div>

        {/* Footer */}

        <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-6 md:flex-row md:items-center md:justify-between">

          <p className="text-xs text-neutral-400">

            Last analysis:{" "}

            {new Date(
              analysis.generatedAt
            ).toLocaleString()}

          </p>

          <Button

            variant="secondary"

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
