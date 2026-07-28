import { supabase } from "@/lib/supabase";

import type {
  MaintenanceRequest,
  MaintenanceInput,
} from "@/types/maintenance";

export async function getMaintenanceRequests(): Promise<MaintenanceRequest[]> {
  const { data, error } = await supabase.rpc(
    "get_maintenance_requests",
    {}
  );

  if (error) {
    throw error;
  }

  return (data ?? []) as MaintenanceRequest[];
}

export async function createMaintenanceRequest(
  payload: MaintenanceInput
) {
  const { data, error } = await supabase.rpc(
    "create_maintenance_request",
    {
      p_property_id: payload.property_id,
      p_unit_id: payload.unit_id,
      p_lease_id: payload.lease_id ?? null,
      p_tenant_id: payload.tenant_id ?? null,
      p_title: payload.title,
      p_description: payload.description,
      p_category: payload.category,
      p_priority: payload.priority,
    }
  );

  if (error) {
    throw error;
  }

  return data;
}

export async function assignMaintenance(
  requestId: string,
  employeeId: string,
  scheduledDate?: string
) {
  const { error } = await supabase.rpc(
    "assign_maintenance",
    {
      p_request_id: requestId,
      p_employee_id: employeeId,
      p_scheduled_date: scheduledDate ?? null,
    }
  );

  if (error) {
    throw error;
  }
}

export async function completeMaintenance(
  requestId: string,
  actualCost: number
) {
  const { error } = await supabase.rpc(
    "complete_maintenance",
    {
      p_request_id: requestId,
      p_actual_cost: actualCost,
    }
  );

  if (error) {
    throw error;
  }
}
