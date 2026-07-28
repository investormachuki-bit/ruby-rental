export interface Role {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Permission {
  id: string;
  module: string;
  action: string;
  permission_key: string;
  description?: string | null;
}

export interface RolePermission {
  role_id: string;
  permission_id: string;
}

export interface CreateRoleInput {
  name: string;
  description?: string;
}

export interface UpdateRoleInput {
  name: string;
  description?: string;
  is_active?: boolean;
}
