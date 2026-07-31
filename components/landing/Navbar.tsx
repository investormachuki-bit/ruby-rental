"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl max-w-screen-2xl items-center justify-between px-6">

        <Link
          href="/"
          className="flex items-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-black text-lg font-bold text-[#D4AF37]">
            R
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-black">
              Ruby Rental
            </h1>

            <p className="text-xs text-gray-500">
              Built for landlords who want clarity, not complexity.
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">

          <a
            href="#features"
            className="text-sm font-medium text-gray-700 transition hover:text-[#D4AF37]"
          >
            Features
          </a>

          <a
            href="#pricing"
            className="text-sm font-medium text-gray-700 transition hover:text-[#D4AF37]"
          >
            Pricing
          </a>

          <a
            href="#why"
            className="text-sm font-medium text-gray-700 transition hover:text-[#D4AF37]"
          >
            Why Ruby Rental
          </a>

          <a
            href="#contact"
            className="text-sm font-medium text-gray-700 transition hover:text-[#D4AF37]"
          >
            Contact
          </a>

        </nav>

        <button className="rounded-xl bg-[#D4AF37] px-6 py-3 font-semibold text-black shadow transition duration-300 hover:scale-105 hover:shadow-xl">
          Book a Demo
        </button>

      </div>
    </header>
  );
}
