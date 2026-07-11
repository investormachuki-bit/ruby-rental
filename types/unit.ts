export type UnitStatus =
  | "Vacant"
  | "Occupied"
  | "Reserved"
  | "Maintenance";

export interface Unit {
  id: string;

  workspace_id: string;

  property_id: string;

  unit_number: string;

  unit_sequence: number;

  floor_name: string | null;

  monthly_rent: number;

  deposit: number;

  water_type: string;

  water_amount: number;

  electricity_type: string;

  electricity_amount: number;

  garbage_fee: number;

  parking_fee: number;

  internet_fee: number;

  service_charge: number;

  status: UnitStatus;

  notes: string | null;

  created_at: string;

  updated_at: string;
}
