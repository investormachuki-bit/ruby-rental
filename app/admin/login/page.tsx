"use client";

import { FormEvent, useState } from "react";
import {
  LockKeyhole,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setError(null);

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setError(
        "Enter your administrator email and password."
      );
      setLoading(false);
      return;
    }

    /*
     * STEP 1
     * Authenticate with Supabase.
     */
    const {
      data: authData,
      error: loginError,
    } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });

    if (loginError || !authData.user) {
      setError(
        "Invalid administrator email or password."
      );
      setLoading(false);
      return;
    }

    /*
     * STEP 2
     * Verify that the authenticated account
     * is actually a Ruby Rental Platform Admin.
     */
    const {
      data: isAdmin,
      error: adminError,
    } = await supabase.rpc(
      "is_platform_admin"
    );

    if (
      adminError ||
      isAdmin !== true
    ) {
      await supabase.auth.signOut();

      setError(
        "This account does not have Platform Admin access."
      );

      setLoading(false);
      return;
    }

    /*
     * STEP 3
     *
     * Authentication and authorization are both
     * successful.
     *
     * Use a hard navigation instead of router.replace()
     * so Next.js completely reloads the /admin route
     * with the authenticated Supabase session.
     */
    window.location.assign("/admin");
  }

  return (
    <main className="min-h-screen bg-[#f7f7f5] px-5 py-10">

      <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center">

        <div className="w-full max-w-md">

          {/* BRAND */}

          <div className="mb-8 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#111111] shadow-lg">

              <ShieldCheck
                size={29}
                className="text-[#D4AF37]"
              />

            </div>

            <h1 className="mt-5 text-2xl font-bold tracking-tight text-gray-900">
              Ruby Rental
            </h1>

            <p className="mt-1 text-sm font-medium text-[#B8941F]">
              Platform Administration
            </p>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-gray-500">
              Secure access for Ruby Rental
              Platform Administrators.
            </p>

          </div>

          {/* LOGIN CARD */}

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

            <div className="mb-6">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">

                  <LockKeyhole
                    size={18}
                    className="text-gray-700"
                  />

                </div>

                <div>

                  <h2 className="font-semibold text-gray-900">
                    Administrator Login
                  </h2>

                  <p className="text-xs text-gray-400">
                    Restricted access
                  </p>

                </div>

              </div>

            </div>

            {/* ERROR */}

            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700">
                {error}
              </div>
            )}

            {/* FORM */}

            <form
              onSubmit={handleLogin}
              className="space-y-5"
            >

              {/* EMAIL */}

              <div>

                <label
                  htmlFor="admin-email"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Administrator Email
                </label>

                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setError(null);
                  }}
                  placeholder="admin@example.com"
                  autoComplete="username"
                  autoCapitalize="none"
                  spellCheck={false}
                  required
                  disabled={loading}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10 disabled:cursor-not-allowed disabled:bg-gray-50"
                />

              </div>

              {/* PASSWORD */}

              <div>

                <label
                  htmlFor="admin-password"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Password
                </label>

                <input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setError(null);
                  }}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  disabled={loading}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10 disabled:cursor-not-allowed disabled:bg-gray-50"
                />

              </div>

              {/* LOGIN BUTTON */}

              <button
                type="submit"
                disabled={
                  loading ||
                  !email.trim() ||
                  !password
                }
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#111111] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
              >

                {loading ? (
                  <>
                    <RefreshCw
                      size={17}
                      className="animate-spin"
                    />

                    Verifying access...
                  </>
                ) : (
                  <>
                    <LockKeyhole size={17} />

                    Sign in to Admin
                  </>
                )}

              </button>

            </form>

            {/* SECURITY NOTE */}

            <div className="mt-6 flex items-start gap-2 border-t border-gray-100 pt-5">

              <ShieldCheck
                size={15}
                className="mt-0.5 shrink-0 text-[#B8941F]"
              />

              <p className="text-xs leading-5 text-gray-400">
                This area is restricted to
                authorized Ruby Rental Platform
                Administrators. Your account must
                be registered as an active Platform
                Admin.
              </p>

            </div>

          </div>

          <p className="mt-6 text-center text-xs text-gray-400">
            Ruby Rental Platform Administration
          </p>

        </div>

      </div>

    </main>
  );
}