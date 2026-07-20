import {
  LayoutDashboard,
  Building2,
  Home,
  Users,
  FileText,
  CreditCard,
  Receipt,
  Wrench,
  BarChart3,
  Settings,
  Shield,
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
    route: "/",
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
    route: "/properties",
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
    route: "/units",
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
    name: "Occupants",
    description: "Manage tenants and occupants.",
    route: "/tenants",
    icon: Users,
    category: "Core",
    permission: "occupants.view",
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
    route: "/leases",
    icon: FileText,
    category: "Core",
    permission: "leases.view",
    minimumPlan: "starter",
    sidebar: true,
    searchable: true,
    aiEnabled: true,
    core: true,
  },

  {
    moduleKey: "payments",
    name: "Payments",
    description: "Record and manage tenant payments.",
    route: "/payments",
    icon: CreditCard,
    category: "Finance",
    permission: "payments.view",
    minimumPlan: "starter",
    sidebar: true,
    searchable: true,
    aiEnabled: true,
    core: true,
  },

  {
    moduleKey: "expenses",
    name: "Expenses",
    description: "Track operational expenses.",
    route: "/expenses",
    icon: Receipt,
    category: "Finance",
    permission: "expenses.view",
    minimumPlan: "professional",
    sidebar: true,
    searchable: true,
    aiEnabled: true,
    core: false,
  },

  {
    moduleKey: "maintenance",
    name: "Maintenance",
    description: "Manage maintenance requests and repairs.",
    route: "/maintenance",
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
    route: "/reports",
    icon: BarChart3,
    category: "Reports",
    permission: "reports.view",
    minimumPlan: "professional",
    sidebar: true,
    searchable: true,
    aiEnabled: true,
    core: false,
  },

  {
    moduleKey: "settings",
    name: "Settings",
    description: "Configure your workspace.",
    route: "/settings",
    icon: Settings,
    category: "Administration",
    permission: "settings.view",
    minimumPlan: "starter",
    sidebar: true,
    searchable: false,
    aiEnabled: false,
    core: true,
  },

  {
    moduleKey: "users",
    name: "Users",
    description: "Manage workspace users and roles.",
    route: "/users",
    icon: Shield,
    category: "Administration",
    permission: "users.view",
    minimumPlan: "professional",
    sidebar: true,
    searchable: true,
    aiEnabled: false,
    core: false,
  },
];
