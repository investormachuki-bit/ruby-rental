export interface Property {
  id: string;

  workspace_id: string;

  name: string;

  property_type: string;

  county: string | null;

  town: string | null;

  address: string | null;

  description: string | null;

  is_active: boolean;

  created_at: string;

  updated_at: string;
}
