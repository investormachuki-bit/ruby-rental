"use client";

import { useState } from "react";

import { createTenant } from "@/services/tenants/createTenant";

type Props = {
  onClose: () => void;
  onSaved: () => void;
};

export default function CreateTenantModal({
  onClose,
  onSaved,
}: Props) {
  const [loading, setLoading] =
    useState(false);

  const [fullName, setFullName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [idNumber, setIdNumber] =
    useState("");

  const [occupation, setOccupation] =
    useState("");

  const [employer, setEmployer] =
    useState("");

  const [
    emergencyContactName,
    setEmergencyContactName,
  ] = useState("");

  const [
    emergencyContactPhone,
    setEmergencyContactPhone,
  ] = useState("");

  const [notes, setNotes] =
    useState("");

  async function handleSave() {
    if (!fullName.trim()) {
      alert("Full name is required.");
      return;
    }

    if (!phone.trim()) {
      alert("Phone number is required.");
      return;
    }

    try {
      setLoading(true);

      await createTenant({
        fullName,
        phone,
        email,
        idNumber,
        occupation,
        employer,
        emergencyContactName,
        emergencyContactPhone,
        notes,
      });

      alert(
        "Tenant created successfully."
      );

      onSaved();

    } catch (error: any) {

      alert(error.message);

    } finally {

      setLoading(false);

    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">

      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">

        <div className="border-b p-6">

          <h2 className="text-2xl font-bold">
            Add Tenant
          </h2>

          <p className="mt-2 text-gray-500">
            Create a new tenant profile.
          </p>

        </div>

        <div className="space-y-5 p-6">
                    <div className="grid gap-5 md:grid-cols-2">

            <div>

              <label className="mb-2 block font-medium">
                Full Name <span className="text-red-500">*</span>
              </label>

              <input
                value={fullName}
                onChange={(e) =>
                  setFullName(e.target.value)
                }
                placeholder="John Doe"
                className="w-full rounded-xl border p-3"
              />

            </div>

            <div>

              <label className="mb-2 block font-medium">
                Phone Number <span className="text-red-500">*</span>
              </label>

              <input
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value)
                }
                placeholder="07XXXXXXXX"
                className="w-full rounded-xl border p-3"
              />

            </div>

          </div>

          <div className="grid gap-5 md:grid-cols-2">

            <div>

              <label className="mb-2 block font-medium">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="john@example.com"
                className="w-full rounded-xl border p-3"
              />

            </div>

            <div>

              <label className="mb-2 block font-medium">
                ID Number
              </label>

              <input
                value={idNumber}
                onChange={(e) =>
                  setIdNumber(e.target.value)
                }
                placeholder="National ID"
                className="w-full rounded-xl border p-3"
              />

            </div>

          </div>

          <div className="grid gap-5 md:grid-cols-2">

            <div>

              <label className="mb-2 block font-medium">
                Occupation
              </label>

              <input
                value={occupation}
                onChange={(e) =>
                  setOccupation(e.target.value)
                }
                placeholder="Business Owner"
                className="w-full rounded-xl border p-3"
              />

            </div>

            <div>

              <label className="mb-2 block font-medium">
                Employer
              </label>

              <input
                value={employer}
                onChange={(e) =>
                  setEmployer(e.target.value)
                }
                placeholder="ABC Company Ltd"
                className="w-full rounded-xl border p-3"
              />

            </div>

          </div>

          <div className="grid gap-5 md:grid-cols-2">

            <div>

              <label className="mb-2 block font-medium">
                Emergency Contact Name
              </label>

              <input
                value={emergencyContactName}
                onChange={(e) =>
                  setEmergencyContactName(e.target.value)
                }
                placeholder="Jane Doe"
                className="w-full rounded-xl border p-3"
              />

            </div>

            <div>

              <label className="mb-2 block font-medium">
                Emergency Contact Phone
              </label>

              <input
                value={emergencyContactPhone}
                onChange={(e) =>
                  setEmergencyContactPhone(e.target.value)
                }
                placeholder="07XXXXXXXX"
                className="w-full rounded-xl border p-3"
              />

            </div>

          </div>

          <div>

            <label className="mb-2 block font-medium">
              Notes
            </label>

            <textarea
              rows={4}
              value={notes}
              onChange={(e) =>
                setNotes(e.target.value)
              }
              placeholder="Optional notes..."
              className="w-full rounded-xl border p-3"
            />

          </div>
                  </div>

        <div className="flex justify-end gap-3 border-t p-6">

          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border px-6 py-3"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            className="rounded-xl bg-black px-6 py-3 font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {loading
              ? "Saving..."
              : "Save Tenant"}
          </button>

        </div>

      </div>

    </div>
  );
}
          
