"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Do I need accounting knowledge to use Ruby Rental?",
    answer:
      "No. Ruby Rental is designed for landlords, not accountants. Everything is presented in a simple, easy-to-understand way.",
  },
  {
    question: "Can I manage multiple properties?",
    answer:
      "Yes. Whether you manage one property or an entire portfolio, Ruby Rental keeps everything organized in one place.",
  },
  {
    question: "Does Ruby Rental work on my phone?",
    answer:
      "Yes. Access your rental business securely from your phone, tablet or computer wherever you are.",
  },
  {
    question: "Can I migrate from Excel or paper records?",
    answer:
      "Absolutely. We'll help you move your properties, tenants and rental information into Ruby Rental during onboarding.",
  },
  {
    question: "Can my caretaker or staff use the system?",
    answer:
      "Yes. You can give employees access based on their roles while keeping full control of your business.",
  },
  {
    question: "How is pricing calculated?",
    answer:
      "Ruby Rental uses simple unit-based pricing. You pay according to the number of rental units you manage, not by limiting features.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-gray-50 py-28">

      <div className="mx-auto max-w-5xl px-6">

        <div className="text-center">

          <span className="rounded-full bg-[#D4AF37]/10 px-4 py-2 text-sm font-semibold text-[#B8860B]">
            Frequently Asked Questions
          </span>

          <h2 className="mt-6 text-5xl font-bold text-gray-900">
            Questions Landlords Often Ask
          </h2>

          <p className="mt-6 text-xl leading-9 text-gray-600">
            Everything you need to know before booking a demo.
          </p>

        </div>

        <div className="mt-16 space-y-5">

          {faqs.map((faq, index) => {

            const expanded = open === index;

            return (

              <div
                key={faq.question}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
              >

                <button
                  onClick={() =>
                    setOpen(expanded ? null : index)
                  }
                  className="flex w-full items-center justify-between px-8 py-6 text-left"
                >

                  <span className="text-lg font-semibold text-gray-900">
                    {faq.question}
                  </span>

                  <ChevronDown
                    className={`transition ${
                      expanded ? "rotate-180" : ""
                    }`}
                  />

                </button>

                {expanded && (

                  <div className="border-t border-gray-100 px-8 py-6 text-lg leading-8 text-gray-600">

                    {faq.answer}

                  </div>

                )}

              </div>

            );

          })}

        </div>

      </div>

    </section>
  );
}
