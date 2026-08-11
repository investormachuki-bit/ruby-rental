import Link from "next/link";

import { ArrowRight } from "lucide-react";

import { WHATSAPP_DEMO_URL } from "@/constants/links";

export default function CTA() {
  return (
    <section className="bg-gradient-to-br from-black via-gray-950 to-black py-20 sm:py-24 lg:py-28">

      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">

        <span className="inline-flex rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-4 py-2 text-sm font-semibold text-[#E7C95A] sm:px-5">
          Ready to Simplify Your Rental Business?
        </span>

        <h2 className="mt-7 text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:mt-8 lg:text-6xl">
          Stop Managing Properties.
          <br />
          Start Growing Your Rental Business.
        </h2>

        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-200 sm:mt-8 sm:text-xl sm:leading-9">
          Spend less time chasing rent, searching for records
          and reconciling payments. Spend more time making
          informed decisions and growing your investment.
        </p>

        <div className="mt-9 flex flex-col justify-center gap-3 sm:mt-12 sm:flex-row sm:flex-wrap sm:gap-5">

          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#D4AF37] px-8 py-4 text-base font-bold text-black transition hover:scale-[1.02] hover:bg-[#E0BD4B] hover:shadow-2xl sm:px-10 sm:py-5 sm:text-lg"
          >
            Create Your Account
            <ArrowRight size={20} />
          </Link>

          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-2xl border border-white/25 px-8 py-4 text-base font-semibold text-white transition hover:border-[#D4AF37] hover:text-[#E7C95A] sm:px-10 sm:py-5 sm:text-lg"
          >
            Sign In
          </Link>

          <a
            href={WHATSAPP_DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-2xl border border-white/15 px-8 py-4 text-base font-semibold text-gray-200 transition hover:border-white/30 hover:text-white sm:px-10 sm:py-5 sm:text-lg"
          >
            Book a Demo
          </a>

        </div>

        <p className="mt-8 text-base text-gray-300 sm:mt-10 sm:text-lg">
          Built for landlords who want{" "}
          <span className="font-semibold text-[#E7C95A]">
            clarity, not complexity.
          </span>
        </p>

      </div>

    </section>
  );
}