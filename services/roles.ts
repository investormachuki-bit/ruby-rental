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

async function getCurrentWorkspaceId(): Promise<string> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error(
      "You must be logged in to manage roles."
    );
  }

  const { data: profile, error } =
    await supabase
      .from("profiles")
      .select("workspace_id")
      .eq("id", user.id)
      .single();

  if (error) {
    throw error;
  }

  if (!profile?.workspace_id) {
    throw new Error(
      "Workspace not found for the current user."
    );
  }

  return profile.workspace_id;
}

export async function getRoles() {
  const workspaceId =
    await getCurrentWorkspaceId();

  const { data, error } = await supabase
    .from("roles")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("name");

  if (error) throw error;

  return data as Role[];
}

export async function getRole(
  roleId: string
) {
  const workspaceId =
    await getCurrentWorkspaceId();

  const { data, error } = await supabase
    .from("roles")
    .select("*")
    .eq("id", roleId)
    .eq("workspace_id", workspaceId)
    .single();

  if (error) throw error;

  return data as Role;
}

export async function createRole(payload: {
  name: string;
  description?: string;
  is_active?: boolean;
}) {
  const workspaceId =
    await getCurrentWorkspaceId();

  const { data, error } = await supabase
    .from("roles")
    .insert({
      workspace_id: workspaceId,
      name: payload.name,
      description: payload.description ?? null,
      is_active:
        payload.is_active ?? true,
    })
    .select()
    .single();

  if (error) throw error;

  return data as Role;
}

export async function updateRole(
  roleId: string,
  payload: {
    name: string;
    description?: string;
    is_active?: boolean;
  }
) {
  const workspaceId =
    await getCurrentWorkspaceId();

  const { data, error } = await supabase
    .from("roles")
    .update({
      name: payload.name,
      description:
        payload.description ?? null,
      is_active:
        payload.is_active ?? true,
    })
    .eq("id", roleId)
    .eq("workspace_id", workspaceId)
    .select()
    .single();

  if (error) throw error;

  return data as Role;
}

export async function deleteRole(
  roleId: string
) {
  const workspaceId =
    await getCurrentWorkspaceId();

  const { error } = await supabase
    .from("roles")
    .delete()
    .eq("id", roleId)
    .eq("workspace_id", workspaceId);

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

export async function getRolePermissions(
  roleId: string
) {
  const workspaceId =
    await getCurrentWorkspaceId();

  const { data, error } = await supabase
    .from("role_permissions")
    .select(`
      permission_id,
      roles!inner(workspace_id)
    `)
    .eq("role_id", roleId)
    .eq(
      "roles.workspace_id",
      workspaceId
    );

  if (error) throw error;

  return data.map(
    (x) => x.permission_id as string
  );
}

export async function saveRolePermissions(
  roleId: string,
  permissionIds: string[]
) {
  const workspaceId =
    await getCurrentWorkspaceId();

  // Verify that the role belongs to
  // the current workspace.
  const { data: role, error: roleError } =
    await supabase
      .from("roles")
      .select("id")
      .eq("id", roleId)
      .eq("workspace_id", workspaceId)
      .single();

  if (roleError) {
    throw roleError;
  }

  if (!role) {
    throw new Error(
      "Role does not belong to the current workspace."
    );
  }

  const {
    error: deleteError,
  } = await supabase
    .from("role_permissions")
    .delete()
    .eq("role_id", roleId);

  if (deleteError) {
    throw deleteError;
  }

  if (permissionIds.length === 0) {
    return;
  }

  const rows = permissionIds.map(
    (permission_id) => ({
      role_id: roleId,
      permission_id,
    })
  );

  const { error } = await supabase
    .from("role_permissions")
    .insert(rows);

  if (error) {
    throw error;
  }
}