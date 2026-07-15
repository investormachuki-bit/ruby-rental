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
} from "lucide-react";

export type Feature = {
  moduleKey: string;

  label: string;

  href: string;

  icon: any;

  category:
    | "Core"
    | "Operations"
    | "Finance"
    | "Reports"
    | "Administration";

  core: boolean;
};

export const FEATURE_REGISTRY: Feature[] = [

  {
    moduleKey: "dashboard",
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    category: "Core",
    core: true,
  },

  {
    moduleKey: "properties",
    label: "Properties",
    href: "/properties",
    icon: Building2,
    category: "Core",
    core: true,
  },

  {
    moduleKey: "occupants",
    label: "Occupants",
    href: "/occupants",
    icon: Users,
    category: "Core",
    core: true,
  },

  {
    moduleKey: "leases",
    label: "Leases",
    href: "/leases",
    icon: FileText,
    category: "Core",
    core: true,
  },

  {
    moduleKey: "payments",
    label: "Payments",
    href: "/payments",
    icon: CreditCard,
    category: "Finance",
    core: true,
  },

  {
    moduleKey: "expenses",
    label: "Expenses",
    href: "/expenses",
    icon: Receipt,
    category: "Finance",
    core: false,
  },

  {
    moduleKey: "maintenance",
    label: "Maintenance",
    href: "/maintenance",
    icon: Wrench,
    category: "Operations",
    core: false,
  },

  {
    moduleKey: "reports",
    label: "Reports",
    href: "/reports",
    icon: BarChart3,
    category: "Reports",
    core: false,
  },

  {
    moduleKey: "settings",
    label: "Settings",
    href: "/settings",
    icon: Settings,
    category: "Administration",
    core: true,
  },

  {
    moduleKey: "users",
    label: "Users",
    href: "/users",
    icon: Shield,
    category: "Administration",
    core: false,
  },

];
