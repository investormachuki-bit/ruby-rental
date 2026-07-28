"use client";

import { useEffect, useState } from "react";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";

import {
  MaintenanceRequest,
  PropertyOption,
  UnitOption,
} from "@/types/maintenance";

interface Props {
  open: boolean;
  request?: MaintenanceRequest | null;

  properties: PropertyOption[];
  units: UnitOption[];

  onClose: () => void;

  onSave: (values: {
    property_id: string;
    unit_id: string;
    title: string;
    description: string;
    category: string;
    priority: string;
  }) => Promise<void>;
}

const categories = [
  "Plumbing",
  "Electrical",
  "Painting",
  "Cleaning",
  "Security",
  "Roof",
  "Doors",
  "Windows",
  "General",
];

const priorities = [
  "Low",
  "Medium",
  "High",
  "Emergency",
];

export default function MaintenanceDialog({
  open,
  request,
  properties,
  units,
  onClose,
  onSave,
}: Props) {
  const [propertyId, setPropertyId] = useState("");
  const [unitId, setUnitId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("General");
  const [priority, setPriority] = useState("Medium");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;

    if (request) {
      setTitle(request.title);
      setDescription(request.description ?? "");
      setCategory(request.category);
      setPriority(request.priority);
    } else {
      setPropertyId("");
      setUnitId("");
      setTitle("");
      setDescription("");
      setCategory("General");
      setPriority("Medium");
    }
  }, [open, request]);

  async function handleSave() {
    setSaving(true);

    try {
      await onSave({
        property_id: propertyId,
        unit_id: unitId,
        title,
        description,
        category,
        priority,
      });

      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      open={open}
      title={
        request
          ? "Edit Maintenance Request"
          : "New Maintenance Request"
      }
      description="Log a maintenance issue."
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
              !propertyId ||
              !unitId ||
              !title.trim()
            }
            onClick={handleSave}
          >
            Save Request
          </Button>
        </>
      }
    >
      <div className="grid gap-5 md:grid-cols-2">

        <Select
          label="Property"
          value={propertyId}
          onChange={(e: any) =>
            setPropertyId(e.target.value)
          }
          options={properties.map((p) => ({
            label: p.name,
            value: p.id,
          }))}
        />

        <Select
          label="Unit"
          value={unitId}
          onChange={(e: any) =>
            setUnitId(e.target.value)
          }
          options={units.map((u) => ({
            label: u.unit_number,
            value: u.id,
          }))}
        />

        <Input
          label="Issue Title"
          value={title}
          onChange={(e: any) =>
            setTitle(e.target.value)
          }
        />

        <Select
          label="Category"
          value={category}
          onChange={(e: any) =>
            setCategory(e.target.value)
          }
          options={categories.map((c) => ({
            label: c,
            value: c,
          }))}
        />

        <Select
          label="Priority"
          value={priority}
          onChange={(e: any) =>
            setPriority(e.target.value)
          }
          options={priorities.map((p) => ({
            label: p,
            value: p,
          }))}
        />

        <div className="md:col-span-2">
          <Textarea
            label="Description"
            rows={5}
            value={description}
            onChange={(e: any) =>
              setDescription(e.target.value)
            }
          />
        </div>

      </div>
    </Modal>
  );
}
