import { supabase } from "@/lib/supabase";

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

export async function getEmployees() {
  const { data, error } = await supabase.rpc(
    "get_employees",
    {}
  );

  if (error) throw error;

  return (data ?? []) as Employee[];
}

export async function createEmployee(
  payload: EmployeeInput
) {
  const { data, error } = await supabase.rpc(
    "create_employee",
    {
      p_full_name: payload.full_name,
      p_phone: payload.phone,
      p_email: payload.email ?? "",
      p_designation: payload.designation ?? "",
      p_role_id: payload.role_id,
      p_notes: payload.notes ?? "",
    }
  );

  if (error) throw error;

  return data;
}

export async function updateEmployee(
  employeeId: string,
  payload: EmployeeInput
) {
  const { error } = await supabase.rpc(
    "update_employee",
    {
      p_employee_id: employeeId,
      p_full_name: payload.full_name,
      p_phone: payload.phone,
      p_email: payload.email ?? "",
      p_designation: payload.designation ?? "",
      p_role_id: payload.role_id,
      p_notes: payload.notes ?? "",
    }
  );

  if (error) throw error;
}

export async function deactivateEmployee(
  employeeId: string
) {
  const { error } = await supabase.rpc(
    "deactivate_employee",
    {
      p_employee_id: employeeId,
    }
  );

  if (error) throw error;
}
