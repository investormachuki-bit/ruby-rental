"use client";

import { useEffect, useState } from "react";

import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";

import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

import RoleTable from "@/components/roles/RoleTable";
import RoleDialog from "@/components/roles/RoleDialog";
import RolePermissions from "@/components/roles/RolePermissions";

import {
  getRoles,
  getPermissions,
  getRolePermissions,
  saveRolePermissions,
  createRole,
  updateRole,
  deleteRole,
} from "@/services/roles";

import { Role, Permission } from "@/types/roles";

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [savingPermissions, setSavingPermissions] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [permissionsOpen, setPermissionsOpen] = useState(false);

  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  async function loadRoles() {
    setLoading(true);

    try {
      setRoles(await getRoles());
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

    setPermissionsOpen(true);
  }

  return (
    <PageContainer>

      <PageHeader
        title="Roles & Permissions"
        description="Manage employee roles and permissions."
        actions={
          <Button
            onClick={() => {
              setSelectedRole(null);
              setDialogOpen(true);
            }}
          >
            New Role
          </Button>
        }
      />

      <RoleTable
        roles={roles}
        loading={loading}
        onEdit={(role) => {
          setSelectedRole(role);
          setDialogOpen(true);
        }}
        onPermissions={openPermissions}
        onDelete={async (role) => {
          if (!window.confirm(`Delete ${role.name}?`)) return;

          await deleteRole(role.id);

          loadRoles();
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

      <Modal
        open={permissionsOpen}
        title={`Permissions - ${selectedRole?.name ?? ""}`}
        description="Configure access rights."
        onClose={() => setPermissionsOpen(false)}
        size="xl"
      >
        <RolePermissions
          permissions={permissions}
          selected={selectedPermissions}
          saving={savingPermissions}
          onSave={async (ids) => {
            if (!selectedRole) return;

            setSavingPermissions(true);

            try {
              await saveRolePermissions(
                selectedRole.id,
                ids
              );

              setPermissionsOpen(false);
            } finally {
              setSavingPermissions(false);
            }
          }}
        />
      </Modal>

    </PageContainer>
  );
}
