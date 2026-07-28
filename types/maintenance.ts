export interface MaintenanceRequest {
  id: string;

  property_name: string;

  unit_number: string;

  tenant_name: string;

  title: string;

  description?: string;

  category: string;

  priority:
    | "Low"
    | "Medium"
    | "High"
    | "Emergency";

  status:
    | "Open"
    | "Assigned"
    | "In Progress"
    | "Completed"
    | "Cancelled";

  assigned_employee: string;

  estimated_cost: number;

  actual_cost: number;

  scheduled_date: string | null;

  completed_date: string | null;

  created_at: string;
}

export interface MaintenanceInput {
  property_id: string;

  unit_id: string;

  lease_id?: string;

  tenant_id?: string;

  title: string;

  description: string;

  category: string;

  priority:
    | "Low"
    | "Medium"
    | "High"
    | "Emergency";
}

export interface EmployeeOption {
  id: string;

  full_name: string;
}

export interface PropertyOption {
  id: string;

  name: string;
}

export interface UnitOption {
  id: string;

  unit_number: string;
}
