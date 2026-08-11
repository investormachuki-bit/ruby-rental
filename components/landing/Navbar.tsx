"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { WHATSAPP_DEMO_URL } from "@/constants/links";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/90 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6">

        {/* Logo */}

        <a
          href="/"
          className="flex items-center gap-3"
          onClick={() => setOpen(false)}
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#D4AF37] text-xl font-bold text-black">
            R
          </div>

          <div>
            <h1 className="text-lg font-bold text-white">
              Ruby Rental
            </h1>

            <p className="text-xs text-gray-400">
              Rental Management Platform
            </p>
          </div>
        </a>

        {/* Desktop Navigation */}

        <nav className="hidden items-center gap-8 text-sm font-medium text-gray-300 lg:flex">

          <a
            href="#features"
            className="transition hover:text-[#D4AF37]"
          >
            Features
          </a>

          <a
            href="#pricing"
            className="transition hover:text-[#D4AF37]"
          >
            Pricing
          </a>

          <a
            href="#faq"
            className="transition hover:text-[#D4AF37]"
          >
            FAQ
          </a>

          <a
            href="/login"
            className="transition hover:text-[#D4AF37]"
          >
            Login
          </a>

          <a
            href="/register"
            className="rounded-xl border border-[#D4AF37] px-5 py-3 font-semibold text-[#D4AF37] transition hover:bg-[#D4AF37] hover:text-black"
          >
            Create Account
          </a>

          <a
            href={WHATSAPP_DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-[#D4AF37] px-6 py-3 font-semibold text-black transition hover:scale-105"
          >
            Book a Demo
          </a>

        </nav>

        {/* Mobile Menu Button */}

        <button
          type="button"
          aria-label={
            open
              ? "Close navigation menu"
              : "Open navigation menu"
          }
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="rounded-xl p-2 text-white transition hover:bg-white/10 lg:hidden"
        >
          {open ? (
            <X size={28} />
          ) : (
            <Menu size={28} />
          )}
        </button>

      </div>

      {/* Mobile Navigation */}

      {open && (
        <div className="border-t border-white/10 bg-black lg:hidden">

          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-5 sm:px-6">

            <a
              href="#features"
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-3 text-base font-medium text-gray-200 transition hover:bg-white/5 hover:text-[#D4AF37]"
            >
              Features
            </a>

            <a
              href="#pricing"
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-3 text-base font-medium text-gray-200 transition hover:bg-white/5 hover:text-[#D4AF37]"
            >
              Pricing
            </a>

            <a
              href="#faq"
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-3 text-base font-medium text-gray-200 transition hover:bg-white/5 hover:text-[#D4AF37]"
            >
              FAQ
            </a>

            <div className="my-3 border-t border-white/10" />

            <a
              href="/login"
              onClick={() => setOpen(false)}
              className="rounded-xl border border-white/20 px-4 py-3 text-center font-semibold text-white transition hover:border-[#D4AF37] hover:text-[#D4AF37]"
            >
              Sign In
            </a>

            <a
              href="/register"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-xl bg-[#D4AF37] px-4 py-3 text-center font-bold text-black transition hover:opacity-90"
            >
              Create Your Account
            </a>

            <a
              href={WHATSAPP_DEMO_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-xl border border-[#D4AF37] px-4 py-3 text-center font-semibold text-[#D4AF37] transition hover:bg-[#D4AF37] hover:text-black"
            >
              Book a Demo
            </a>

          </div>

        </div>
      )}
    </header>
  );
}