export type LeaseStatus =
  | "Draft"
  | "Active"
  | "Ended"
  | "Terminated";

export interface Lease {
  id: string;

  workspace_id: string;

  lease_number: string;

  tenant_id: string;

  property_id: string;

  unit_id: string;

  move_in_date: string;

  move_out_date?: string | null;

  rent_amount: number;

  deposit_amount: number;

  billing_day: number;

  status: LeaseStatus;

  notes?: string | null;

  created_at: string;

  updated_at: string;
}

export interface Tenant {
  id: string;

  occupant_code?: string;

  full_name: string;

  phone?: string | null;

  email?: string | null;

  id_number?: string | null;

  occupation?: string | null;

  employer?: string | null;

  emergency_contact_name?: string | null;

  emergency_contact_phone?: string | null;

  // Temporary legacy fields (remove after DB migration)
  first_name?: string | null;

  last_name?: string | null;

  phone_number?: string | null;
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

  floor_name?: string | null;

  monthly_rent: number;

  deposit: number;

  status?: string;
}

/**
 * Full lease object returned by getLease()
 * Includes related entities.
 */
export interface LeaseDetails extends Lease {
  tenant: Tenant;

  property: Property;

  unit: Unit;
}
