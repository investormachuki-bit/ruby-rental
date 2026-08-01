import { Check } from "lucide-react";
import { WHATSAPP_DEMO_URL } from "@/constants/links";

const plans = [
  {
    name: "Starter",
    units: "1–20 Units",
    description: "Perfect for individual landlords and small portfolios.",
    featured: false,
  },
  {
    name: "Growth",
    units: "21–100 Units",
    description: "Built for growing property businesses managing multiple properties.",
    featured: true,
  },
  {
    name: "Enterprise",
    units: "100+ Units",
    description: "Custom solutions for large portfolios with dedicated onboarding.",
    featured: false,
  },
];

const features = [
  "Unlimited users",
  "Property & Unit Management",
  "Tenant Management",
  "Lease Management",
  "Rent Collection",
  "Invoices & Receipts",
  "Expense Tracking",
  "Financial Reports",
  "AI Business Insights",
  "Cloud Backup",
];

export default function Pricing() {
  return (
    <section id="pricing" className="bg-white py-28">

      <div className="mx-auto max-w-7xl px-6">

        <div className="mx-auto max-w-3xl text-center">

          <span className="rounded-full bg-[#D4AF37]/10 px-4 py-2 text-sm font-semibold text-[#B8860B]">
            Simple Pricing
          </span>

          <h2 className="mt-6 text-5xl font-bold text-gray-900">
            Pay Based On Your Portfolio.
          </h2>

          <p className="mt-6 text-xl leading-9 text-gray-600">
            Every customer gets the complete Ruby Rental platform.
            Pricing only changes based on the number of rental units
            you manage.
          </p>

        </div>

        <div className="mt-20 grid gap-8 lg:grid-cols-3">

          {plans.map((plan) => (

            <div
              key={plan.name}
              className={`rounded-3xl border p-10 shadow-lg transition hover:-translate-y-2 hover:shadow-2xl ${
                plan.featured
                  ? "border-[#D4AF37] bg-black text-white"
                  : "border-gray-200 bg-white"
              }`}
            >

              {plan.featured && (
                <div className="mb-6 inline-flex rounded-full bg-[#D4AF37] px-4 py-2 text-sm font-bold text-black">
                  Most Popular
                </div>
              )}

              <h3 className="text-3xl font-bold">
                {plan.name}
              </h3>

              <p className="mt-3 text-xl font-semibold text-[#D4AF37]">
                {plan.units}
              </p>

              <p className="mt-5 leading-8 text-gray-400">
                {plan.description}
              </p>

              <div className="my-10 h-px bg-white/10" />

              <div className="space-y-4">

                {features.map((feature) => (

                  <div
                    key={feature}
                    className="flex items-center gap-3"
                  >
                    <Check className="h-5 w-5 text-[#D4AF37]" />

                    <span>{feature}</span>

                  </div>

                ))}


              </div>
              <a
                href={WHATSAPP_DEMO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-10 block w-full rounded-2xl bg-[#D4AF37] px-6 py-4 text-center font-bold text-black transition hover:scale-105"
              >
                Book a Demo
              </a>

            </div>

          ))}

        </div>

        <p className="mt-12 text-center text-lg text-gray-500">
          Need a custom deployment for a larger portfolio?
          <span className="font-semibold text-black">
            {" "}Let's talk.
          </span>
        </p>

      </div>

    </section>
  );
}
