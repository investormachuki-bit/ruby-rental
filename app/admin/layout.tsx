"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { RefreshCw, ShieldAlert } from "lucide-react";

import { supabase } from "@/lib/supabase";
import AdminShell from "@/components/admin/AdminShell";

type AdminLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({
  children,
}: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  /*
   * The admin login page must NOT use AdminShell
   * and must NOT require an existing admin session.
   */
  const isLoginPage =
    pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setChecking(false);
      setAllowed(false);
      return;
    }

    let mounted = true;

    async function checkAccess() {
      try {
        /*
         * Check authenticated user.
         */
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          router.replace("/admin/login");
          return;
        }

        /*
         * Check Platform Admin permission.
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
          if (mounted) {
            setAllowed(false);
            setChecking(false);
          }

          router.replace("/admin/login");
          return;
        }

        /*
         * Access approved.
         */
        if (mounted) {
          setAllowed(true);
          setChecking(false);
        }
      } catch {
        if (mounted) {
          setAllowed(false);
          setChecking(false);
        }

        router.replace("/admin/login");
      }
    }

    checkAccess();

    return () => {
      mounted = false;
    };
  }, [router, isLoginPage]);

  /*
   * ADMIN LOGIN
   *
   * Keep this page completely separate from
   * the authenticated admin shell.
   */
  if (isLoginPage) {
    return <>{children}</>;
  }

  /*
   * ACCESS CHECK
   */
  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-6">
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

  /*
   * SAFETY FALLBACK
   */
  if (!allowed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-6">

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

  /*
   * VERIFIED PLATFORM ADMIN
   *
   * IMPORTANT:
   * This restores the original dedicated
   * Platform Admin interface.
   */
  return (
    <AdminShell>
      {children}
    </AdminShell>
  );
}