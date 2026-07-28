"use client";

import { useEffect, useState } from "react";
import { Role } from "@/types/roles";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

interface RoleDialogProps {
  open: boolean;
  role?: Role | null;
  onClose: () => void;
  onSave: (values: {
    name: string;
    description: string;
    is_active: boolean;
  }) => Promise<void>;
}

export default function RoleDialog({
  open,
  role,
  onClose,
  onSave,
}: RoleDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (role) {
      setName(role.name);
      setDescription(role.description ?? "");
      setIsActive(role.is_active);
    } else {
      setName("");
      setDescription("");
      setIsActive(true);
    }
  }, [role, open]);

  async function handleSave() {
    setSaving(true);

    try {
      await onSave({
        name: name.trim(),
        description: description.trim(),
        is_active: isActive,
      });

      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {role ? "Edit Role" : "Create Role"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">

          <div>
            <Label>Role Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Property Manager"
            />
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe this role..."
            />
          </div>

          <div className="flex items-center justify-between border rounded-lg p-3">
            <div>
              <Label>Active</Label>
              <p className="text-sm text-muted-foreground">
                Allow users to use this role.
              </p>
            </div>

            <Switch
              checked={isActive}
              onCheckedChange={setIsActive}
            />
          </div>

        </div>

        <DialogFooter>

          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            onClick={handleSave}
            disabled={saving || !name.trim()}
          >
            {saving ? "Saving..." : "Save Role"}
          </Button>

        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
