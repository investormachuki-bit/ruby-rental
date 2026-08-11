"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import { useBranding } from "@/contexts/BrandingContext";
import { useAuth } from "@/contexts/AuthContext";

export default function SidebarFooter() {
  const router = useRouter();

  const {
    branding,
  } = useBranding();

  const {
    signOut,
  } = useAuth();

  const whiteLabelEnabled =
    branding?.enable_white_label === true;

  const secondaryColor =
    whiteLabelEnabled &&
    branding?.secondary_color
      ? branding.secondary_color
      : "#232323";

  const footerText =
    whiteLabelEnabled &&
    branding?.footer_text
      ? branding.footer_text
      : "Ruby Rental v1.0";

  async function handleLogout() {
    try {
      await signOut();

      router.replace("/login");
    } catch (error) {
      console.error(
        "Logout failed:",
        error
      );
    }
  }

  return (
    <div
      className="border-t p-4"
      style={{
        borderColor: secondaryColor,
      }}
    >

      <button
        type="button"
        onClick={handleLogout}
        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-gray-300 transition hover:bg-white/10 hover:text-white"
      >
        <LogOut size={18} />

        <span>
          Log Out
        </span>
      </button>

      <p className="mt-3 text-center text-xs text-gray-600">
        {footerText}
      </p>

    </div>
  );
}