import CTA from "@/components/landing/CTA";
import Features from "@/components/landing/Features";
import Footer from "@/components/landing/Footer";
import Hero from "@/components/landing/Hero";
import Navbar from "@/components/landing/Navbar";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#03050f] text-white">
      <Navbar />

      <main className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.18),transparent_36%),radial-gradient(circle_at_80%_10%,rgba(59,130,246,0.16),transparent_24%),linear-gradient(to_bottom,rgba(255,255,255,0.03),transparent_28%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[42rem] bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent)] [mask-image:linear-gradient(to_bottom,black,transparent)]" />

        <section className="relative mx-auto flex w-full max-w-7xl flex-col gap-24 px-6 pb-24 pt-16 sm:px-8 lg:px-10">
          <Hero />
          <Features />
          <CTA />
        </section>
      </main>

      <Footer />
    </div>
  );
}