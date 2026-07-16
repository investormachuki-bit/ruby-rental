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

  unit_type: string | null;

  floor_number: number | null;

  bedrooms: number;

  bathrooms: number;

  size_sqm: number;

  monthly_rent: number;

  deposit: number;

  water_meter_number: string | null;

  electricity_meter_number: string | null;

  gas_meter_number: string | null;

  internet_account_number: string | null;

  garbage_fee: number;

  parking_fee: number;

  internet_fee: number;

  service_charge: number;

  security_fee: number;

  sewer_fee: number;

  status: UnitStatus;

  notes: string | null;

  created_at: string;

  updated_at: string;
}
