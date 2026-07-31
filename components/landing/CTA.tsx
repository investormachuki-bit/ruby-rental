export default function CTA() {
  return (
    <section className="bg-gradient-to-br from-black via-gray-950 to-black py-28">

      <div className="mx-auto max-w-5xl px-6 text-center">

        <span className="inline-flex rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-5 py-2 text-sm font-semibold text-[#D4AF37]">
          Ready to Simplify Your Rental Business?
        </span>

        <h2 className="mt-8 text-5xl font-extrabold leading-tight text-white lg:text-6xl">

          Stop Managing Properties.

          <br />

          Start Growing Your Rental Business.

        </h2>

        <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-gray-300">

          Spend less time chasing rent, searching for records and
          reconciling payments.

          Spend more time making informed decisions and growing
          your investment.

        </p>

        <div className="mt-12 flex flex-wrap justify-center gap-5">

          <button className="rounded-2xl bg-[#D4AF37] px-10 py-5 text-lg font-bold text-black transition duration-300 hover:scale-105 hover:shadow-2xl">

            Book a Demo

          </button>

          <button className="rounded-2xl border border-white/20 px-10 py-5 text-lg font-semibold text-white transition hover:border-[#D4AF37] hover:text-[#D4AF37]">

            Contact Sales

          </button>

        </div>

        <p className="mt-10 text-lg text-gray-400">

          Built for landlords who want

          <span className="font-semibold text-[#D4AF37]">
            {" "}clarity, not complexity.
          </span>

        </p>

      </div>

    </section>
  );
}
