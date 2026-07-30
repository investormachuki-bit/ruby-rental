import { supabase } from "@/lib/supabase";

/* ============================================================
   DASHBOARD SUMMARY
============================================================ */

interface DashboardSummary {

  workspace_name: string;

  total_properties: number;

  total_units: number;

  occupied_units: number;

  vacant_units: number;

  occupancy_rate: number;

  vacancy_rate: number;

  active_leases: number;

  outstanding_rent: number;

  expected_rent_this_month: number;

  collected_this_month: number;

  collection_rate: number;

  invoices_due_today: number;

  overdue_invoices: number;

  pending_maintenance: number;

  pending_notifications: number;

  expiring_leases: number;

}

/* ============================================================
   AI INSIGHT
============================================================ */

interface RubyInsight {

  priority: number;

  category:
    | "Finance"
    | "Occupancy"
    | "Maintenance"
    | "Notifications"
    | "Leases"
    | "Portfolio"
    | "Positive";

  message: string;

}

/* ============================================================
   RUBY AI RESPONSE
============================================================ */

export interface RubyAISummary {

  greeting: string;

  workspaceName: string;

  generatedAt: string;

  healthScore: number;

  healthStatus: string;

  dashboard: DashboardSummary;

  priorityInsights: RubyInsight[];

  summary: string[];

  systemHealth: string[];

}

/* ============================================================
   HELPERS
============================================================ */

function greeting(): string {

  const hour = new Date().getHours();

  if (hour < 12) return "Good Morning";

  if (hour < 17) return "Good Afternoon";

  return "Good Evening";

}

function money(value: number): string {

  return Number(value).toLocaleString(
    "en-KE",
    {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }
  );

}

/* ============================================================
   DASHBOARD RPC
============================================================ */

async function loadDashboard(

  workspaceId: string

): Promise<DashboardSummary> {

  const { data, error } = await supabase.rpc(

    "get_dashboard_summary",

    {

      p_workspace_id: workspaceId,

    }

  );

  if (error) {

    throw error;

  }

  if (!data || data.length === 0) {

    throw new Error(

      "Dashboard summary not found."

    );

  }

  return data[0] as DashboardSummary;

}
/* ============================================================
   HEALTH SCORE ENGINE
============================================================ */

function calculateHealthScore(

  dashboard: DashboardSummary

): number {

  let score = 100;

  /*
  ------------------------------------------------------------
  Occupancy
  ------------------------------------------------------------
  */

  if (dashboard.occupancy_rate < 90) score -= 5;

  if (dashboard.occupancy_rate < 80) score -= 10;

  if (dashboard.occupancy_rate < 70) score -= 15;

  if (dashboard.occupancy_rate < 50) score -= 20;

  /*
  ------------------------------------------------------------
  Collection
  ------------------------------------------------------------
  */

  if (dashboard.collection_rate < 90) score -= 5;

  if (dashboard.collection_rate < 80) score -= 10;

  if (dashboard.collection_rate < 70) score -= 15;

  if (dashboard.collection_rate < 50) score -= 20;

  /*
  ------------------------------------------------------------
  Overdue Invoices
  ------------------------------------------------------------
  */

  score -= dashboard.overdue_invoices * 3;

  /*
  ------------------------------------------------------------
  Maintenance
  ------------------------------------------------------------
  */

  score -= dashboard.pending_maintenance * 2;

  /*
  ------------------------------------------------------------
  Notifications
  ------------------------------------------------------------
  */

  if (dashboard.pending_notifications > 20)

    score -= 5;

  return Math.max(0, score);

}

/* ============================================================
   HEALTH STATUS
============================================================ */

function getHealthStatus(

  score: number

): string {

  if (score >= 90)

    return "Excellent";

  if (score >= 80)

    return "Very Good";

  if (score >= 70)

    return "Good";

  if (score >= 60)

    return "Fair";

  if (score >= 40)

    return "Needs Attention";

  return "Critical";

}

/* ============================================================
   PRIORITY ENGINE
============================================================ */

function buildPriorityInsights(

  dashboard: DashboardSummary

): RubyInsight[] {

  const insights: RubyInsight[] = [];

  /*
  ------------------------------------------------------------
  Finance
  ------------------------------------------------------------
  */

  if (dashboard.overdue_invoices > 0) {

    insights.push({

      priority: 100,

      category: "Finance",

      message:

        `${dashboard.overdue_invoices} overdue invoice(s) require follow-up.`

    });

  }

  if (dashboard.collection_rate < 80) {

    insights.push({

      priority: 95,

      category: "Finance",

      message:

        `Collection rate is ${dashboard.collection_rate}% with KES ${money(
          dashboard.outstanding_rent
        )} still outstanding.`

    });

  }

  /*
  ------------------------------------------------------------
  Occupancy
  ------------------------------------------------------------
  */

  if (dashboard.occupancy_rate < 80) {

    insights.push({

      priority: 90,

      category: "Occupancy",

      message:

        `${dashboard.vacant_units} unit(s) are vacant. Occupancy stands at ${dashboard.occupancy_rate}%.`

    });

  }

  /*
  ------------------------------------------------------------
  Lease Expiry
  ------------------------------------------------------------
  */

  if (dashboard.expiring_leases > 0) {

    insights.push({

      priority: 85,

      category: "Leases",

      message:

        `${dashboard.expiring_leases} lease(s) expire within the next 30 days.`

    });

  }

  /*
  ------------------------------------------------------------
  Maintenance
  ------------------------------------------------------------
  */

  if (dashboard.pending_maintenance > 0) {

    insights.push({

      priority: 80,

      category: "Maintenance",

      message:

        `${dashboard.pending_maintenance} maintenance request(s) are awaiting action.`

    });

  }

  /*
  ------------------------------------------------------------
  Notifications
  ------------------------------------------------------------
  */

  if (dashboard.pending_notifications > 0) {

    insights.push({

      priority: 50,

      category: "Notifications",

      message:

        `${dashboard.pending_notifications} notification(s) are waiting to be processed.`

    });

  }

  /*
  ------------------------------------------------------------
  Portfolio
  ------------------------------------------------------------
  */

  insights.push({

    priority: 10,

    category: "Portfolio",

    message:

      `${dashboard.total_properties} properties with ${dashboard.total_units} units are currently managed.`

  });

  /*
  ------------------------------------------------------------
  Positive Reinforcement
  ------------------------------------------------------------
  */

  if (insights.length === 1) {

    insights.push({

      priority: 5,

      category: "Positive",

      message:

        "Operations are running smoothly with no critical issues detected."

    });

  }

  insights.sort(

    (a, b) => b.priority - a.priority

  );

  return insights;

}
/* ============================================================
   RUBY AI SERVICE
============================================================ */

export class RubyAIService {

  static async generateSummary(

    workspaceId: string

  ): Promise<RubyAISummary> {

    const dashboard =

      await loadDashboard(

        workspaceId

      );

    const healthScore =

      calculateHealthScore(

        dashboard

      );

    const healthStatus =

      getHealthStatus(

        healthScore

      );

    const priorityInsights =

      buildPriorityInsights(

        dashboard

      );

    /*
    ------------------------------------------------------------
    Executive Summary
    ------------------------------------------------------------
    */

    const summary = priorityInsights.map(

      insight => insight.message

    );

    /*
    ------------------------------------------------------------
    System Health
    ------------------------------------------------------------
    */

    const systemHealth: string[] = [];

    if (dashboard.overdue_invoices === 0)

      systemHealth.push(

        "No overdue invoices."

      );

    else

      systemHealth.push(

        `${dashboard.overdue_invoices} overdue invoice(s).`

      );

    if (dashboard.pending_maintenance === 0)

      systemHealth.push(

        "No pending maintenance."

      );

    else

      systemHealth.push(

        `${dashboard.pending_maintenance} maintenance request(s) pending.`

      );

    if (dashboard.pending_notifications === 0)

      systemHealth.push(

        "Notification queue is clear."

      );

    else

      systemHealth.push(

        `${dashboard.pending_notifications} notification(s) waiting.`

      );

    /*
    ------------------------------------------------------------
    Return
    ------------------------------------------------------------
    */

    return {

      greeting:

        greeting(),

      workspaceName:

        dashboard.workspace_name,

      generatedAt:

        new Date().toISOString(),

      healthScore,

      healthStatus,

      dashboard,

      priorityInsights,

      summary,

      systemHealth,

    };

  }

}
