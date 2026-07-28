export interface Employee {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  designation: string | null;
  role_id: string;
  role_name: string;
  employment_status: string;
  hired_date: string;
  created_at: string;
}

export interface EmployeeInput {
  full_name: string;
  phone: string;
  email?: string;
  designation?: string;
  role_id: string;
  notes?: string;
}

export interface EmployeeFormValues {
  full_name: string;
  phone: string;
  email: string;
  designation: string;
  role_id: string;
  notes: string;
}

export interface RoleOption {
  id: string;
  name: string;
}

export type EmploymentStatus =
  | "Active"
  | "Inactive"
  | "Suspended";
