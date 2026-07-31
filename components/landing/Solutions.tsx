import {
  CreditCard,
  BarChart3,
  Building2,
  ArrowRight,
} from "lucide-react";

const solutions = [
  {
    icon: CreditCard,
    title: "Collect Rent Without the Confusion",
    description:
      "Generate invoices, receive payments, issue professional receipts and automatically keep track of outstanding balances.",
    bullets: [
      "Professional invoices",
      "Payment tracking",
      "Digital receipts",
      "Automatic balances",
    ],
  },
  {
    icon: BarChart3,
    title: "Know Exactly Where Your Money Goes",
    description:
      "Monitor income, expenses, cash flow and financial performance from one simple dashboard.",
    bullets: [
      "Income tracking",
      "Expense management",
      "Cash flow",
      "Financial reports",
    ],
  },
  {
    icon: Building2,
    title: "Manage Your Entire Portfolio",
    description:
      "Properties, units, tenants and leases all work together in one organized system built for growing landlords.",
    bullets: [
      "Properties",
      "Units",
      "Tenants",
      "Leases",
    ],
  },
];

export default function Solutions() {
  return (
    <section className="bg-gray-50 py-28">

      <div className="mx-auto max-w-7xl px-6">

        <div className="mx-auto max-w-3xl text-center">

          <span className="rounded-full bg-[#D4AF37]/10 px-4 py-2 text-sm font-semibold text-[#B8860B]">
            The Ruby Rental Difference
          </span>

          <h2 className="mt-6 text-5xl font-bold text-gray-900">
            What Changes After You Start Using Ruby Rental
          </h2>

          <p className="mt-6 text-xl leading-9 text-gray-600">
            Less paperwork. Less confusion. Better decisions.
            Everything you need to manage your rental business—
            without unnecessary complexity.
          </p>

        </div>

        <div className="mt-20 grid gap-8 lg:grid-cols-3">

          {solutions.map((solution) => {

            const Icon = solution.icon;

            return (

              <div
                key={solution.title}
                className="rounded-3xl border border-gray-200 bg-white p-10 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-[#D4AF37] hover:shadow-2xl"
              >

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#D4AF37]/10">

                  <Icon
                    className="h-8 w-8 text-[#B8860B]"
                  />

                </div>

                <h3 className="mt-8 text-2xl font-bold text-gray-900">
                  {solution.title}
                </h3>

                <p className="mt-5 leading-8 text-gray-600">
                  {solution.description}
                </p>

                <ul className="mt-8 space-y-4">

                  {solution.bullets.map((item) => (

                    <li
                      key={item}
                      className="flex items-center gap-3 text-gray-700"
                    >
                      <ArrowRight
                        className="h-5 w-5 text-[#D4AF37]"
                      />

                      {item}

                    </li>

                  ))}

                </ul>

              </div>

            );

          })}

        </div>

      </div>

    </section>
  );
}
