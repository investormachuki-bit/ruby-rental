"use client";

import { useEffect, useState } from "react";

export type TenantFormValues = {
  fullName: string;
  phone: string;
  email: string;
  idNumber: string;
  occupation: string;
  employer: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  notes: string;
};

type Props = {
  initialValues?: Partial<TenantFormValues>;
  loading?: boolean;
  submitLabel?: string;
  onSubmit: (values: TenantFormValues) => void;
  onCancel: () => void;
};

export default function TenantForm({
  initialValues,
  loading = false,
  submitLabel = "Save Tenant",
  onSubmit,
  onCancel,
}: Props) {

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

  useEffect(() => {

    if (!initialValues) return;

    setFullName(initialValues.fullName ?? "");
    setPhone(initialValues.phone ?? "");
    setEmail(initialValues.email ?? "");
    setIdNumber(initialValues.idNumber ?? "");
    setOccupation(initialValues.occupation ?? "");
    setEmployer(initialValues.employer ?? "");
    setEmergencyContactName(
      initialValues.emergencyContactName ?? ""
    );
    setEmergencyContactPhone(
      initialValues.emergencyContactPhone ?? ""
    );
    setNotes(initialValues.notes ?? "");

  }, [initialValues]);

  function handleSubmit() {

    if (!fullName.trim()) {

      alert("Full name is required.");

      return;

    }

    if (!phone.trim()) {

      alert("Phone number is required.");

      return;

    }

    onSubmit({

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

  }

  return (

    <>

      <div className="space-y-5 p-6">

        <div className="grid gap-5 md:grid-cols-2">

          <div>

            <label className="mb-2 block font-medium">

              Full Name
              <span className="text-red-500"> *</span>

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

              Phone Number
              <span className="text-red-500"> *</span>

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
                setEmergencyContactName(
                  e.target.value
                )
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
                setEmergencyContactPhone(
                  e.target.value
                )
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
          onClick={onCancel}
          disabled={loading}
          className="rounded-xl border px-6 py-3 transition hover:bg-gray-100 disabled:opacity-50"
        >

          Cancel

        </button>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="rounded-xl bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >

          {loading
            ? "Saving..."
            : submitLabel}

        </button>

      </div>

    </>

  );

}
