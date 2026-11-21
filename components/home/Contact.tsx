
const contactDetails = [
  {
    number: "01",
    label: "Email Us",
    value: "hello@blushandbloom.com",
    href: "mailto:hello@blushandbloom.com",
  },
  {
    number: "02",
    label: "Call Us",
    value: "+880 1XXX-XXXXXX",
    href: "tel:+8801XXXXXXXXX",
  },
  {
    number: "03",
    label: "Visit Us",
    value: "Salon address to be announced",
    href: null,
  },
];

export default function Contact() {
  return (
    <section
      id="contact"
      className="scroll-mt-24 bg-background-blush px-6 py-14 sm:px-10 sm:py-16 lg:px-12 lg:py-20"
    >
      <div className="mx-auto max-w-7xl">

        {/* Centered Section Heading */}
        <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-14">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-accent-brown sm:text-xs">
            Your Next Beauty Experience
          </p>

          <h2 className="font-heading text-4xl leading-tight text-heading sm:text-5xl lg:text-6xl">
            We can&apos;t wait
            <span className="block italic">to welcome you.</span>
          </h2>

          <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-foreground sm:text-base">
            A little self-care goes a long way. Get in touch with us
            and let us help you plan a moment that is entirely yours.
          </p>
        </div>

        {/* Wide Image and Appointment Invitation */}
        <div className="grid overflow-hidden bg-white lg:grid-cols-2">

          {/* Image */}
          <div className="relative min-h-[280px] overflow-hidden sm:min-h-[380px] lg:min-h-[440px]">
            <img
              src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=90"
              alt="Elegant beauty salon interior"
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
          </div>

          {/* Invitation Content */}
          <div className="flex flex-col justify-center px-7 py-10 sm:px-12 sm:py-14 lg:px-14">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-accent-brown sm:text-xs">
              A Moment Just for You
            </p>

            <h3 className="mt-5 max-w-md font-heading text-3xl leading-tight text-heading sm:text-4xl lg:text-5xl">
              Make yourself a priority.
            </h3>

            <p className="mt-5 max-w-md text-sm leading-7 text-foreground">
              From refreshing treatments to special occasion beauty,
              discover services thoughtfully designed around you.
              Your little escape to relaxation is just a few clicks away.
            </p>

            <p className="mt-8 border-t border-border pt-5 font-heading text-lg italic text-accent-brown">
              Blush & Bloom — Beauty Salon & Wellness Studio
            </p>
          </div>
        </div>

        {/* Contact Information Cards */}
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
          {contactDetails.map((detail) => (
            <div
              key={detail.number}
              className="border border-accent-nude/40 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:p-7"
            >
              <div className="flex items-center justify-between">
                <span className="font-heading text-2xl italic text-primary">
                  {detail.number}
                </span>

                <span className="h-px w-12 bg-accent-nude" />
              </div>

              <h3 className="mt-5 font-heading text-xl text-heading">
                {detail.label}
              </h3>

              {detail.href ? (
                <a
                  href={detail.href}
                  className="mt-2 inline-block break-words text-sm text-foreground transition-colors hover:text-accent-brown"
                >
                  {detail.value}
                </a>
              ) : (
                <p className="mt-2 text-sm leading-6 text-foreground">
                  {detail.value}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Opening Hours Strip */}
        <div className="mt-10 flex flex-col gap-5 border-t border-accent-nude/50 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-accent-brown">
              Plan Your Visit
            </p>

            <h3 className="mt-2 font-heading text-2xl text-heading">
              Opening Hours
            </h3>
          </div>

          <div className="flex flex-col gap-3 sm:min-w-[390px]">
            <div className="flex items-center justify-between gap-5 text-sm">
              <span className="text-foreground">
                Saturday – Thursday
              </span>

              <span className="font-medium text-heading">
                10 AM – 8 PM
              </span>
            </div>

            <div className="flex items-center justify-between gap-5 border-t border-accent-nude/40 pt-3 text-sm">
              <span className="text-foreground">Friday</span>

              <span className="font-medium text-accent-brown">
                Closed
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
