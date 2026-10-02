"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Bell,
  Building2,
  CheckCircle2,
  DollarSign,
  Home,
  Percent,
  RefreshCw,
  Sparkles,
  Users,
} from "lucide-react";

import AppShell from "@/components/layout/AppShell";
import PageContainer from "@/components/ui/PageContainer";
import Card from "@/components/ui/Card";
import Loading from "@/components/ui/Loading";
import Button from "@/components/ui/Button";
import { useBranding } from "@/contexts/BrandingContext";
import { RubyAIService, RubyAISummary } from "@/lib/ai/ruby-ai-service";

const GOLD = "#D4AF37";
const BLACK = "#08090D";

function money(value: number) {
  return `KSh ${Number(value || 0).toLocaleString("en-KE", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

export default function DashboardPage() {
  const { branding } = useBranding();
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<RubyAISummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  const whiteLabelEnabled = branding?.enable_white_label === true;
  const accentColor =
    whiteLabelEnabled && branding?.accent_color ? branding.accent_color : GOLD;
  const companyName =
    whiteLabelEnabled && branding?.company_name
      ? branding.company_name
      : "Ruby Rental";

  async function loadDashboard() {
    try {
      setLoading(true);
      setError(null);

      const workspace = await import("@/services/workspaces/getCurrentWorkspace").then(
        (module) => module.getCurrentWorkspace(),
      );
      const result = await RubyAIService.generateSummary(workspace.id);
      setAnalysis(result);
    } catch (err) {
      console.error(err);
      setError("Unable to load your dashboard right now.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const healthLabel = useMemo(
    () => analysis?.healthStatus || "Fair",
    [analysis],
  );

  if (loading) {
    return (
      <AppShell>
        <PageContainer>
          <Loading
            title="Loading Dashboard"
            description="Preparing your Normal Rental command centre..."
          />
        </PageContainer>
      </AppShell>
    );
  }

  if (error || !analysis) {
    return (
      <AppShell>
        <PageContainer>
          <Card className="rounded-[28px] border-red-200 bg-white p-8 shadow-[0_18px_50px_rgba(15,15,16,0.12)]">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Dashboard unavailable
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {error || "Please try again."}
                </p>
              </div>
            </div>
            <Button className="mt-6" onClick={loadDashboard}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </Card>
        </PageContainer>
      </AppShell>
    );
  }

  const d = analysis.dashboard;
  const topInsights = analysis.priorityInsights.slice(0, 3);
  const score = Math.max(0, Math.min(100, Number(analysis.healthScore || 0)));

  return (
    <AppShell>
      <PageContainer>
        {/* One unified opening: greeting + AI intelligence + health + focus */}
        <Card
          className="mb-7 overflow-hidden rounded-[30px] border-0 p-0 shadow-[0_24px_70px_rgba(8,9,13,0.18)]"
          style={{
            background: `linear-gradient(135deg, ${BLACK} 0%, #11131A 55%, #24200E 100%)`,
          }}
        >
          <div className="relative overflow-hidden">
            <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#D4AF37]/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-white/[0.035] blur-3xl" />

            <div className="relative grid lg:grid-cols-[1.45fr_0.85fr]">
              <div className="p-6 sm:p-8 lg:p-10">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3 py-1.5 text-xs font-semibold text-white/80 backdrop-blur-sm">
                    <Sparkles className="h-3.5 w-3.5" style={{ color: accentColor }} />
                    RUBY AI · LIVE
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/[0.045] px-3 py-1.5 text-xs font-medium text-slate-300">
                    Normal Rental
                  </span>
                </div>

                <p className="mt-7 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Owner command centre
                </p>
                <h1 className="mt-2 max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-[2.8rem]">
                  {analysis.greeting}, {analysis.workspaceName}.
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                  {analysis.summary?.[0] ||
                    "Your rental portfolio is ready. Here is what matters most today."}
                </p>

                <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <HeroStat label="Properties" value={d.total_properties} />
                  <HeroStat label="Units" value={d.total_units} />
                  <HeroStat label="Occupied" value={`${d.occupancy_rate}%`} />
                  <HeroStat
                    label="Overdue"
                    value={d.overdue_invoices}
                    warning={d.overdue_invoices > 0}
                  />
                </div>
              </div>

              <div className="border-t border-white/10 bg-white/[0.035] p-6 sm:p-8 lg:border-l lg:border-t-0 lg:p-10">
                <div className="flex h-full flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                        Portfolio intelligence
                      </p>
                      <Activity className="h-5 w-5" style={{ color: accentColor }} />
                    </div>

                    <div className="mt-3 flex items-end gap-3">
                      <span className="text-6xl font-semibold tracking-tight text-white">
                        {score}
                      </span>
                      <span className="mb-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">
                        {healthLabel}
                      </span>
                    </div>

                    <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${score}%`, backgroundColor: accentColor }}
                      />
                    </div>
                  </div>

                  <div className="mt-7 rounded-2xl border border-[#D4AF37]/20 bg-black/25 p-4 shadow-inner">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" style={{ color: accentColor }} />
                      <p
                        className="text-xs font-semibold uppercase tracking-[0.18em]"
                        style={{ color: accentColor }}
                      >
                        Today&apos;s focus
                      </p>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-200">
                      {d.overdue_invoices > 0
                        ? `${d.overdue_invoices} overdue invoice(s) require immediate follow-up.`
                        : analysis.summary?.[0] ||
                          "Everything is operating normally today."}
                    </p>
                  </div>

                  <Button
                    variant="primary"
                    onClick={loadDashboard}
                    className="mt-4 w-full rounded-xl bg-white text-slate-950 hover:bg-slate-100"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh intelligence
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Money: one row, no duplicate finance cards elsewhere */}
        <SectionHeading
          title="Money at a glance"
          subtitle="This month — billed, collected and still outstanding"
        />
        <div className="mb-7 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <MetricCard
            icon={<DollarSign />}
            label="Billed"
            value={money(d.expected_rent_this_month)}
            tone="gold"
          />
          <MetricCard
            icon={<CheckCircle2 />}
            label="Collected"
            value={money(d.collected_this_month)}
            tone="green"
          />
          <MetricCard
            icon={<AlertTriangle />}
            label="Outstanding"
            value={money(d.outstanding_rent)}
            tone="amber"
          />
          <MetricCard
            icon={<Percent />}
            label="Collection"
            value={`${d.collection_rate}%`}
            tone={d.collection_rate >= 90 ? "green" : "amber"}
          />
        </div>

        {/* Portfolio: one compact row only — no second portfolio section */}
        <SectionHeading
          title="Portfolio at a glance"
          subtitle="The operating numbers behind your Normal Rental business"
        />
        <div className="mb-7 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <MetricCard icon={<Building2 />} label="Properties" value={d.total_properties} />
          <MetricCard icon={<Home />} label="Units" value={d.total_units} />
          <MetricCard icon={<Users />} label="Tenants" value={d.active_leases} />
          <MetricCard
            icon={<Home />}
            label="Vacant"
            value={d.vacant_units}
            tone={d.vacant_units > 0 ? "amber" : "green"}
          />
        </div>

        {/* Decisions and actions: compact, practical, no repeated AI dashboard */}
        <div className="mb-7 grid gap-5 lg:grid-cols-[1.4fr_0.9fr]">
          <Card className="rounded-[26px] border-slate-200 bg-white p-5 shadow-[0_14px_40px_rgba(15,15,16,0.08)] sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-slate-950">
                  Priority signals
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Ruby AI surfaces only what needs action.
                </p>
              </div>
              <Bell className="h-5 w-5 text-slate-400" />
            </div>

            <div className="divide-y divide-slate-100">
              {topInsights.length > 0 ? (
                topInsights.map((insight, index) => (
                  <div
                    key={`${insight.category}-${index}`}
                    className="flex items-center gap-3 py-3.5 first:pt-1 last:pb-1"
                  >
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                        insight.priority >= 90
                          ? "bg-red-50 text-red-500"
                          : insight.priority >= 70
                            ? "bg-amber-50 text-amber-600"
                            : "bg-emerald-50 text-emerald-600"
                      }`}
                    >
                      {insight.priority >= 70 ? (
                        <AlertTriangle className="h-4 w-4" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                        {insight.category}
                      </p>
                      <p className="mt-0.5 text-sm leading-5 text-slate-700">
                        {insight.message}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-slate-300" />
                  </div>
                ))
              ) : (
                <div className="flex items-center gap-3 py-3 text-sm text-slate-600">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  Your portfolio is operating normally.
                </div>
              )}
            </div>
          </Card>

          <Card className="rounded-[26px] border-slate-200 bg-white p-5 shadow-[0_14px_40px_rgba(15,15,16,0.08)] sm:p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold tracking-tight text-slate-950">
                Quick actions
              </h2>
              <p className="mt-1 text-sm text-slate-500">Get straight to the work.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <QuickAction href="/properties" icon={<Building2 />} label="Property" />
              <QuickAction href="/units" icon={<Home />} label="Unit" />
              <QuickAction href="/occupants" icon={<Users />} label="Tenant" />
              <QuickAction href="/reports" icon={<Activity />} label="Report" />
            </div>
          </Card>
        </div>

        <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm sm:px-5">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Activity className="h-4 w-4 text-emerald-500" />
            <span>System healthy</span>
            {d.pending_maintenance > 0 && (
              <span>· {d.pending_maintenance} maintenance pending</span>
            )}
            {d.pending_notifications > 0 && (
              <span>· {d.pending_notifications} notification(s)</span>
            )}
          </div>
          <span className="text-xs text-slate-400">
            Updated {new Date(analysis.generatedAt).toLocaleString("en-KE")}
          </span>
        </div>

        <p className="pb-8 text-center text-xs text-slate-400">
          {companyName} · Ruby Rental · Normal Rental
        </p>
      </PageContainer>
    </AppShell>
  );
}

function SectionHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-3 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-slate-950">
          {title}
        </h2>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </div>
    </div>
  );
}

function HeroStat({
  label,
  value,
  warning = false,
}: {
  label: string;
  value: string | number;
  warning?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.055] px-3 py-3 shadow-inner backdrop-blur-sm">
      <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
        {label}
      </p>
      <p
        className={`mt-1 text-lg font-semibold ${
          warning ? "text-amber-300" : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  tone = "default",
}: {
  icon: ReactNode;
  label: string;
  value: string | number;
  tone?: "default" | "gold" | "green" | "amber";
}) {
  const iconClass =
    tone === "green"
      ? "bg-emerald-50 text-emerald-600"
      : tone === "amber"
        ? "bg-amber-50 text-amber-600"
        : tone === "gold"
          ? "bg-[#D4AF37]/10 text-[#B78E12]"
          : "bg-slate-100 text-slate-600";

  return (
    <div className="group min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_8px_24px_rgba(15,15,16,0.07)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(15,15,16,0.12)] sm:p-5">
      <div
        className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl ${iconClass}`}
      >
        <span className="[&>svg]:h-4 [&>svg]:w-4">{icon}</span>
      </div>
      <p className="truncate text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
        {label}
      </p>
      <p className="mt-1 truncate text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">
        {value}
      </p>
    </div>
  );
}

function QuickAction({
  href,
  icon,
  label,
}: {
  href: string;
  icon: ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="group flex min-h-[76px] items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 px-3 py-3 transition duration-200 hover:-translate-y-0.5 hover:border-[#D4AF37]/40 hover:bg-white hover:shadow-md"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-slate-700 shadow-sm ring-1 ring-slate-100 transition group-hover:text-[#B78E12]">
        <span className="[&>svg]:h-5 [&>svg]:w-5">{icon}</span>
      </div>
      <span className="text-sm font-medium text-slate-800">{label}</span>
      <ArrowRight className="ml-auto h-4 w-4 text-slate-300 transition group-hover:text-[#B78E12]" />
    </Link>
  );
}
