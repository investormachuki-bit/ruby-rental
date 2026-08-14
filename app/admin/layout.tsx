"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, ShieldAlert } from "lucide-react";

import { supabase } from "@/lib/supabase";

type AdminLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({
  children,
}: AdminLayoutProps) {
  const router = useRouter();

  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function checkAccess() {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          router.replace("/admin/login");
          return;
        }

        const { data, error } =
          await supabase.rpc("is_platform_admin");

        if (
          error ||
          data !== true
        ) {
          if (mounted) {
            setAllowed(false);
            setChecking(false);
          }

          router.replace("/admin/login");
          return;
        }

        if (mounted) {
          setAllowed(true);
          setChecking(false);
        }
      } catch {
        router.replace("/admin/login");
      }
    }

    checkAccess();

    return () => {
      mounted = false;
    };
  }, [router]);

  if (checking) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-6">

        <div className="text-center">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D4AF37]/10">

            <RefreshCw
              size={22}
              className="animate-spin text-[#B8941F]"
            />

          </div>

          <p className="mt-4 text-sm font-semibold text-gray-900">
            Verifying administrator access...
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Please wait.
          </p>

        </div>

      </div>
    );
  }

  if (!allowed) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-6">

        <div className="max-w-md text-center">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">

            <ShieldAlert
              size={24}
              className="text-red-600"
            />

          </div>

          <h1 className="mt-5 text-xl font-bold text-gray-900">
            Access Restricted
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            This area is restricted to Ruby Rental
            Platform Administrators.
          </p>

        </div>

      </div>
    );
  }

  return <>{children}</>;
}