
import Link from "next/link";

const heroImage =
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=90";

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-background-hero">

      {/* Decorative background circle */}
      <div className="pointer-events-none absolute -left-24 -top-32 h-80 w-80 rounded-full border border-white/30" />

      <div className="relative mx-auto flex max-w-7xl flex-col md:min-h-[480px] md:flex-row lg:min-h-[520px]">

        {/* LEFT: Hero content */}
        <div className="relative z-10 flex w-full flex-col justify-center px-6 py-12 sm:px-10 sm:py-14 md:w-[54%] md:px-10 md:py-10 lg:w-[54%] lg:px-12">

          <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.3em] text-accent-brown sm:text-xs">
            Welcome to Blush & Bloom
          </p>

          <h1 className="max-w-[520px] font-heading text-[38px] leading-[1.15] text-heading sm:text-5xl lg:text-[58px]">
            Discover Your
            <br />
            <span className="italic">Beauty Within.</span>
          </h1>

          <p className="mt-5 max-w-[390px] text-sm leading-7 text-foreground sm:text-base">
            Experience a little luxury, personalized care, and beauty
            treatments designed to make you feel confident and beautiful.
          </p>

          {/* Primary CTA */}
          <div className="mt-7">
            <Link
              href="/services"
              className="inline-flex items-center gap-3 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:bg-primary-hover"
            >
              Explore Salon Services
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          {/* Highlights */}
          <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-medium tracking-wide text-accent-brown sm:gap-x-5 sm:text-xs">
            <span>Expert Care</span>
            <span className="text-accent-nude">✦</span>
            <span>Personal Touch</span>
            <span className="text-accent-nude">✦</span>
            <span>Beautiful Results</span>
          </div>
        </div>

        {/* RIGHT: Desktop image */}
        <div className="relative hidden w-[46%] md:block">
          <img
            src={heroImage}
            alt="Beauty portrait for Blush and Bloom"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />

          <div className="absolute bottom-6 right-6 rounded-full border border-white/50 bg-white/85 px-5 py-3 shadow-sm backdrop-blur-sm">
            <p className="font-heading text-sm italic text-heading">
              Feel beautiful. Be yourself.
            </p>
          </div>
        </div>

        {/* MOBILE: Image below the text */}
        <div className="relative w-full px-5 pb-6 md:hidden">
          <div className="relative h-[280px] w-full overflow-hidden rounded-t-[150px] rounded-b-lg sm:h-[360px]">
            <img
              src={heroImage}
              alt="Beauty portrait for Blush and Bloom"
              className="h-full w-full object-cover object-center"
            />
          </div>
        </div>

      </div>
    </section>
  );
}
