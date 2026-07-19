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
