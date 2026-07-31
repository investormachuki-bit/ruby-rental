import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import PainPoints from "@/components/landing/PainPoints";
import Solutions from "@/components/landing/Solutions";
import AIDashboard from "@/components/landing/AIDashboard";
import Comparison from "@/components/landing/Comparison";
import Showcase from "@/components/landing/Showcase";
import Pricing from "@/components/landing/Pricing";
import FAQ from "@/components/landing/FAQ";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <PainPoints />
      <Solutions />
      <AIDashboard />
      <Comparison />
      <Showcase />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
