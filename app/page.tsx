
export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Temporary homepage preview */}
      <section className="flex min-h-screen flex-col items-center justify-center bg-background-hero px-6 text-center">
        <p className="mb-5 text-sm font-medium uppercase tracking-[0.35em] text-accent-brown">
          Welcome to Blush & Bloom
        </p>

        <h1 className="max-w-3xl text-5xl leading-tight text-heading sm:text-6xl md:text-7xl">
          Beauty begins with a moment for you.
        </h1>

        <p className="mt-6 max-w-xl text-base leading-8 text-foreground sm:text-lg">
          Discover your perfect salon experience. Explore professional beauty
          services and book your next appointment with ease.
        </p>

        <div className="mt-9 flex flex-col gap-4 sm:flex-row">
          <button className="rounded-full bg-primary px-9 py-4 text-sm font-semibold text-white transition-colors duration-300 hover:bg-primary-hover">
            Explore Services
          </button>

          <button className="rounded-full border border-heading/30 px-9 py-4 text-sm font-semibold text-heading transition-colors duration-300 hover:bg-white/50">
            Learn More
          </button>
        </div>

        <div className="mt-16 flex flex-wrap justify-center gap-10 text-sm text-accent-brown">
          <span>✦ Professional Stylists</span>
          <span>✦ Premium Care</span>
          <span>✦ Easy Booking</span>
        </div>
      </section>
    </main>
  );
}
