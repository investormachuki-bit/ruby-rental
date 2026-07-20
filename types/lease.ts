export type LeaseStatus =
  | "Draft"
  | "Active"
  | "Expired"
  | "Renewed"
  | "Terminated";

export interface Lease {
  id: string;

  workspace_id: string;

  lease_number: string;

  tenant_id: string;

  property_id: string;

  unit_id: string;

  start_date: string;

  end_date?: string | null;

  move_in_date?: string | null;

  move_out_date?: string | null;

  rent_amount: number;

  deposit_amount: number;

  rent_due_day: number;

  billing_day?: number | null;

  status: LeaseStatus;

  notes?: string | null;

  created_at: string;

  updated_at: string;
}

export interface Tenant {
  id: string;

  tenant_code?: string;

  full_name: string;

  phone?: string | null;

  email?: string | null;

  id_number?: string | null;

  occupation?: string | null;

  employer?: string | null;

  emergency_contact_name?: string | null;

  emergency_contact_phone?: string | null;

  first_name?: string | null;

  last_name?: string | null;
}

export interface Property {
  id: string;

  property_code?: string;

  name: string;

  county?: string | null;

  town?: string | null;

  address?: string | null;
}

export interface Unit {
  id: string;

  unit_number: string;

  floor_number?: number | null;

  monthly_rent?: number;

  deposit?: number;

  status?: string;
}

export interface LeaseDetails extends Lease {
  tenant: Tenant;

  property: Property;

  unit: Unit;
}
