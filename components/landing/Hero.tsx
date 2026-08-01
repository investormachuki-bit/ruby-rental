import { WHATSAPP_DEMO_URL } from "@/constants/links";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-black via-gray-950 to-black">

      <div className="mx-auto grid min-h-[88vh] max-w-7xl items-center gap-16 px-6 py-24 lg:grid-cols-2">

        <div>

          <span className="inline-flex rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-4 py-2 text-sm font-semibold text-[#D4AF37]">
            Built for landlords who want clarity, not complexity.
          </span>

          <h1 className="mt-8 text-5xl font-extrabold leading-tight tracking-tight text-white lg:text-7xl">
            Finally.
            <br />
            Rental Management
            <br />
            That Doesn't Feel
            <br />
            Like Accounting.
          </h1>

          <p className="mt-8 max-w-2xl text-xl leading-9 text-gray-300">
            Know who has paid.
            Track every shilling.
            Stay in control of your rental business—
            all from one beautifully simple dashboard.
          </p>

          <p className="mt-6 max-w-xl text-lg leading-8 text-gray-400">
            Ruby Rental helps landlords collect rent,
            manage tenants, monitor finances and make
            better decisions without complicated software.
          </p>

          <div className="mt-12 flex flex-wrap gap-5">

            <a
              href={WHATSAPP_DEMO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl bg-[#D4AF37] px-8 py-4 text-lg font-bold text-black transition hover:scale-105 hover:shadow-2xl"
            >
              Book a Demo
            </a>

            <a
              href={WHATSAPP_DEMO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl border border-white/20 px-8 py-4 text-lg font-semibold text-white transition hover:border-[#D4AF37] hover:text-[#D4AF37]"
            >
              Chat on WhatsApp
            </a>

          </div>

        </div>

        <div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">

            <div className="mb-6 flex items-center justify-between">

              <h2 className="text-xl font-bold text-white">
                Today's Business Summary
              </h2>

              <span className="rounded-full bg-green-500/20 px-3 py-1 text-sm font-semibold text-green-400">
                Live
              </span>

            </div>

            <div className="space-y-4">

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
                  className="rounded-2xl border border-white/10 bg-black/30 p-4 text-gray-200"
                >
                  ✓ {item}
                </div>

              ))}

            </div>

            <p className="mt-8 text-center text-sm text-gray-500">
              Your rental business explained in plain English.
            </p>

          </div>

        </div>

      </div>

    </section>
  );
}
