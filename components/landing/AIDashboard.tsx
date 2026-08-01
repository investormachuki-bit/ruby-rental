import {
  BrainCircuit,
  TrendingUp,
  CircleDollarSign,
  AlertTriangle,
  Building2,
  CheckCircle2,
} from "lucide-react";

const insights = [
  {
    icon: CheckCircle2,
    title: "18 tenants have paid today",
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    icon: CircleDollarSign,
    title: "KES 482,000 collected this month",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: TrendingUp,
    title: "Collection rate is 94%",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: AlertTriangle,
    title: "3 invoices become overdue tomorrow",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    icon: Building2,
    title: "Apartment B-12 has been vacant for 13 days",
    color: "text-red-600",
    bg: "bg-red-50",
  },
];

export default function AIDashboard() {
  return (
    <section id="ai"
      className="bg-gradient-to-br from-black via-gray-950 to-black py-28"
    >
      <div className="mx-auto max-w-7xl px-6">

        <div className="mx-auto max-w-3xl text-center">

          <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-5 py-2 text-[#D4AF37]">

            <BrainCircuit className="h-5 w-5" />

            Intelligent Business Insights

          </div>

          <h2 className="mt-8 text-5xl font-bold leading-tight text-white">

            Your Rental Business

            <br />

            Explained In Plain English.

          </h2>

          <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-gray-300">

            No confusing reports.

            No accounting jargon.

            Just clear insights that help you make better decisions every day.

          </p>

        </div>

        <div className="mt-20 rounded-[32px] border border-white/10 bg-white/5 p-10 shadow-2xl backdrop-blur">

          <div className="mb-10 flex items-center justify-between">

            <div>

              <h3 className="text-2xl font-bold text-white">

                Good Morning 👋

              </h3>

              <p className="mt-2 text-gray-400">

                Here's what's happening in your business today.

              </p>

            </div>

            <span className="rounded-full bg-green-500/20 px-4 py-2 text-sm font-semibold text-green-400">

              LIVE

            </span>

          </div>

          <div className="grid gap-6 lg:grid-cols-2">

            {insights.map((item) => {

              const Icon = item.icon;

              return (

                <div
                  key={item.title}
                  className="flex items-start gap-5 rounded-2xl border border-white/10 bg-black/30 p-6 transition hover:border-[#D4AF37]"
                >

                  <div className={`rounded-xl p-3 ${item.bg}`}>

                    <Icon className={`h-6 w-6 ${item.color}`} />

                  </div>

                  <div>

                    <h4 className="text-lg font-semibold text-white">

                      {item.title}

                    </h4>

                    <p className="mt-2 text-gray-400">

                      Ruby Rental monitors your business automatically
                      and highlights what deserves your attention.

                    </p>

                  </div>

                </div>

              );

            })}

          </div>

          <div className="mt-12 rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/10 p-8">

            <h3 className="text-2xl font-bold text-[#D4AF37]">

              Spend Less Time Reading Reports.
            </h3>

            <p className="mt-4 text-lg leading-8 text-gray-300">

              Spend more time making decisions.

              Ruby Rental transforms numbers into clear business
              insights so you always know what needs your attention.

            </p>

          </div>

        </div>

      </div>
    </section>
  );
}
