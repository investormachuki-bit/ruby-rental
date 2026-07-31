import {
  LayoutDashboard,
  Building2,
  Users,
  FileText,
  Wallet,
  BarChart3,
} from "lucide-react";

const modules = [
  {
    icon: LayoutDashboard,
    title: "Smart Dashboard",
    description: "Everything important at a glance.",
  },
  {
    icon: Building2,
    title: "Properties",
    description: "Manage every property from one place.",
  },
  {
    icon: Users,
    title: "Tenants",
    description: "Keep tenant records organized.",
  },
  {
    icon: FileText,
    title: "Leases",
    description: "Track lease agreements effortlessly.",
  },
  {
    icon: Wallet,
    title: "Finance",
    description: "Income, expenses and cash flow.",
  },
  {
    icon: BarChart3,
    title: "Reports",
    description: "Business insights that matter.",
  },
];

export default function Showcase() {
  return (
    <section className="bg-gray-50 py-28">

      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">

          <h2 className="text-5xl font-bold text-gray-900">
            Everything In One Place
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-xl leading-9 text-gray-600">
            Every part of your rental business works together seamlessly.
          </p>

        </div>

        <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {modules.map((module) => {

            const Icon = module.icon;

            return (

              <div
                key={module.title}
                className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
              >

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#D4AF37]/10">

                  <Icon className="h-8 w-8 text-[#B8860B]" />

                </div>

                <h3 className="mt-8 text-2xl font-bold">
                  {module.title}
                </h3>

                <p className="mt-4 text-gray-600">
                  {module.description}
                </p>

                <div className="mt-8 flex h-56 items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50">

                  <span className="text-gray-400">
                    Screenshot Coming Soon
                  </span>

                </div>

              </div>

            );

          })}

        </div>

      </div>

    </section>
  );
}
