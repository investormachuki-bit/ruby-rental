"use client";

import { useEffect, useMemo, useState } from "react";
import { Permission } from "@/types/roles";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

interface Props {
  permissions: Permission[];
  selected: string[];
  loading?: boolean;
  saving?: boolean;
  onSave: (permissionIds: string[]) => Promise<void>;
}

const ACTIONS = [
  "view",
  "create",
  "edit",
  "delete",
  "approve",
  "export",
];

export default function RolePermissions({
  permissions,
  selected,
  loading = false,
  saving = false,
  onSave,
}: Props) {
  const [selectedIds, setSelectedIds] = useState<string[]>(selected);

  useEffect(() => {
    setSelectedIds(selected);
  }, [selected]);

  const grouped = useMemo(() => {
    const map: Record<string, Permission[]> = {};

    permissions.forEach((permission) => {
      if (!map[permission.module]) {
        map[permission.module] = [];
      }

      map[permission.module].push(permission);
    });

    return map;
  }, [permissions]);

  function toggle(permissionId: string) {
    setSelectedIds((current) =>
      current.includes(permissionId)
        ? current.filter((id) => id !== permissionId)
        : [...current, permissionId]
    );
  }

  if (loading) {
    return (
      <Card className="p-6 text-center">
        Loading permissions...
      </Card>
    );
  }

  return (
    <Card className="overflow-x-auto">

      <table className="w-full">

        <thead className="border-b bg-muted/40">
          <tr>
            <th className="text-left px-4 py-3">Module</th>

            {ACTIONS.map((action) => (
              <th
                key={action}
                className="text-center px-4 py-3 capitalize"
              >
                {action}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>

          {Object.entries(grouped).map(([module, modulePermissions]) => (

            <tr key={module} className="border-b">

              <td className="px-4 py-4 font-medium capitalize">
                {module}
              </td>

              {ACTIONS.map((action) => {
                const permission = modulePermissions.find(
                  (p) => p.action === action
                );

                return (
                  <td
                    key={action}
                    className="text-center"
                  >
                    {permission ? (
                      <Checkbox
                        checked={selectedIds.includes(permission.id)}
                        onCheckedChange={() =>
                          toggle(permission.id)
                        }
                      />
                    ) : (
                      "-"
                    )}
                  </td>
                );
              })}

            </tr>

          ))}

        </tbody>

      </table>

      <div className="flex justify-end p-4 border-t">

        <Button
          onClick={() => onSave(selectedIds)}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Permissions"}
        </Button>

      </div>

    </Card>
  );
}
