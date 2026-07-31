import {
  Receipt,
  Phone,
  Calculator,
  MessageCircle,
  BookOpen,
  Search,
} from "lucide-react";

const pains = [
  {
    icon: Receipt,
    title: "Manual Rent Tracking",
    description:
      "Recording rent payments by hand leads to mistakes, missed payments and unnecessary stress.",
  },
  {
    icon: MessageCircle,
    title: "Searching WhatsApp",
    description:
      "Payment confirmations get buried in chats, making reconciliation frustrating and time-consuming.",
  },
  {
    icon: Calculator,
    title: "Excel Everywhere",
    description:
      "Different spreadsheets for every property create confusion instead of clarity.",
  },
  {
    icon: Phone,
    title: "Endless Phone Calls",
    description:
      "Calling caretakers and tenants for updates wastes valuable time every single day.",
  },
  {
    icon: BookOpen,
    title: "Exercise Books",
    description:
      "Paper records are difficult to search, easy to lose and impossible to analyse.",
  },
  {
    icon: Search,
    title: "No Clear Business Picture",
    description:
      "You know money is coming in, but you can't confidently tell where it's going.",
  },
];

export default function PainPoints() {
  return (
    <section className="bg-white py-24" id="features">

      <div className="mx-auto max-w-7xl px-6">

        <div className="mx-auto max-w-3xl text-center">

          <span className="rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-600">
            The Reality Many Landlords Face
          </span>

          <h2 className="mt-6 text-5xl font-bold text-gray-900">
            Does This Sound Familiar?
          </h2>

          <p className="mt-6 text-xl leading-9 text-gray-600">
            Managing rental properties shouldn't mean juggling
            notebooks, spreadsheets, WhatsApp messages and endless
            phone calls.
          </p>

        </div>

        <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {pains.map((pain) => {

            const Icon = pain.icon;

            return (

              <div
                key={pain.title}
                className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-[#D4AF37] hover:shadow-xl"
              >

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">

                  <Icon
                    className="h-7 w-7 text-red-500"
                  />

                </div>

                <h3 className="mt-6 text-2xl font-bold text-gray-900">
                  {pain.title}
                </h3>

                <p className="mt-4 leading-8 text-gray-600">
                  {pain.description}
                </p>

              </div>

            );

          })}

        </div>

        <div className="mt-20 rounded-3xl bg-black px-10 py-16 text-center">

          <h3 className="text-4xl font-bold text-white">
            Your Properties Should Generate Income —
            <span className="text-[#D4AF37]"> Not Stress.</span>
          </h3>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-300">
            Ruby Rental was built to replace scattered records,
            repetitive work and uncertainty with one simple,
            intelligent platform.
          </p>

        </div>

      </div>

    </section>
  );
}
