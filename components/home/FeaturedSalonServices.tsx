
import Link from "next/link";

const featuredServices = [
  {
    id: "hydrafacial",
    name: "HydraFacial",
    category: "Facial & Skincare",
    price: 3500,
    duration: "60 minutes",
    description:
      "Deeply cleanse, exfoliate, and hydrate your skin for a fresh, healthy-looking glow.",
    image:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=90",
    isActive: true,
  },
  {
    id: "led-light-facial",
    name: "LED Light Facial",
    category: "Facial & Skincare",
    price: 2500,
    duration: "45 minutes",
    description:
      "Enjoy a relaxing LED light therapy treatment for healthier-looking skin.",
    image:
      "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=900&q=90",
    isActive: true,
  },
  {
    id: "layer-haircut",
    name: "Layer Haircut",
    category: "Haircut & Styling",
    price: 1200,
    duration: "45 minutes",
    description:
      "Add beautiful movement and shape to your hair with professionally blended layers.",
    image:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=900&q=90",
    isActive: true,
  },
  {
    id: "keratin-treatment",
    name: "Keratin Treatment",
    category: "Hair Treatment",
    price: 5500,
    duration: "120 minutes",
    description:
      "Give your hair a smoother, shinier finish while helping control unwanted frizz.",
    image:
      "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=900&q=90",
    isActive: true,
  },
  {
    id: "gel-manicure",
    name: "Gel Manicure",
    category: "Manicure & Pedicure",
    price: 1500,
    duration: "45 minutes",
    description:
      "Complete your look with beautifully polished nails and a glossy gel finish.",
    image:
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=900&q=90",
    isActive: true,
  },
  {
    id: "bridal-makeup",
    name: "Bridal Makeup",
    category: "Bridal Beauty",
    price: 8500,
    duration: "90 minutes",
    description:
      "A personalized bridal makeup experience designed for your unforgettable day.",
    image:
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=900&q=90",
    isActive: true,
  },
];

export default function FeaturedSalonServices() {
  // Display only active services.
  const activeServices = featuredServices.filter(
    (service) => service.isActive
  );

  return (
    <section
      id="featured-services"
      className="bg-background-soft px-6 py-16 sm:px-10 sm:py-20 lg:px-12 lg:py-24"
    >
      <div className="mx-auto max-w-7xl">

        {/* Section heading */}
        <div className="mb-10 sm:mb-12">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-accent-brown sm:text-xs">
            Our Featured Treatments
          </p>

          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="font-heading text-4xl leading-tight text-heading sm:text-5xl lg:text-6xl">
                Beauty favorites,
                <span className="block italic">
                  chosen for you.
                </span>
              </h2>

              <p className="mt-5 max-w-lg text-sm leading-7 text-foreground sm:text-base">
                Discover our most-loved salon treatments, thoughtfully
                designed to bring out your natural beauty.
              </p>
            </div>
          </div>
        </div>

        {/* Featured service cards */}
        {activeServices.length > 0 ? (
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {activeServices.map((service) => (
              <article
                key={service.id}
                className="group overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Service image */}
                <Link
                  href={`/services?service=${service.id}`}
                  className="relative block aspect-[4/3] overflow-hidden"
                >
                  <img
                    src={service.image}
                    alt={service.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  <span className="absolute left-4 top-4 rounded-full bg-white/90 px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-accent-brown backdrop-blur-sm">
                    {service.category}
                  </span>
                </Link>

                {/* Service information */}
                <div className="p-5 sm:p-6">
                  <h3 className="font-heading text-2xl text-heading transition-colors group-hover:text-accent-brown">
                    {service.name}
                  </h3>

                  <p className="mt-3 min-h-[72px] text-sm leading-6 text-foreground">
                    {service.description}
                  </p>

                  {/* Price and duration */}
                  <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-foreground">
                        Price
                      </p>
                      <p className="mt-1 text-lg font-semibold text-heading">
                        ৳{service.price.toLocaleString("en-BD")}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-wider text-foreground">
                        Duration
                      </p>
                      <p className="mt-1 text-sm font-medium text-heading">
                        {service.duration}
                      </p>
                    </div>
                  </div>

                  {/* View details button */}
                  <Link
                    href={`/services?service=${service.id}`}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-full border border-primary px-5 py-3 text-sm font-semibold text-heading transition-all duration-300 hover:bg-primary hover:text-white"
                  >
                    View Details
                    <span>→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="py-12 text-center text-sm text-foreground">
            No featured services are currently available.
          </p>
        )}

        {/* Explore all services */}
        <div className="mt-12 flex justify-center">
          <Link
            href="/services"
            className="rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-primary-hover"
          >
            Explore All Services
          </Link>
        </div>

      </div>
    </section>
  );
}
