import { supabase } from "@/lib/supabase";

export interface Role {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Permission {
  id: string;
  module: string;
  action: string;
  permission_key: string;
}

export async function getRoles() {
  const { data, error } = await supabase
    .from("roles")
    .select("*")
    .order("name");

  if (error) throw error;

  return data as Role[];
}

export async function getRole(roleId: string) {
  const { data, error } = await supabase
    .from("roles")
    .select("*")
    .eq("id", roleId)
    .single();

  if (error) throw error;

  return data as Role;
}

export async function createRole(payload: {
  name: string;
  description?: string;
}) {
  const { data, error } = await supabase
    .from("roles")
    .insert({
      name: payload.name,
      description: payload.description,
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function updateRole(
  roleId: string,
  payload: {
    name: string;
    description?: string;
    is_active?: boolean;
  }
) {
  const { data, error } = await supabase
    .from("roles")
    .update(payload)
    .eq("id", roleId)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function deleteRole(roleId: string) {
  const { error } = await supabase
    .from("roles")
    .delete()
    .eq("id", roleId);

  if (error) throw error;
}

export async function getPermissions() {
  const { data, error } = await supabase
    .from("permissions")
    .select("*")
    .order("module")
    .order("action");

  if (error) throw error;

  return data as Permission[];
}

export async function getRolePermissions(roleId: string) {
  const { data, error } = await supabase
    .from("role_permissions")
    .select("permission_id")
    .eq("role_id", roleId);

  if (error) throw error;

  return data.map((x) => x.permission_id as string);
}

export async function saveRolePermissions(
  roleId: string,
  permissionIds: string[]
) {
  const { error: deleteError } = await supabase
    .from("role_permissions")
    .delete()
    .eq("role_id", roleId);

  if (deleteError) throw deleteError;

  if (permissionIds.length === 0) return;

  const rows = permissionIds.map((permission_id) => ({
    role_id: roleId,
    permission_id,
  }));

  const { error } = await supabase
    .from("role_permissions")
    .insert(rows);

  if (error) throw error;
}
