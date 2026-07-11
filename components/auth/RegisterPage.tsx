"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/services/auth/register";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    businessName: "",
    fullName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  function update(field: string, value: string) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await register({
        businessName: form.businessName,
        fullName: form.fullName,
        phone: form.phone,
        email: form.email,
        password: form.password,
      });

      alert("Account created successfully.");

      router.push("/login");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="text-4xl font-bold">
          Create Account
        </h1>

        <p className="mt-2 text-gray-500">
          Create your Ruby Rental workspace.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-4"
        >
          <input
            placeholder="Business Name"
            className="w-full rounded-xl border p-3"
            value={form.businessName}
            onChange={(e) =>
              update("businessName", e.target.value)
            }
            required
          />

          <input
            placeholder="Full Name"
            className="w-full rounded-xl border p-3"
            value={form.fullName}
            onChange={(e) =>
              update("fullName", e.target.value)
            }
            required
          />

          <input
            placeholder="Phone Number"
            className="w-full rounded-xl border p-3"
            value={form.phone}
            onChange={(e) =>
              update("phone", e.target.value)
            }
            required
          />

          <input
            type="email"
            placeholder="Email Address"
            className="w-full rounded-xl border p-3"
            value={form.email}
            onChange={(e) =>
              update("email", e.target.value)
            }
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-xl border p-3"
            value={form.password}
            onChange={(e) =>
              update("password", e.target.value)
            }
            required
          />

          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full rounded-xl border p-3"
            value={form.confirmPassword}
            onChange={(e) =>
              update("confirmPassword", e.target.value)
            }
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-black py-3 text-lg font-semibold text-white"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-500">
          Already have an account?{" "}
          <button
            onClick={() => router.push("/login")}
            className="font-semibold text-black"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}
