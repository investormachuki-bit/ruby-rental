import { supabase } from "@/lib/supabase";

/* ============================================================
   RUBY AI SUMMARY
============================================================ */

export interface RubyAISummary {

  greeting: string;

  landlordName: string;

  generatedAt: string;

  totalProperties: number;

  totalUnits: number;

  occupiedUnits: number;

  vacantUnits: number;

  occupancyRate: number;

  activeLeases: number;

  outstandingRent: number;

  collectedThisMonth: number;

  invoicesDueToday: number;

  overdueInvoices: number;

  pendingMaintenance: number;

  pendingNotifications: number;

  expiringLeases: number;

  systemHealth: string[];

  summary: string[];

}

/* ============================================================
   PROPERTY SUMMARY
============================================================ */

interface PropertySummary {

  totalProperties: number;

  totalUnits: number;

  occupiedUnits: number;

  vacantUnits: number;

  occupancyRate: number;

}

/* ============================================================
   FINANCE SUMMARY
============================================================ */

interface FinanceSummary {

  outstandingRent: number;

  collectedThisMonth: number;

  invoicesDueToday: number;

  overdueInvoices: number;

}

/* ============================================================
   LEASE SUMMARY
============================================================ */

interface LeaseSummary {

  activeLeases: number;

  expiringLeases: number;

}

/* ============================================================
   MAINTENANCE SUMMARY
============================================================ */

interface MaintenanceSummary {

  pendingMaintenance: number;

}

/* ============================================================
   NOTIFICATION SUMMARY
============================================================ */

interface NotificationSummary {

  pendingNotifications: number;

}

/* ============================================================
   LANDLORD PROFILE
============================================================ */

interface LandlordProfile {

  landlordName: string;

}

/* ============================================================
   HELPERS
============================================================ */

function getGreeting(): string {

  const hour = new Date().getHours();

  if (hour < 12) {

    return "Good Morning";

  }

  if (hour < 17) {

    return "Good Afternoon";

  }

  return "Good Evening";

}

function calculateOccupancy(

  occupied: number,

  total: number

): number {

  if (total === 0) return 0;

  return Math.round((occupied / total) * 100);

}

function startOfMonth(): string {

  const now = new Date();

  return new Date(

    now.getFullYear(),

    now.getMonth(),

    1

  ).toISOString();

}

function todayISO(): string {

  return new Date()

    .toISOString()

    .split("T")[0];

}
/* ============================================================
   LANDLORD PROFILE
============================================================ */

async function getLandlordProfile(): Promise<LandlordProfile> {

  const { data: profile } = await supabase.auth.getUser();

  if (!profile.user) {

    return {

      landlordName: "Landlord"

    };

  }

  const { data } = await supabase

    .from("profiles")

    .select("full_name")

    .eq("id", profile.user.id)

    .single();

  return {

    landlordName: data?.full_name ?? "Landlord"

  };

}

/* ============================================================
   PROPERTY SUMMARY
============================================================ */

async function getPropertySummary(): Promise<PropertySummary> {

  const [{ count: properties }, { count: totalUnits }, { count: occupiedUnits }] =
    await Promise.all([

      supabase

        .from("properties")

        .select("*", { count: "exact", head: true }),

      supabase

        .from("units")

        .select("*", { count: "exact", head: true }),

      supabase

        .from("units")

        .select("*", { count: "exact", head: true })

        .eq("occupancy_status", "Occupied")

    ]);

  const total = totalUnits ?? 0;

  const occupied = occupiedUnits ?? 0;

  return {

    totalProperties: properties ?? 0,

    totalUnits: total,

    occupiedUnits: occupied,

    vacantUnits: total - occupied,

    occupancyRate: calculateOccupancy(

      occupied,

      total

    )

  };

}

/* ============================================================
   FINANCE SUMMARY
============================================================ */

async function getFinanceSummary(): Promise<FinanceSummary> {

  const monthStart = startOfMonth();

  const today = todayISO();

  const [

    outstanding,

    collected,

    dueToday,

    overdue

  ] = await Promise.all([

    supabase

      .from("invoices")

      .select("balance")

      .gt("balance", 0),

    supabase

      .from("payments")

      .select("amount")

      .gte("payment_date", monthStart),

    supabase

      .from("invoices")

      .select("*", {

        count: "exact",

        head: true

      })

      .eq("due_date", today)

      .gt("balance", 0),

    supabase

      .from("invoices")

      .select("*", {

        count: "exact",

        head: true

      })

      .eq("status", "Overdue")

  ]);

  const outstandingRent =

    (outstanding.data ?? [])

      .reduce(

        (sum, row) =>

          sum + Number(row.balance),

        0

      );

  const collectedThisMonth =

    (collected.data ?? [])

      .reduce(

        (sum, row) =>

          sum + Number(row.amount),

        0

      );

  return {

    outstandingRent,

    collectedThisMonth,

    invoicesDueToday: dueToday.count ?? 0,

    overdueInvoices: overdue.count ?? 0

  };

}

/* ============================================================
   LEASE SUMMARY
============================================================ */

async function getLeaseSummary(): Promise<LeaseSummary> {

  const today = new Date();

  const nextMonth = new Date();

  nextMonth.setMonth(

    nextMonth.getMonth() + 1

  );

  const [

    active,

    expiring

  ] = await Promise.all([

    supabase

      .from("leases")

      .select("*", {

        count: "exact",

        head: true

      })

      .eq("status", "Active"),

    supabase

      .from("leases")

      .select("*", {

        count: "exact",

        head: true

      })

      .gte(

        "end_date",

        today.toISOString()

      )

      .lte(

        "end_date",

        nextMonth.toISOString()

      )

  ]);

  return {

    activeLeases: active.count ?? 0,

    expiringLeases: expiring.count ?? 0

  };

}

/* ============================================================
   MAINTENANCE SUMMARY
============================================================ */

async function getMaintenanceSummary(): Promise<MaintenanceSummary> {

  const { count } = await supabase

    .from("maintenance_requests")

    .select("*", {

      count: "exact",

      head: true

    })

    .in(

      "status",

      [

        "Open",

        "Pending",

        "Assigned"

      ]

    );

  return {

    pendingMaintenance: count ?? 0

  };

}

/* ============================================================
   NOTIFICATION SUMMARY
============================================================ */

async function getNotificationSummary(): Promise<NotificationSummary> {

  const { count } = await supabase

    .from("notifications")

    .select("*", {

      count: "exact",

      head: true

    })

    .eq(

      "status",

      "Pending"

    );

  return {

    pendingNotifications: count ?? 0

  };

}
/* ============================================================
   BUILD AI SUMMARY
============================================================ */

function buildSummary(

  property: PropertySummary,

  finance: FinanceSummary,

  lease: LeaseSummary,

  maintenance: MaintenanceSummary,

  notifications: NotificationSummary

): string[] {

  const summary: string[] = [];

  summary.push(

    `You manage ${property.totalProperties} properties with ${property.totalUnits} rental units.`

  );

  summary.push(

    `${property.occupiedUnits} units are occupied while ${property.vacantUnits} are vacant (${property.occupancyRate}% occupancy).`

  );

  if (finance.invoicesDueToday > 0) {

    summary.push(

      `${finance.invoicesDueToday} invoice(s) are due today.`

    );

  }

  if (finance.overdueInvoices > 0) {

    summary.push(

      `${finance.overdueInvoices} overdue invoice(s) require attention.`

    );

  }

  summary.push(

    `Outstanding rent is KES ${finance.outstandingRent.toLocaleString()}.`

  );

  summary.push(

    `KES ${finance.collectedThisMonth.toLocaleString()} has been collected this month.`

  );

  if (lease.expiringLeases > 0) {

    summary.push(

      `${lease.expiringLeases} lease(s) expire within the next 30 days.`

    );

  }

  if (maintenance.pendingMaintenance > 0) {

    summary.push(

      `${maintenance.pendingMaintenance} maintenance request(s) are pending.`

    );

  }

  if (notifications.pendingNotifications > 0) {

    summary.push(

      `${notifications.pendingNotifications} notification(s) are waiting to be sent.`

    );

  }

  if (

    finance.overdueInvoices === 0 &&

    maintenance.pendingMaintenance === 0 &&

    notifications.pendingNotifications === 0

  ) {

    summary.push(

      "Everything looks good today."

    );

  }

  return summary;

}

/* ============================================================
   SYSTEM HEALTH
============================================================ */

function buildSystemHealth(

  notifications: NotificationSummary,

  maintenance: MaintenanceSummary,

  finance: FinanceSummary

): string[] {

  const health: string[] = [];

  health.push(

    "Billing automation is operational."

  );

  if (notifications.pendingNotifications > 0) {

    health.push(

      `${notifications.pendingNotifications} notification(s) are pending delivery.`

    );

  } else {

    health.push(

      "Notification queue is healthy."

    );

  }

  if (maintenance.pendingMaintenance > 0) {

    health.push(

      `${maintenance.pendingMaintenance} maintenance request(s) are awaiting action.`

    );

  }

  if (finance.overdueInvoices > 0) {

    health.push(

      `${finance.overdueInvoices} overdue invoice(s) remain unpaid.`

    );

  }

  return health;

}
/* ============================================================
   RUBY AI
============================================================ */

export async function generateRubySummary(): Promise<RubyAISummary> {

  try {

    const [

      landlord,

      property,

      finance,

      lease,

      maintenance,

      notifications

    ] = await Promise.all([

      getLandlordProfile(),

      getPropertySummary(),

      getFinanceSummary(),

      getLeaseSummary(),

      getMaintenanceSummary(),

      getNotificationSummary()

    ]);

    return {

      greeting: getGreeting(),

      landlordName: landlord.landlordName,

      generatedAt: new Date().toISOString(),

      totalProperties: property.totalProperties,

      totalUnits: property.totalUnits,

      occupiedUnits: property.occupiedUnits,

      vacantUnits: property.vacantUnits,

      occupancyRate: property.occupancyRate,

      activeLeases: lease.activeLeases,

      outstandingRent: finance.outstandingRent,

      collectedThisMonth: finance.collectedThisMonth,

      invoicesDueToday: finance.invoicesDueToday,

      overdueInvoices: finance.overdueInvoices,

      pendingMaintenance: maintenance.pendingMaintenance,

      pendingNotifications: notifications.pendingNotifications,

      expiringLeases: lease.expiringLeases,

      systemHealth: buildSystemHealth(

        notifications,

        maintenance,

        finance

      ),

      summary: buildSummary(

        property,

        finance,

        lease,

        maintenance,

        notifications

      )

    };

  } catch (error) {

    console.error(

      "Ruby AI Error:",

      error

    );

    return {

      greeting: getGreeting(),

      landlordName: "Landlord",

      generatedAt: new Date().toISOString(),

      totalProperties: 0,

      totalUnits: 0,

      occupiedUnits: 0,

      vacantUnits: 0,

      occupancyRate: 0,

      activeLeases: 0,

      outstandingRent: 0,

      collectedThisMonth: 0,

      invoicesDueToday: 0,

      overdueInvoices: 0,

      pendingMaintenance: 0,

      pendingNotifications: 0,

      expiringLeases: 0,

      systemHealth: [

        "Ruby AI could not retrieve dashboard information."

      ],

      summary: [

        "An unexpected error occurred while preparing today's summary."

      ]

    };

  }

}
