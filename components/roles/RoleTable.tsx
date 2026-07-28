"use client";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import DataTable from "@/components/ui/DataTable";

import { Edit2, Shield, Trash2 } from "lucide-react";
import { Role } from "@/types/roles";

interface Props {
  roles: Role[];
  loading: boolean;
  onEdit: (role: Role) => void;
  onPermissions: (role: Role) => void;
  onDelete: (role: Role) => void;
}

export default function RoleTable({
  roles,
  loading,
  onEdit,
  onPermissions,
  onDelete,
}: Props) {
  const columns = [
    {
      key: "name",
      header: "Role",
      render: (role: Role) => (
        <span className="font-medium">{role.name}</span>
      ),
    },
    {
      key: "description",
      header: "Description",
      render: (role: Role) => role.description || "-",
    },
    {
      key: "status",
      header: "Status",
      render: (role: Role) => (
        <Badge
          variant={role.is_active ? "success" : "secondary"}
        >
          {role.is_active ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (role: Role) => (
        <div className="flex justify-end gap-2">

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPermissions(role)}
          >
            <Shield size={16} />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(role)}
          >
            <Edit2 size={16} />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(role)}
          >
            <Trash2 size={16} />
          </Button>

        </div>
      ),
    },
  ];

  return (
    <Card>

      <DataTable
        columns={columns}
        data={roles}
        loading={loading}
        emptyMessage="No roles found."
      />

    </Card>
  );
}
