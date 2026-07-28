"use client";

import { useEffect, useState } from "react";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";

import { Employee, RoleOption } from "@/types/employees";

interface Props {
  open: boolean;
  employee?: Employee | null;
  roles: RoleOption[];
  onClose: () => void;
  onSave: (values: {
    full_name: string;
    phone: string;
    email: string;
    designation: string;
    role_id: string;
    notes: string;
  }) => Promise<void>;
}

export default function EmployeeDialog({
  open,
  employee,
  roles,
  onClose,
  onSave,
}: Props) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [designation, setDesignation] = useState("");
  const [roleId, setRoleId] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (employee) {
      setFullName(employee.full_name);
      setPhone(employee.phone);
      setEmail(employee.email ?? "");
      setDesignation(employee.designation ?? "");
      setRoleId(employee.role_id);
      setNotes("");
    } else {
      setFullName("");
      setPhone("");
      setEmail("");
      setDesignation("");
      setRoleId("");
      setNotes("");
    }
  }, [employee, open]);

  async function handleSave() {
    setSaving(true);

    try {
      await onSave({
        full_name: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        designation: designation.trim(),
        role_id: roleId,
        notes: notes.trim(),
      });

      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      open={open}
      title={employee ? "Edit Employee" : "New Employee"}
      description="Create or update an employee."
      onClose={onClose}
      size="lg"
      footer={
        <>
          <Button
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            loading={saving}
            disabled={
              !fullName.trim() ||
              !phone.trim() ||
              !roleId
            }
            onClick={handleSave}
          >
            Save Employee
          </Button>
        </>
      }
    >
      <div className="grid gap-5 md:grid-cols-2">

        <Input
          label="Full Name"
          value={fullName}
          onChange={(e: any) =>
            setFullName(e.target.value)
          }
        />

        <Input
          label="Phone"
          value={phone}
          onChange={(e: any) =>
            setPhone(e.target.value)
          }
        />

        <Input
          label="Email"
          value={email}
          onChange={(e: any) =>
            setEmail(e.target.value)
          }
        />

        <Input
          label="Designation"
          value={designation}
          onChange={(e: any) =>
            setDesignation(e.target.value)
          }
        />

        <Select
          label="Role"
          value={roleId}
          onChange={(e: any) =>
            setRoleId(e.target.value)
          }
          options={roles.map((role) => ({
            label: role.name,
            value: role.id,
          }))}
        />

        <div className="md:col-span-2">
          <Textarea
            label="Notes"
            rows={4}
            value={notes}
            onChange={(e: any) =>
              setNotes(e.target.value)
            }
          />
        </div>

      </div>
    </Modal>
  );
}
