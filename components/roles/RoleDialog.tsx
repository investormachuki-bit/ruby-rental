"use client";

import { useEffect, useState } from "react";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import ToggleSwitch from "@/components/ui/ToggleSwitch";

import { Role } from "@/types/roles";

interface Props {
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
}: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [active, setActive] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (role) {
      setName(role.name);
      setDescription(role.description ?? "");
      setActive(role.is_active);
    } else {
      setName("");
      setDescription("");
      setActive(true);
    }
  }, [role, open]);

  async function handleSave() {
    setSaving(true);

    try {
      await onSave({
        name: name.trim(),
        description: description.trim(),
        is_active: active,
      });

      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      open={open}
      title={role ? "Edit Role" : "New Role"}
      description="Create or update a user role."
      onClose={onClose}
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>

          <Button
            onClick={handleSave}
            disabled={!name.trim() || saving}
          >
            {saving ? "Saving..." : "Save Role"}
          </Button>
        </>
      }
    >
      <div className="space-y-6">

        <Input
          label="Role Name"
          value={name}
          onChange={(e: any) => setName(e.target.value)}
          placeholder="Property Manager"
        />

        <Textarea
          label="Description"
          value={description}
          onChange={(e: any) =>
            setDescription(e.target.value)
          }
          placeholder="Describe this role..."
          rows={4}
        />

        <ToggleSwitch
          label="Active"
          description="Allow this role to be assigned to employees."
          checked={active}
          onChange={setActive}
        />

      </div>
    </Modal>
  );
}
