"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    async function checkAccess() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          router.replace("/login");
          return;
        }

        const { data, error } = await supabase.rpc(
          "is_platform_admin"
        );

        if (error) {
          console.error(
            "Platform admin check failed:",
            error
          );

          router.replace("/dashboard");
          return;
        }

        if (!data) {
          router.replace("/dashboard");
          return;
        }

        setAuthorized(true);
      } catch (error) {
        console.error(
          "Admin authorization error:",
          error
        );

        router.replace("/dashboard");
      } finally {
        setChecking(false);
      }
    }

    checkAccess();
  }, [router]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#D4AF37]" />

          <p className="mt-4 text-sm font-medium text-gray-600">
            Checking platform access...
          </p>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}