"use client";

import { Edit, Shield, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Role } from "@/types/roles";

interface RoleTableProps {
  roles: Role[];
  loading?: boolean;
  onEdit: (role: Role) => void;
  onPermissions: (role: Role) => void;
  onDelete: (role: Role) => void;
}

export default function RoleTable({
  roles,
  loading = false,
  onEdit,
  onPermissions,
  onDelete,
}: RoleTableProps) {
  if (loading) {
    return (
      <Card className="p-8 text-center">
        Loading roles...
      </Card>
    );
  }

  if (roles.length === 0) {
    return (
      <Card className="p-8 text-center text-muted-foreground">
        No roles found.
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <table className="w-full">
        <thead className="border-b bg-muted/40">
          <tr>
            <th className="px-4 py-3 text-left">Role</th>
            <th className="px-4 py-3 text-left">Description</th>
            <th className="px-4 py-3 text-center">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {roles.map((role) => (
            <tr
              key={role.id}
              className="border-b last:border-0 hover:bg-muted/20"
            >
              <td className="px-4 py-4 font-medium">
                {role.name}
              </td>

              <td className="px-4 py-4 text-muted-foreground">
                {role.description || "-"}
              </td>

              <td className="px-4 py-4 text-center">
                <Badge
                  variant={
                    role.is_active
                      ? "default"
                      : "secondary"
                  }
                >
                  {role.is_active ? "Active" : "Inactive"}
                </Badge>
              </td>

              <td className="px-4 py-4">
                <div className="flex justify-end gap-2">

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onPermissions(role)}
                  >
                    <Shield className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onEdit(role)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => onDelete(role)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>

                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
