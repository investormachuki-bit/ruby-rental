export type RecurringCharge = {
  id: string;

  workspace_id: string;

  property_id: string;

  unit_id: string | null;

  lease_id: string | null;

  charge_name: string;

  description: string | null;

  amount: number;

  billing_frequency:
    | "Monthly"
    | "Quarterly"
    | "Biannual"
    | "Annual"
    | "One Time";

  is_mandatory: boolean;

  is_active: boolean;

  created_at: string;

  updated_at: string;
};
