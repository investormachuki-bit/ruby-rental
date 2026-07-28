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
} from "@/types/maintenance";

import { getUnitsForSelect } from "@/services/units/getUnitsForSelect";

interface Props {
  open: boolean;

  request?: MaintenanceRequest | null;

  properties: PropertyOption[];

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
  "General",
  "Plumbing",
  "Electrical",
  "Painting",
  "Cleaning",
  "Roof",
  "Security",
  "Doors",
  "Windows",
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
  onClose,
  onSave,
}: Props) {
  const [propertyId, setPropertyId] = useState("");
  const [unitId, setUnitId] = useState("");

  const [units, setUnits] = useState<
    { label: string; value: string }[]
  >([]);

  const [title, setTitle] = useState("");

  const [description, setDescription] =
    useState("");

  const [category, setCategory] =
    useState("General");

  const [priority, setPriority] =
    useState("Medium");

  const [saving, setSaving] =
    useState(false);

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
      setUnits([]);
      setTitle("");
      setDescription("");
      setCategory("General");
      setPriority("Medium");
    }
  }, [open, request]);

  useEffect(() => {
    async function loadUnits() {
      if (!propertyId) {
        setUnits([]);
        setUnitId("");
        return;
      }

      const data =
        await getUnitsForSelect(propertyId);

      setUnits(data);
      setUnitId("");
    }

    loadUnits();
  }, [propertyId]);

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
          onChange={(e) =>
            setPropertyId(e.target.value)
          }
          options={[
            { label: "Select Property", value: "" },
            ...properties.map((property) => ({
              label: property.name,
              value: property.id,
            })),
          ]}
        />

        <Select
          label="Unit"
          value={unitId}
          onChange={(e) =>
            setUnitId(e.target.value)
          }
          options={[
            { label: "Select Unit", value: "" },
            ...units,
          ]}
          disabled={!propertyId}
        />

        <Input
          label="Issue Title"
          value={title}
          onChange={(e: any) =>
            setTitle(e.target.value)
          }
          placeholder="e.g. Kitchen sink leaking"
        />

        <Select
          label="Category"
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
          options={categories.map((item) => ({
            label: item,
            value: item,
          }))}
        />

        <Select
          label="Priority"
          value={priority}
          onChange={(e) =>
            setPriority(e.target.value)
          }
          options={priorities.map((item) => ({
            label: item,
            value: item,
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
            placeholder="Describe the maintenance issue..."
          />
        </div>

      </div>
    </Modal>
  );
}
