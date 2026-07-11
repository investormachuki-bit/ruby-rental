"use client";

import { useState } from "react";
import {
  createProperty,
  CreatePropertyInput,
} from "@/services/properties/create";

type Props = {
  onSuccess: () => void;
  onCancel: () => void;
};

export default function PropertyForm({
  onSuccess,
  onCancel,
}: Props) {
  const [form, setForm] = useState<CreatePropertyInput>({
    name: "",
    propertyType: "Apartment",
    county: "",
    town: "",
    address: "",
    description: "",
  });

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

      await createProperty(form);

      onSuccess();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <div>
        <label className="mb-2 block text-sm font-medium">
          Property Name
        </label>

        <input
          value={form.name}
          onChange={(e) =>
            updateField("name", e.target.value)
          }
          className="w-full rounded-xl border p-3"
          required
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Property Type
        </label>

        <select
          value={form.propertyType}
          onChange={(e) =>
            updateField(
              "propertyType",
              e.target.value
            )
          }
          className="w-full rounded-xl border p-3"
        >
          <option>Apartment</option>
          <option>Residential</option>
          <option>Commercial</option>
          <option>Mixed Use</option>
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          County
        </label>

        <input
          value={form.county}
          onChange={(e) =>
            updateField("county", e.target.value)
          }
          className="w-full rounded-xl border p-3"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Town
        </label>

        <input
          value={form.town}
          onChange={(e) =>
            updateField("town", e.target.value)
          }
          className="w-full rounded-xl border p-3"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Address
        </label>

        <input
          value={form.address}
          onChange={(e) =>
            updateField("address", e.target.value)
          }
          className="w-full rounded-xl border p-3"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Description
        </label>

        <textarea
          value={form.description}
          onChange={(e) =>
            updateField(
              "description",
              e.target.value
            )
          }
          rows={4}
          className="w-full rounded-xl border p-3"
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border px-5 py-3"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-black px-5 py-3 font-semibold text-white"
        >
          {loading
            ? "Saving..."
            : "Save Property"}
        </button>
      </div>
    </form>
  );
}
