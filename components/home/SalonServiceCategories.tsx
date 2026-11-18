
import Link from "next/link";

const categories = [
  {
    id: "haircut-styling",
    title: "Haircut & Styling",
    description: "Beautiful styles made just for you.",
    image:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1000&q=90",
    size: "large",
  },
  {
    id: "hair-coloring",
    title: "Hair Coloring",
    description: "A fresh color, a fresh expression.",
    image:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=90",
    size: "small",
  },
  {
    id: "facial-skincare",
    title: "Facial & Skincare",
    description: "Reveal your natural glow.",
    image:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=90",
    size: "small",
  },
  {
    id: "manicure-pedicure",
    title: "Manicure & Pedicure",
    description: "Care in every little detail.",
    image:
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=900&q=90",
    size: "small",
  },
  {
    id: "hair-treatment",
    title: "Hair Treatment",
    description: "Give your hair the care it deserves.",
    image:
      "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=900&q=90",
    size: "small",
  },
  {
    id: "makeup",
    title: "Makeup",
    description: "Your beauty, your statement.",
    image:
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=1000&q=90",
    size: "large",
  },
  {
    id: "body-spa",
    title: "Body Spa",
    description: "Take a moment just for yourself.",
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=900&q=90",
    size: "small",
  },
  {
    id: "bridal-beauty",
    title: "Bridal Beauty",
    description: "Look unforgettable on your special day.",
    image:
      "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?auto=format&fit=crop&w=900&q=90",
    size: "small",
  },
  {
    id: "eyebrow-beauty",
    title: "Eyebrow Beauty",
    description: "Perfectly shaped, naturally beautiful.",
    image:
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=900&q=90",
    size: "small",
  },
];

export default function SalonServiceCategories() {
  const homepageCategories = categories.slice(0, 9);

  return (
    <section
      id="service-categories"
      className="bg-background-soft px-6 py-16 sm:px-10 sm:py-20 lg:px-12 lg:py-24"
    >
      <div className="mx-auto max-w-7xl">

        {/* Section heading and description */}
        <div className="mb-9 max-w-2xl sm:mb-11">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-accent-brown sm:text-xs">
            Discover Your Beauty
          </p>

          <h2 className="font-heading text-4xl leading-tight text-heading sm:text-5xl lg:text-6xl">
            A world of beauty,
            <span className="block italic">
              curated for you.
            </span>
          </h2>

          <p className="mt-5 max-w-lg text-sm leading-7 text-foreground sm:text-base">
            From everyday elegance to special moments, explore our
            carefully selected beauty and wellness categories.
          </p>
        </div>

        {/* Masonry-style category grid */}
        <div className="grid grid-flow-row-dense grid-cols-1 auto-rows-[8px] gap-x-5 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-6">

          {homepageCategories.map((category, index) => (
            <Link
              key={category.id}
              href={`/services?category=${category.id}`}
              className={`group relative block overflow-hidden ${
                category.size === "large"
                  ? "row-span-[16]"
                  : "row-span-[11]"
              }`}
            >
              {/* Category image */}
              <img
                src={category.image}
                alt={category.title}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Image overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent transition-opacity duration-300 group-hover:from-black/85" />

              {/* Category information */}
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                <p className="mb-2 text-[10px] font-medium tracking-[0.2em] text-white/80">
                  {String(index + 1).padStart(2, "0")}
                </p>

                <h3 className="font-heading text-2xl text-white sm:text-3xl">
                  {category.title}
                </h3>

                <p className="mt-2 text-xs leading-5 text-white/85 sm:text-sm">
                  {category.description}
                </p>
              </div>
            </Link>
          ))}

        </div>

        {/* Explore all categories */}
        <div className="mt-10 flex justify-center">
          <Link
            href="/services"
            className="border-b border-primary pb-2 text-sm font-semibold text-heading transition-colors hover:border-accent-brown hover:text-accent-brown"
          >
            Explore All Categories
            <span className="ml-3">→</span>
          </Link>
        </div>

      </div>
    </section>
  );
}
