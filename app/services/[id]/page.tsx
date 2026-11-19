import Link from "next/link";
import { notFound } from "next/navigation";
import BookingForm from "./BookingForm";

const services = [
  {
    id: "hydrafacial",
    name: "HydraFacial",
    category: "Facial & Skincare",
    price: 3500,
    duration: "60 minutes",
    description:
      "Deeply cleanse, exfoliate, and hydrate your skin for a fresh, healthy-looking glow. Our HydraFacial treatment combines advanced skincare technology with a relaxing salon experience.",
    image:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=90",
    benefits: [
      "Deeply cleanses and exfoliates the skin",
      "Helps improve skin hydration",
      "Leaves skin looking fresh and radiant",
      "Suitable for a relaxing skincare session",
    ],
  },
  {
    id: "led-light-facial",
    name: "LED Light Facial",
    category: "Facial & Skincare",
    price: 2500,
    duration: "45 minutes",
    description:
      "Enjoy a relaxing LED light therapy treatment designed to support healthier-looking skin while giving you a peaceful moment of self-care.",
    image:
      "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=1200&q=90",
    benefits: [
      "A relaxing skincare experience",
      "Supports healthier-looking skin",
      "Non-invasive facial treatment",
      "A comfortable self-care session",
    ],
  },
  {
    id: "layer-haircut",
    name: "Layer Haircut",
    category: "Haircut & Styling",
    price: 1200,
    duration: "45 minutes",
    description:
      "Add beautiful movement and shape to your hair with professionally blended layers. Our stylists personalize the cut to complement your preferred look.",
    image:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=90",
    benefits: [
      "Personalized haircut consultation",
      "Professionally blended layers",
      "Adds movement and shape to hair",
      "Finishing and styling included",
    ],
  },
  {
    id: "keratin-treatment",
    name: "Keratin Treatment",
    category: "Hair Treatment",
    price: 5500,
    duration: "120 minutes",
    description:
      "Give your hair a smoother, shinier finish with our professional keratin treatment. Designed to help manage frizz and improve the appearance of your hair.",
    image:
      "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=1200&q=90",
    benefits: [
      "Helps control unwanted frizz",
      "Improves the appearance of shine",
      "Creates a smoother hair finish",
      "Professional salon application",
    ],
  },
  {
    id: "gel-manicure",
    name: "Gel Manicure",
    category: "Manicure & Pedicure",
    price: 1500,
    duration: "45 minutes",
    description:
      "Complete your look with beautifully polished nails and a glossy gel finish. Enjoy a relaxing manicure experience with professional nail care.",
    image:
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1200&q=90",
    benefits: [
      "Professional nail preparation",
      "Nail shaping and cuticle care",
      "Beautiful glossy gel finish",
      "A polished, elegant look",
    ],
  },
  {
    id: "bridal-makeup",
    name: "Bridal Makeup",
    category: "Bridal Beauty",
    price: 8500,
    duration: "90 minutes",
    description:
      "Enjoy a personalized bridal makeup experience designed for your unforgettable day. Our beauty professionals help create a look that complements your style and occasion.",
    image:
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=1200&q=90",
    benefits: [
      "Personalized bridal consultation",
      "Professional makeup application",
      "Look tailored to your occasion",
      "Finishing touches for your special day",
    ],
  },
];

type ServiceDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ServiceDetailsPage({
  params,
}: ServiceDetailsPageProps) {
  const { id } = await params;

  const service = services.find((item) => item.id === id);

  if (!service) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background-soft">
      {/* Breadcrumb */}
      <section className="px-6 pt-8 sm:px-10 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-center gap-2 text-sm text-foreground">
            <Link
              href="/"
              className="transition hover:text-accent-brown"
            >
              Home
            </Link>

            <span>/</span>

            <Link
              href="/services"
              className="transition hover:text-accent-brown"
            >
              Services
            </Link>

            <span>/</span>

            <span className="text-heading">{service.name}</span>
          </div>
        </div>
      </section>

      {/* Service Details */}
      <section className="px-6 py-10 sm:px-10 sm:py-14 lg:px-12 lg:py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Service Image */}
          <div className="overflow-hidden rounded-2xl bg-background-beige">
            <img
              src={service.image}
              alt={service.name}
              className="h-[320px] w-full object-cover sm:h-[450px] lg:h-[550px]"
            />
          </div>

          {/* Service Information */}
          <div className="flex flex-col">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent-brown">
              {service.category}
            </p>

            <h1 className="mt-4 font-heading text-4xl leading-tight text-heading sm:text-5xl">
              {service.name}
            </h1>

            <p className="mt-6 text-sm leading-8 text-foreground sm:text-base">
              {service.description}
            </p>

            {/* Price and Duration */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-border bg-white p-5">
                <p className="text-xs uppercase tracking-wider text-foreground">
                  Service Price
                </p>

                <p className="mt-2 font-heading text-2xl text-heading sm:text-3xl">
                  ৳{service.price.toLocaleString("en-BD")}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-white p-5">
                <p className="text-xs uppercase tracking-wider text-foreground">
                  Duration
                </p>

                <p className="mt-2 font-heading text-xl text-heading sm:text-2xl">
                  {service.duration}
                </p>
              </div>
            </div>

            {/* Benefits */}
            <div className="mt-9">
              <h2 className="font-heading text-2xl text-heading">
                What to Expect
              </h2>

              <ul className="mt-5 space-y-4">
                {service.benefits.map((benefit) => (
                  <li
                    key={benefit}
                    className="flex items-start gap-3 text-sm leading-6 text-foreground"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-background-blush text-xs text-accent-brown">
                      ✓
                    </span>

                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            {/* Appointment Booking Form */}
            <BookingForm
              serviceName={service.name}
              price={service.price}
              duration={service.duration}
            />
          </div>
        </div>
      </section>
    </main>
  );
}