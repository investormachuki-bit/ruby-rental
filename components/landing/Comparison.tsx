import {
  XCircle,
  CheckCircle2,
} from "lucide-react";

const comparisons = [
  {
    old: "Exercise books and paper records",
    modern: "Live digital dashboard",
  },
  {
    old: "Excel spreadsheets",
    modern: "Automatic reports and analytics",
  },
  {
    old: "Manual receipts",
    modern: "Professional digital receipts",
  },
  {
    old: "Calling caretakers for updates",
    modern: "Real-time property information",
  },
  {
    old: "Guessing rent arrears",
    modern: "Live balances and arrears tracking",
  },
  {
    old: "Searching WhatsApp for payments",
    modern: "Every payment recorded automatically",
  },
  {
    old: "End-of-month confusion",
    modern: "Daily business insights",
  },
  {
    old: "Managing properties",
    modern: "Growing a rental business",
  },
];

export default function Comparison() {
  return (
    <section className="bg-white py-28">

      <div className="mx-auto max-w-7xl px-6">

        <div className="mx-auto max-w-3xl text-center">

          <span className="rounded-full bg-[#D4AF37]/10 px-4 py-2 text-sm font-semibold text-[#B8860B]">
            A Better Way
          </span>

          <h2 className="mt-6 text-5xl font-bold text-gray-900">
            Stop Managing Rentals
            <br />
            Start Managing Your Business
          </h2>

          <p className="mt-6 text-xl leading-9 text-gray-600">
            Ruby Rental replaces paperwork, confusion and guesswork
            with clarity, simplicity and confidence.
          </p>

        </div>

        <div className="mt-20 overflow-hidden rounded-3xl border border-gray-200 shadow-xl">

          <div className="grid grid-cols-2 bg-black text-white">

            <div className="px-8 py-6 text-center text-2xl font-bold">
              Traditional Way
            </div>

            <div className="bg-[#D4AF37] px-8 py-6 text-center text-2xl font-bold text-black">
              Ruby Rental
            </div>

          </div>

          {comparisons.map((row) => (

            <div
              key={row.old}
              className="grid grid-cols-2 border-t border-gray-200"
            >

              <div className="flex items-center gap-4 bg-gray-50 px-8 py-6">

                <XCircle className="h-6 w-6 text-red-500" />

                <span className="text-lg text-gray-700">
                  {row.old}
                </span>

              </div>

              <div className="flex items-center gap-4 bg-white px-8 py-6">

                <CheckCircle2 className="h-6 w-6 text-green-600" />

                <span className="text-lg font-medium text-gray-900">
                  {row.modern}
                </span>

              </div>

            </div>

          ))}

        </div>

        <div className="mt-16 text-center">

          <h3 className="text-4xl font-bold text-gray-900">
            Your rental business deserves better than spreadsheets.
          </h3>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-600">
            Ruby Rental isn't just another property management system.
            It's a modern operating platform designed to help landlords
            spend less time on paperwork and more time growing their
            investments.
          </p>

        </div>

      </div>

    </section>
  );
}
