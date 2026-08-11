import Link from "next/link";

import { ArrowRight, CheckCircle2 } from "lucide-react";

import { WHATSAPP_DEMO_URL } from "@/constants/links";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-black via-gray-950 to-black">

      <div className="mx-auto grid min-h-[88vh] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">

        {/* Hero Copy */}

        <div>

          <span className="inline-flex max-w-full rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-4 py-2 text-center text-sm font-semibold leading-6 text-[#E7C95A]">
            Built for landlords who want clarity, not complexity.
          </span>

          <h1 className="mt-7 text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:mt-8 lg:text-7xl">
            Finally.
            <br />
            Rental Management
            <br />
            That Doesn't Feel
            <br />
            Like Accounting.
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-gray-200 sm:text-xl sm:leading-9 lg:mt-8">
            Know who has paid.
            Track every shilling.
            Stay in control of your rental business —
            all from one beautifully simple dashboard.
          </p>

          <p className="mt-5 max-w-xl text-base leading-7 text-gray-300 sm:text-lg sm:leading-8">
            Ruby Rental helps landlords collect rent,
            manage tenants, monitor finances and make
            better decisions without complicated software.
          </p>

          {/* Main CTAs */}

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4 lg:mt-12">

            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#D4AF37] px-7 py-4 text-base font-bold text-black shadow-lg transition hover:scale-[1.02] hover:bg-[#E0BD4B] hover:shadow-2xl sm:px-8 sm:text-lg"
            >
              Create Your Account
              <ArrowRight size={19} />
            </Link>

            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-2xl border border-white/25 px-7 py-4 text-base font-semibold text-white transition hover:border-[#D4AF37] hover:text-[#E7C95A] sm:px-8 sm:text-lg"
            >
              Sign In
            </Link>

          </div>

          {/* Demo */}

          <div className="mt-4 sm:mt-5">

            <a
              href={WHATSAPP_DEMO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-xl px-2 py-2 text-sm font-medium text-gray-300 transition hover:text-[#E7C95A]"
            >
              Prefer to see it first?{" "}
              <span className="ml-1 font-semibold text-[#E7C95A]">
                Book a Demo →
              </span>
            </a>

          </div>

          {/* Trust Points */}

          <div className="mt-8 grid gap-3 text-sm text-gray-300 sm:grid-cols-3 lg:mt-10 lg:max-w-2xl">

            {[
              "Simple to use",
              "Built for landlords",
              "Manage from your phone",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2"
              >
                <CheckCircle2
                  size={17}
                  className="shrink-0 text-[#D4AF37]"
                />

                <span>{item}</span>
              </div>
            ))}

          </div>

        </div>

        {/* Business Summary */}

        <div className="w-full">

          <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-2xl backdrop-blur sm:p-8">

            <div className="mb-5 flex items-center justify-between gap-4 sm:mb-6">

              <h2 className="text-base font-bold text-white sm:text-xl">
                Today's Business Summary
              </h2>

              <span className="shrink-0 rounded-full bg-green-500/20 px-3 py-1 text-xs font-semibold text-green-300 sm:text-sm">
                Live
              </span>

            </div>

            <div className="space-y-3 sm:space-y-4">

              {[
                "18 tenants have paid today.",
                "Collection rate is 94% this month.",
                "KES 482,000 collected this month.",
                "3 invoices become overdue tomorrow.",
                "Property occupancy is 97%.",
                "Apartment B-12 has been vacant for 13 days.",
              ].map((item) => (

                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-black/30 p-3.5 text-sm leading-6 text-gray-200 sm:p-4"
                >
                  <span className="mr-2 text-[#D4AF37]">
                    ✓
                  </span>
                  {item}
                </div>

              ))}

            </div>

            <p className="mt-7 text-center text-sm leading-6 text-gray-400 sm:mt-8">
              Your rental business explained in plain English.
            </p>

          </div>

        </div>

      </div>

    </section>
  );
}