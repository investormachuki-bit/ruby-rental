import {
  LayoutDashboard,
  Building2,
  Home,
  Users,
  FileText,
  CreditCard,
  Receipt,
  ReceiptText,
  Wrench,
  BarChart3,
  Settings,
  Shield,
  Repeat,
  LucideIcon,
} from "lucide-react";

export type FeatureCategory =
  | "Core"
  | "Operations"
  | "Finance"
  | "Reports"
  | "Administration";

export type Plan =
  | "starter"
  | "professional"
  | "enterprise";

export type Feature = {
  moduleKey: string;
  name: string;
  description: string;
  route: string;
  icon: LucideIcon;
  category: FeatureCategory;
  permission: string;
  minimumPlan: Plan;
  sidebar: boolean;
  searchable: boolean;
  aiEnabled: boolean;
  core: boolean;
};

export const FEATURE_REGISTRY: Feature[] = [
  {
    moduleKey: "dashboard",
    name: "Dashboard",
    description: "Workspace overview and analytics.",
    route: "/dashboard",
    icon: LayoutDashboard,
    category: "Core",
    permission: "dashboard.view",
    minimumPlan: "starter",
    sidebar: true,
    searchable: true,
    aiEnabled: true,
    core: true,
  },

  {
    moduleKey: "properties",
    name: "Properties",
    description: "Manage rental properties.",
    route: "/dashboard/properties",
    icon: Building2,
    category: "Core",
    permission: "properties.view",
    minimumPlan: "starter",
    sidebar: true,
    searchable: true,
    aiEnabled: true,
    core: true,
  },

  {
    moduleKey: "units",
    name: "Units",
    description: "Manage rental units.",
    route: "/dashboard/units",
    icon: Home,
    category: "Core",
    permission: "units.view",
    minimumPlan: "starter",
    sidebar: true,
    searchable: true,
    aiEnabled: true,
    core: true,
  },

  {
    moduleKey: "tenants",
    name: "Tenants",
    description: "Manage tenants.",
    route: "/dashboard/tenants",
    icon: Users,
    category: "Core",
    permission: "tenants.view",
    minimumPlan: "starter",
    sidebar: true,
    searchable: true,
    aiEnabled: true,
    core: true,
  },

  {
    moduleKey: "leases",
    name: "Leases",
    description: "Manage lease agreements.",
    route: "/dashboard/leases",
    icon: FileText,
    category: "Core",
    permission: "leases.view",
    minimumPlan: "starter",
    sidebar: true,
    searchable: true,
    aiEnabled: true,
    core: true,
  },

  /* ===========================
       FINANCE MODULE ENTRY
     =========================== */

  {
    moduleKey: "finance",
    name: "Finance",
    description: "Financial dashboard and accounting.",
    route: "/dashboard/finance",
    icon: BarChart3,
    category: "Finance",
    permission: "finance.view",
    minimumPlan: "starter",
    sidebar: true,
    searchable: true,
    aiEnabled: true,
    core: true,
  },

  /* ===========================
       FINANCE PAGES
       Hidden from main sidebar
     =========================== */

  {
    moduleKey: "recurringCharges",
    name: "Recurring Charges",
    description: "Manage recurring rent and utility charges.",
    route: "/dashboard/recurring-charges",
    icon: Repeat,
    category: "Finance",
    permission: "recurringCharges.view",
    minimumPlan: "starter",
    sidebar: false,
    searchable: true,
    aiEnabled: true,
    core: true,
  },

  {
    moduleKey: "invoices",
    name: "Invoices",
    description: "Generate and manage tenant invoices.",
    route: "/dashboard/invoices",
    icon: ReceiptText,
    category: "Finance",
    permission: "invoices.view",
    minimumPlan: "starter",
    sidebar: false,
    searchable: true,
    aiEnabled: true,
    core: true,
  },

  {
    moduleKey: "payments",
    name: "Payments",
    description: "Record and manage tenant payments.",
    route: "/dashboard/payments",
    icon: CreditCard,
    category: "Finance",
    permission: "payments.view",
    minimumPlan: "starter",
    sidebar: false,
    searchable: true,
    aiEnabled: true,
    core: true,
  },

  {
    moduleKey: "expenses",
    name: "Expenses",
    description: "Track operational expenses.",
    route: "/dashboard/expenses",
    icon: Receipt,
    category: "Finance",
    permission: "expenses.view",
    minimumPlan: "professional",
    sidebar: false,
    searchable: true,
    aiEnabled: true,
    core: false,
  },

  /* ===========================
       OPERATIONS
     =========================== */

  {
    moduleKey: "maintenance",
    name: "Maintenance",
    description: "Manage maintenance requests and repairs.",
    route: "/dashboard/maintenance",
    icon: Wrench,
    category: "Operations",
    permission: "maintenance.view",
    minimumPlan: "professional",
    sidebar: true,
    searchable: true,
    aiEnabled: true,
    core: false,
  },

  {
    moduleKey: "reports",
    name: "Reports",
    description: "View business reports and analytics.",
    route: "/dashboard/reports",
    icon: BarChart3,
    category: "Reports",
    permission: "reports.view",
    minimumPlan: "professional",
    sidebar: true,
    searchable: true,
    aiEnabled: true,
    core: false,
  },

  /* ===========================
       ADMINISTRATION
     =========================== */

  {
    moduleKey: "employees",
    name: "Employees",
    description: "Manage staff and assign operational roles.",
    route: "/dashboard/settings/employees",
    icon: Users,
    category: "Administration",
    permission: "employees.view",
    minimumPlan: "professional",
    sidebar: true,
    searchable: true,
    aiEnabled: false,
    core: false,
  },

  {
    moduleKey: "roles",
    name: "Roles & Permissions",
    description: "Manage employee roles and permissions.",
    route: "/dashboard/settings/roles",
    icon: Shield,
    category: "Administration",
    permission: "roles.view",
    minimumPlan: "professional",
    sidebar: true,
    searchable: true,
    aiEnabled: false,
    core: false,
  },

  {
    moduleKey: "settings",
    name: "Settings",
    description: "Configure your workspace.",
    route: "/dashboard/settings",
    icon: Settings,
    category: "Administration",
    permission: "settings.view",
    minimumPlan: "starter",
    sidebar: true,
    searchable: false,
    aiEnabled: false,
    core: true,
  },
];
