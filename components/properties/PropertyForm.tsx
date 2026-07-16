"use client";

import { useState } from "react";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";

import {
  createProperty,
  CreatePropertyInput,
} from "@/services/properties/create";

import {
  updateProperty,
} from "@/services/properties/update";

import { Property } from "@/types/property";

const PROPERTY_TYPES = [
  { label: "Apartment", value: "Apartment" },
  { label: "Residential", value: "Residential" },
  { label: "Commercial", value: "Commercial" },
  { label: "Mixed Use", value: "Mixed Use" },
];

type Props = {
  property?: Property;
  onSuccess: () => void;
  onCancel: () => void;
};

function toFormValues(
  property?: Property
): CreatePropertyInput {
  if (!property) {
    return {
      name: "",
      propertyType: "Apartment",
      county: "",
      town: "",
      address: "",
      description: "",
    };
  }

  return {
    name: property.name,
    propertyType: property.property_type,
    county: property.county ?? "",
    town: property.town ?? "",
    address: property.address ?? "",
    description: property.description ?? "",
  };
}

export default function PropertyForm({
  property,
  onSuccess,
  onCancel,
}: Props) {
  const isEditing = Boolean(property);

  const [form, setForm] = useState<CreatePropertyInput>(
    () => toFormValues(property)
  );

  const [loading, setLoading] = useState(false);

  function updateField(
    field: keyof CreatePropertyInput,
    value: string
  ) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    try {
      setLoading(true);

      if (isEditing && property) {
        await updateProperty({
          id: property.id,
          name: form.name,
          propertyType: form.propertyType,
          county: form.county,
          town: form.town,
          address: form.address,
          description: form.description,
        });
      } else {
        await createProperty(form);
      }

      onSuccess();
    } catch (error: any) {

  console.error(error);

  alert(JSON.stringify(error));

}

      alert(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <Input
        label="Property Name"
        value={form.name}
        onChange={(e) =>
          updateField("name", e.target.value)
        }
        required
      />

      <Select
        label="Property Type"
        value={form.propertyType}
        onChange={(e) =>
          updateField(
            "propertyType",
            e.target.value
          )
        }
        options={PROPERTY_TYPES}
      />

      <Input
        label="County"
        value={form.county}
        onChange={(e) =>
          updateField("county", e.target.value)
        }
      />

      <Input
        label="Town"
        value={form.town}
        onChange={(e) =>
          updateField("town", e.target.value)
        }
      />

      <Input
        label="Address"
        value={form.address}
        onChange={(e) =>
          updateField("address", e.target.value)
        }
      />

      <Textarea
        label="Description"
        value={form.description}
        onChange={(e) =>
          updateField(
            "description",
            e.target.value
          )
        }
        rows={4}
      />

      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          variant="primary"
          loading={loading}
        >
          {loading
            ? "Saving..."
            : isEditing
            ? "Update Property"
            : "Save Property"}
        </Button>
      </div>
    </form>
  );
}
