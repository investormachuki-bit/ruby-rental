"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { WHATSAPP_DEMO_URL } from "@/constants/links";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur">

      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

        <a href="/" className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D4AF37] text-xl font-bold text-black">
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

        <nav className="hidden items-center gap-8 text-sm font-medium text-gray-300 lg:flex">

          <a href="#features" className="hover:text-[#D4AF37]">
            Features
          </a>

          <a href="#pricing" className="hover:text-[#D4AF37]">
            Pricing
          </a>

          <a href="#faq" className="hover:text-[#D4AF37]">
            FAQ
          </a>

          <a href="/login" className="hover:text-[#D4AF37]">
            Login
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

        <button
          onClick={() => setOpen(!open)}
          className="rounded-lg p-2 text-white lg:hidden"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>

      </div>

      {open && (
        <div className="border-t border-white/10 bg-black lg:hidden">

          <div className="flex flex-col p-6">

            <a
              href="#features"
              onClick={() => setOpen(false)}
              className="py-3 text-white"
            >
              Features
            </a>

            <a
              href="#pricing"
              onClick={() => setOpen(false)}
              className="py-3 text-white"
            >
              Pricing
            </a>

            <a
              href="#faq"
              onClick={() => setOpen(false)}
              className="py-3 text-white"
            >
              FAQ
            </a>

            <a
              href="/login"
              className="py-3 text-white"
            >
              Login
            </a>

            <a
              href={WHATSAPP_DEMO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 rounded-xl bg-[#D4AF37] px-6 py-4 text-center font-bold text-black"
            >
              Book a Demo
            </a>

          </div>

        </div>
      )}

    </header>
  );
}
