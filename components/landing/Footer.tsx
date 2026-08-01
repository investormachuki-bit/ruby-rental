import Link from "next/link";
import { WHATSAPP_DEMO_URL } from "@/constants/links";

const company = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Book a Demo", href: WHATSAPP_DEMO_URL },
];

const support = [
  { label: "Contact", href: "#contact" },
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
];

export default function Footer() {
  return (
    <footer id="contact" className="bg-black text-white">

      <div className="mx-auto max-w-7xl px-6 py-20">

        <div className="grid gap-12 lg:grid-cols-4">

          <div>

            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#D4AF37] text-xl font-bold text-black">
                R
              </div>

              <div>
                <h2 className="text-2xl font-bold">Ruby Rental</h2>
                <p className="text-sm text-gray-400">
                  Rental Management Platform
                </p>
              </div>

            </div>

            <p className="mt-6 leading-8 text-gray-400">
              Built for landlords who want clarity, not complexity.
              Manage properties, tenants, finances and business performance
              from one beautifully simple platform.
            </p>

          </div>

          <div>

            <h3 className="text-lg font-bold">Product</h3>

            <div className="mt-6 space-y-4">

              {company.map((item) => (

                <Link
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  className="block text-gray-400 transition hover:text-[#D4AF37]"
                >
                  {item.label}
                </Link>

              ))}

            </div>

          </div>

          <div>

            <h3 className="text-lg font-bold">Support</h3>

            <div className="mt-6 space-y-4">

              {support.map((item) => (

                <Link
                  key={item.label}
                  href={item.href}
                  className="block text-gray-400 transition hover:text-[#D4AF37]"
                >
                  {item.label}
                </Link>

              ))}

            </div>

          </div>

          <div>

            <h3 className="text-lg font-bold">Contact</h3>

            <div className="mt-6 space-y-4 text-gray-400">

              <p>Nairobi, Kenya</p>

              <p>info@rubyrental.co.ke</p>

              <p>+254 796 594 295</p>

            </div>

            <a
              href={WHATSAPP_DEMO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-block rounded-xl bg-[#D4AF37] px-6 py-3 font-semibold text-black transition hover:scale-105"
            >
              Book a Demo
            </a>

          </div>

        </div>

        <div className="mt-16 border-t border-white/10 pt-8">

          <div className="flex flex-col items-center justify-between gap-4 text-center text-sm text-gray-500 md:flex-row">

            <p>
              © {new Date().getFullYear()} Ruby Rental. All rights reserved.
            </p>

            <p>
              Designed & Developed by{" "}
              <span className="font-semibold text-[#D4AF37]">
                Rubies Technologies
              </span>
            </p>

          </div>

        </div>

      </div>

    </footer>
  );
}
