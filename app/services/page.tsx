
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const services = [
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
  },
];

export default function ServicesPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("default");

  const categories = [...new Set(services.map((service) => service.category))];

  const filteredServices = useMemo(() => {
    let result = services.filter((service) => {
      const matchesSearch = service.name
        .toLowerCase()
        .includes(search.trim().toLowerCase());

      const matchesCategory =
        selectedCategory === "all" ||
        service.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    if (sortOrder === "low-to-high") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortOrder === "high-to-low") {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [search, selectedCategory, sortOrder]);

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("all");
    setSortOrder("default");
  };

  return (
    <main className="min-h-screen bg-background-soft">
      {/* Page Heading */}
      <section className="bg-background-blush px-6 py-16 sm:px-10 sm:py-20 lg:px-12">
        <div className="mx-auto max-w-7xl text-center">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-accent-brown sm:text-xs">
            Blush & Bloom — Our Collection
          </p>

          <h1 className="font-heading text-4xl leading-tight text-heading sm:text-5xl lg:text-6xl">
            Discover Your
            <span className="block italic">Perfect Treatment.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-foreground sm:text-base">
            Explore our thoughtfully selected salon services, created
            to bring out your natural beauty and give you a moment
            to relax and recharge.
          </p>
        </div>
      </section>

      {/* Services Content */}
      <section className="px-6 py-14 sm:px-10 sm:py-16 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-7xl">
          {/* Section Heading */}
          <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent-brown">
                Our Services
              </p>

              <h2 className="mt-2 font-heading text-2xl text-heading sm:text-3xl">
                Beauty & Wellness
              </h2>
            </div>

            <p className="text-sm text-foreground">
              Showing {filteredServices.length} of {services.length} Services
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-10 grid grid-cols-1 gap-4 rounded-2xl border border-border bg-white p-5 sm:grid-cols-2 lg:grid-cols-3">
            {/* Search */}
            <div>
              <label
                htmlFor="service-search"
                className="mb-2 block text-xs font-semibold text-heading"
              >
                Search Services
              </label>

              <div className="relative">
                <input
                  id="service-search"
                  type="text"
                  placeholder="Search by service name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background-soft px-4 py-3 pr-11 text-sm text-heading outline-none transition focus:border-primary"
                />

                {search.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-xl leading-none text-foreground transition hover:bg-background-beige hover:text-heading"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label
                htmlFor="category-filter"
                className="mb-2 block text-xs font-semibold text-heading"
              >
                Filter by Category
              </label>

              <select
                id="category-filter"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full rounded-xl border border-border bg-background-soft px-4 py-3 text-sm text-heading outline-none transition focus:border-primary"
              >
                <option value="all">All Categories</option>

                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Sorting */}
            <div>
              <label
                htmlFor="price-sort"
                className="mb-2 block text-xs font-semibold text-heading"
              >
                Sort by Price
              </label>

              <select
                id="price-sort"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full rounded-xl border border-border bg-background-soft px-4 py-3 text-sm text-heading outline-none transition focus:border-primary"
              >
                <option value="default">Default Order</option>
                <option value="low-to-high">Price: Low to High</option>
                <option value="high-to-low">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Service Cards */}
          {filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {filteredServices.map((service) => (
                <article
                  key={service.id}
                  className="group overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* Service Image */}
                  <Link
                    href={`/services/${service.id}`}
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

                  {/* Service Information */}
                  <div className="p-5 sm:p-6">
                    <h3 className="font-heading text-2xl text-heading transition-colors group-hover:text-accent-brown">
                      {service.name}
                    </h3>

                    <p className="mt-3 min-h-[72px] text-sm leading-6 text-foreground">
                      {service.description}
                    </p>

                    {/* Price and Duration */}
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

                    {/* View Details */}
                    <Link
                      href={`/services/${service.id}`}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-full border border-primary px-5 py-3 text-sm font-semibold text-heading transition-all duration-300 hover:bg-primary hover:text-white"
                    >
                      View Details
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            /* Empty Search Results */
            <div className="rounded-2xl border border-border bg-white px-6 py-16 text-center">
              <h3 className="font-heading text-2xl text-heading">
                No Services Found
              </h3>

              <p className="mt-3 text-sm text-foreground">
                We couldn't find any services matching your search.
                Try another service name or category.
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="mt-6 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
