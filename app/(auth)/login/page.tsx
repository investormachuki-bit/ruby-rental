"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";
import { useBranding } from "@/contexts/BrandingContext";

export default function LoginPage() {

  const router = useRouter();

  const {
    branding,
    loading: brandingLoading,
  } = useBranding();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleLogin(
    e: React.FormEvent
  ) {

    e.preventDefault();

    setLoading(true);

    const { error } =
      await supabase.auth.signInWithPassword({

        email,

        password,

      });

    setLoading(false);

    if (error) {

      alert(error.message);

      return;

    }

    router.replace("/");

    router.refresh();

  }

  if (brandingLoading) {

    return (

      <main className="flex min-h-screen items-center justify-center bg-slate-100">

        <div className="h-14 w-14 animate-spin rounded-full border-4 border-[#D4AF37] border-t-transparent" />

      </main>

    );

  }

  const backgroundImage =
    branding?.login_background_url ||
    "";

  const logo =
    branding?.login_logo_url ||
    branding?.logo_url;

  const accentColor =
    branding?.accent_color ||
    "#D4AF37";

  const companyName =
    branding?.company_name ||
    "Ruby Rental";

  const appName =
    branding?.app_name ||
    "Property Management";
    return (

    <main
      className="relative flex min-h-screen items-center justify-center overflow-hidden p-6"
      style={{
        backgroundImage: backgroundImage
          ? `url(${backgroundImage})`
          : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "#0F0F10",
      }}
    >

      {/* Dark Overlay */}

      <div className="absolute inset-0 bg-black/60" />

      {/* Login Card */}

      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-white/95 shadow-2xl backdrop-blur-xl">

        <div
          className="h-2"
          style={{
            background: accentColor,
          }}
        />

        <div className="p-10">

          <div className="mb-8 flex flex-col items-center">

            {logo ? (

              <Image
                src={logo}
                alt={companyName}
                width={96}
                height={96}
                className="mb-5 rounded-2xl object-contain"
              />

            ) : (

              <div
                className="mb-5 flex h-24 w-24 items-center justify-center rounded-2xl text-4xl font-bold text-white"
                style={{
                  background: accentColor,
                }}
              >
                {companyName.charAt(0).toUpperCase()}
              </div>

            )}

            <h1 className="text-center text-3xl font-bold text-gray-900">

              {companyName}

            </h1>

            <p className="mt-2 text-center text-gray-500">

              {appName}

            </p>

            <p className="mt-6 text-center text-sm text-gray-500">

              Sign in to continue to your workspace

            </p>

          </div>

          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >
                        <div>

              <label className="mb-2 block text-sm font-medium text-gray-700">
                Email Address
              </label>

              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="w-full rounded-2xl border border-gray-300 px-4 py-3 transition focus:border-transparent focus:outline-none focus:ring-2"
                style={{
                  ["--tw-ring-color" as any]: accentColor,
                }}
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-700">
                Password
              </label>

              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                className="w-full rounded-2xl border border-gray-300 px-4 py-3 transition focus:border-transparent focus:outline-none focus:ring-2"
                style={{
                  ["--tw-ring-color" as any]: accentColor,
                }}
              />

            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-2xl py-3 text-lg font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
              style={{
                background: accentColor,
              }}
            >
              {loading
                ? "Signing In..."
                : "Sign In"}
            </button>

          </form>

          <div className="mt-8 text-center text-sm text-gray-500">

            Don't have an account?{" "}

            <Link
              href="/register"
              className="font-semibold hover:underline"
              style={{
                color: accentColor,
              }}
            >
              Create Account
            </Link>

          </div>

          {!branding?.remove_ruby_branding && (

            <div className="mt-8 border-t pt-6 text-center text-xs text-gray-400">

              Powered by <span className="font-semibold">
                Rubies Technologies
              </span>

            </div>

          )}

        </div>

      </div>

    </main>

  );

}
  
