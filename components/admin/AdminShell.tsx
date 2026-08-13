"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  CreditCard,
  Users,
  Menu,
  X,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";

import { supabase } from "@/lib/supabase";

type AdminShellProps = {
  children: React.ReactNode;
};

const navigation = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Packages",
    href: "/admin/packages",
    icon: Package,
  },
  {
    label: "Subscriptions",
    href: "/admin/subscriptions",
    icon: CreditCard,
  },
  {
    label: "Customers",
    href: "/admin/customers",
    icon: Users,
  },
];

export default function AdminShell({
  children,
}: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [mobileOpen, setMobileOpen] =
    useState(false);

  async function signOut() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  function navigate(href: string) {
    setMobileOpen(false);
    router.push(href);
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-gray-900">

      {/* Mobile overlay */}

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() =>
            setMobileOpen(false)
          }
        />
      )}

      {/* Sidebar */}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex w-72 flex-col
          bg-[#111111] text-white
          shadow-2xl
          transition-transform duration-200
          lg:translate-x-0
          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >

        {/* Brand */}

        <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4AF37] text-xl font-black text-black">
              R
            </div>

            <div>

              <p className="text-sm font-bold tracking-wide">
                RUBY RENTAL
              </p>

              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-gray-400">
                Platform Admin
              </p>

            </div>

          </div>

          <button
            type="button"
            onClick={() =>
              setMobileOpen(false)
            }
            className="rounded-lg p-2 text-gray-400 hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X size={20} />
          </button>

        </div>

        {/* Navigation */}

        <div className="px-4 py-5">

          <div className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
            Platform
          </div>

          <nav className="space-y-1">

            {navigation.map((item) => {

              const Icon = item.icon;

              const active =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(
                      item.href
                    );

              return (
                <button
                  key={item.href}
                  type="button"
                  onClick={() =>
                    navigate(item.href)
                  }
                  className={`
                    flex w-full items-center gap-3
                    rounded-xl px-3 py-3
                    text-left text-sm font-medium
                    transition-colors
                    ${
                      active
                        ? "bg-[#D4AF37] text-black"
                        : "text-gray-300 hover:bg-white/10 hover:text-white"
                    }
                  `}
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              );

            })}

          </nav>

        </div>

        {/* Bottom */}

        <div className="mt-auto border-t border-white/10 p-4">

          <div className="mb-3 flex items-center gap-3 rounded-xl bg-white/5 p-3">

            <ShieldCheck
              size={18}
              className="text-[#D4AF37]"
            />

            <div className="min-w-0">

              <p className="text-xs font-semibold text-white">
                Platform access
              </p>

              <p className="text-[11px] text-gray-500">
                Administrator area
              </p>

            </div>

          </div>

          <button
            type="button"
            onClick={signOut}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white"
          >
            <LogOut size={18} />
            Sign out
          </button>

        </div>

      </aside>

      {/* Main */}

      <div className="min-h-screen lg:pl-72">

        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white/95 px-4 backdrop-blur sm:px-6">

          <button
            type="button"
            onClick={() =>
              setMobileOpen(true)
            }
            className="rounded-xl border border-gray-200 p-2 text-gray-600 hover:bg-gray-50 lg:hidden"
          >
            <Menu size={20} />
          </button>

          <div className="ml-auto flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5">

            <span className="h-2 w-2 rounded-full bg-[#D4AF37]" />

            <span className="text-xs font-semibold text-gray-600">
              Platform Admin
            </span>

          </div>

        </header>

        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>

      </div>

    </div>
  );
}