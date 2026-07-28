"use client";

import { useEffect, useMemo, useState } from "react";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import ToggleSwitch from "@/components/ui/ToggleSwitch";

import { Permission } from "@/types/roles";

interface Props {
  permissions: Permission[];
  selected: string[];
  loading?: boolean;
  saving?: boolean;
  onSave: (permissionIds: string[]) => Promise<void>;
}

export default function RolePermissions({
  permissions,
  selected,
  loading = false,
  saving = false,
  onSave,
}: Props) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

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
      <Card className="p-8 text-center">
        Loading permissions...
      </Card>
    );
  }

  return (
    <Card className="p-6">

      <div className="space-y-8">

        {Object.entries(grouped).map(([module, modulePermissions]) => (

          <div key={module}>

            <h3 className="mb-4 text-lg font-semibold capitalize">
              {module}
            </h3>

            <div className="grid gap-3 md:grid-cols-2">

              {modulePermissions.map((permission) => (

                <ToggleSwitch
                  key={permission.id}
                  label={permission.action}
                  checked={selectedIds.includes(permission.id)}
                  onChange={() => toggle(permission.id)}
                />

              ))}

            </div>

          </div>

        ))}

      </div>

      <div className="mt-8 flex justify-end">

        <Button
          loading={saving}
          onClick={() => onSave(selectedIds)}
        >
          Save Permissions
        </Button>

      </div>

    </Card>
  );
}
