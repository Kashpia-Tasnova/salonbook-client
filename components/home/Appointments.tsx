
import Link from "next/link";

const appointmentSteps = [
  {
    number: "01",
    title: "Choose Your Service",
    description:
      "Explore our beauty treatments and find the service that suits you best.",
  },
  {
    number: "02",
    title: "Pick Your Date & Time",
    description:
      "Choose a convenient appointment time that fits your schedule.",
  },
  {
    number: "03",
    title: "Relax & Enjoy",
    description:
      "Visit our salon and let our beauty professionals take care of you.",
  },
];

export default function Appointments() {
  return (
    <section
      id="appointments"
      className="bg-white px-6 py-12 sm:px-10 sm:py-14 lg:px-12 lg:py-16"
    >
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20">
        {/* Left content */}
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-accent-brown">
            Your Beauty Journey
          </p>

          <h2 className="max-w-lg text-3xl leading-tight text-heading sm:text-4xl lg:text-5xl">
            A Little Time for You,
            <span className="mt-1 block italic">
              A Beautiful Experience.
            </span>
          </h2>

          <p className="mt-5 max-w-md text-sm leading-7 text-foreground sm:text-base">
            Your self-care deserves to be effortless. Book your salon
            appointment in just a few simple steps and get ready for a
            relaxing beauty experience at Blush & Bloom.
          </p>

          <Link
            href="/services"
            className="mt-7 inline-flex items-center gap-3 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-primary-hover"
          >
            Explore Salon Services
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* Right: Appointment steps */}
        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-7 flex items-center justify-between">
            <div>
              <p className="font-heading text-xl text-heading">
                Your Appointment
              </p>
              <p className="mt-1 text-xs text-foreground">
                Three simple steps to feel beautiful
              </p>
            </div>

            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-background-blush text-xl text-accent-brown">
              ✦
            </span>
          </div>

          <div className="space-y-7">
            {appointmentSteps.map((step, index) => (
              <div key={step.number} className="flex gap-5">
                <div className="flex flex-col items-center">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-background-blush font-heading text-sm text-accent-brown">
                    {step.number}
                  </span>

                  {index !== appointmentSteps.length - 1 && (
                    <span className="mt-2 h-full min-h-8 w-px bg-border" />
                  )}
                </div>

                <div className="pb-2">
                  <h3 className="font-heading text-lg text-heading">
                    {step.title}
                  </h3>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-foreground">
                    {step.description}
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
