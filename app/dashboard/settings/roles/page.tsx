"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import RoleTable from "@/components/roles/RoleTable";
import RoleDialog from "@/components/roles/RoleDialog";
import RolePermissions from "@/components/roles/RolePermissions";

import {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
  getPermissions,
  getRolePermissions,
  saveRolePermissions,
} from "@/services/roles";

import { Role, Permission } from "@/types/roles";

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [savingPermissions, setSavingPermissions] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [permissionOpen, setPermissionOpen] = useState(false);

  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  async function loadRoles() {
    setLoading(true);

    try {
      const data = await getRoles();
      setRoles(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRoles();
  }, []);

  async function openPermissions(role: Role) {
    setSelectedRole(role);

    const perms = await getPermissions();
    const selected = await getRolePermissions(role.id);

    setPermissions(perms);
    setSelectedPermissions(selected);

    setPermissionOpen(true);
  }

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-2xl font-bold">
            Roles & Permissions
          </h1>

          <p className="text-muted-foreground">
            Manage employee roles and access rights.
          </p>

        </div>

        <Button
          onClick={() => {
            setSelectedRole(null);
            setDialogOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Role
        </Button>

      </div>

      <RoleTable
        roles={roles}
        loading={loading}
        onEdit={(role) => {
          setSelectedRole(role);
          setDialogOpen(true);
        }}
        onPermissions={openPermissions}
        onDelete={async (role) => {
          if (!confirm(`Delete ${role.name}?`)) return;

          await deleteRole(role.id);
          await loadRoles();
        }}
      />

      <RoleDialog
        open={dialogOpen}
        role={selectedRole}
        onClose={() => setDialogOpen(false)}
        onSave={async (values) => {

          if (selectedRole) {

            await updateRole(selectedRole.id, values);

          } else {

            await createRole(values);

          }

          await loadRoles();
        }}
      />

      {permissionOpen && selectedRole && (

        <RolePermissions
          permissions={permissions}
          selected={selectedPermissions}
          saving={savingPermissions}
          onSave={async (permissionIds) => {

            setSavingPermissions(true);

            try {

              await saveRolePermissions(
                selectedRole.id,
                permissionIds
              );

              setPermissionOpen(false);

            } finally {

              setSavingPermissions(false);

            }
          }}
        />

      )}

    </div>
  );
}
