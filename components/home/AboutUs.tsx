
const salonValues = [
  {
    number: "01",
    title: "Personalized Care",
    description:
      "Every beauty experience is thoughtfully tailored to your individual needs and preferences.",
  },
  {
    number: "02",
    title: "Expert Attention",
    description:
      "We believe in careful attention to detail and treatments that help you feel your best.",
  },
  {
    number: "03",
    title: "A Moment for You",
    description:
      "Enjoy a welcoming space where you can slow down, relax, and focus on yourself.",
  },
];

export default function AboutUs() {
  return (
    <section
      id="about"
      className="scroll-mt-24 bg-background-blush px-6 py-14 sm:px-8 sm:py-16 lg:px-12 lg:py-20"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-9 lg:grid-cols-2 lg:gap-14">

        {/* Salon Image */}
        <div className="relative mx-auto w-full max-w-md lg:max-w-lg">
          <div className="absolute -left-3 -top-3 h-full w-full border border-primary/40 sm:-left-4 sm:-top-4" />

          <div className="relative aspect-[4/5] overflow-hidden bg-background-beige">
            <img
              src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1000&q=85"
              alt="Beautiful, warmly lit beauty salon interior"
              className="h-full w-full object-cover object-center filter-none"
            />
          </div>
        </div>

        {/* About Content */}
        <div className="lg:py-2">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-accent-brown">
            Get to Know Us
          </p>

          <h2 className="mt-3 max-w-xl text-3xl leading-tight text-heading sm:text-4xl lg:text-5xl">
            A Place Where Beauty Meets
            <span className="italic text-accent-brown">
              {" "}Care & Comfort.
            </span>
          </h2>

          <p className="mt-5 text-sm leading-7 text-foreground sm:text-base">
            Welcome to Blush & Bloom, your space for beauty, relaxation,
            and self-care. We believe that feeling beautiful begins with
            feeling comfortable, confident, and cared for.
          </p>

          <p className="mt-3 text-sm leading-7 text-foreground sm:text-base">
            Our goal is to make every visit a special experience through
            thoughtful service, personalized attention, and a welcoming
            atmosphere. Whether you are refreshing your look or taking
            time to unwind, we want every moment to feel like yours.
          </p>

          {/* Salon Values */}
          <div className="mt-7 space-y-4">
            {salonValues.map((value) => (
              <div
                key={value.number}
                className="flex gap-4 border-b border-accent-nude/50 pb-4 last:border-b-0 last:pb-0"
              >
                <span className="pt-0.5 font-heading text-lg text-primary">
                  {value.number}
                </span>

                <div>
                  <h3 className="text-base font-medium text-heading">
                    {value.title}
                  </h3>

                  <p className="mt-1 max-w-md text-sm leading-6 text-foreground">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
