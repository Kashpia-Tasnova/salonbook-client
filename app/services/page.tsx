
"use client";

import Link from "next/link";
import { Suspense, useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Service {
  _id: string;
  name: string;
  category: string;
  shortDescription: string;
  description: string;
  image: string;
  price: number;
  duration: number;
  isActive: boolean;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  isActive: boolean;
}

interface CategoriesResponse {
  success: boolean;
  total: number;
  categories: Category[];
  message?: string;
}

function ServicesContent() {
  const searchParams = useSearchParams();

  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [search, setSearch] = useState("");
  const [categoryOverride, setCategoryOverride] = useState<{
    categoryParam: string | null;
    value: string;
  } | null>(null);
  const [sortOrder, setSortOrder] = useState("default");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch active services and categories from the backend.
  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const [servicesResponse, categoriesResponse] =
          await Promise.all([
            fetch(`${API_URL}/api/protected/services`, {
              method: "GET",
              signal: controller.signal,
              cache: "no-store",
            }),
            fetch(`${API_URL}/api/protected/categories`, {
              method: "GET",
              signal: controller.signal,
              cache: "no-store",
            }),
          ]);

        const servicesData = await servicesResponse.json();

        const categoriesData: CategoriesResponse =
          await categoriesResponse.json();

        if (!servicesResponse.ok || !servicesData.success) {
          throw new Error(
            servicesData.message || "Failed to load salon services."
          );
        }

        if (!categoriesResponse.ok || !categoriesData.success) {
          throw new Error(
            categoriesData.message || "Failed to load categories."
          );
        }

        setServices(servicesData.services || []);

        setCategories(
          (categoriesData.categories || []).filter(
            (category) => category.isActive
          )
        );
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while loading services."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => controller.abort();
  }, []);

  // Convert category names into URL-friendly slugs.
  const slugify = (value: string) =>
    value
      .toLowerCase()
      .trim()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  // Read the category from the URL and match it with the database.
  const categoryParam = searchParams.get("category");

  const matchedCategory = categories.find(
    (category) =>
      category.slug.toLowerCase() === categoryParam?.toLowerCase() ||
      slugify(category.name) === categoryParam?.toLowerCase()
  );

  const urlSelectedCategory = matchedCategory?.name || "all";

  // Use the manually selected category when it belongs to the current URL.
  const selectedCategory =
    categoryOverride?.categoryParam === categoryParam
      ? categoryOverride.value
      : urlSelectedCategory;

  // Search, filter and sort services.
  const filteredServices = useMemo(() => {
    let result = services.filter((service) => {
      const matchesSearch = service.name
        .toLowerCase()
        .includes(search.trim().toLowerCase());

      const matchesCategory =
        selectedCategory === "all" ||
        service.category.trim().toLowerCase() ===
          selectedCategory.trim().toLowerCase();

      return matchesSearch && matchesCategory;
    });

    if (sortOrder === "low-to-high") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortOrder === "high-to-low") {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [services, search, selectedCategory, sortOrder]);

  // Clear search and filters.
  const clearFilters = () => {
    setSearch("");
    setCategoryOverride({
      categoryParam: null,
      value: "all",
    });
    setSortOrder("default");

    window.history.replaceState(null, "", "/services");
  };

  const selectedCategoryTitle =
    selectedCategory === "all"
      ? "Beauty & Wellness"
      : selectedCategory;

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
                {selectedCategoryTitle}
              </h2>
            </div>

            {!loading && !error && (
              <p className="text-sm text-foreground">
                Showing {filteredServices.length} of {services.length} Services
              </p>
            )}
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
                onChange={(e) =>
                  setCategoryOverride({
                    categoryParam,
                    value: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-border bg-background-soft px-4 py-3 text-sm text-heading outline-none transition focus:border-primary"
              >
                <option value="all">All Categories</option>

                {categories.map((category) => (
                  <option key={category._id} value={category.name}>
                    {category.name}
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

          {/* Loading State */}
          {loading ? (
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-2xl border border-border bg-white"
                >
                  <div className="aspect-[4/3] animate-pulse bg-background-beige" />

                  <div className="space-y-4 p-5 sm:p-6">
                    <div className="h-6 w-3/4 animate-pulse rounded bg-background-beige" />
                    <div className="h-4 w-full animate-pulse rounded bg-background-beige" />
                    <div className="h-4 w-2/3 animate-pulse rounded bg-background-beige" />
                    <div className="h-10 w-full animate-pulse rounded-full bg-background-beige" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            /* Error State */
            <div className="rounded-2xl border border-border bg-white px-6 py-16 text-center">
              <h3 className="font-heading text-2xl text-heading">
                Unable to Load Services
              </h3>

              <p className="mt-3 text-sm text-foreground">
                {error}
              </p>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-6 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover"
              >
                Try Again
              </button>
            </div>
          ) : filteredServices.length > 0 ? (
            /* Service Cards */
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {filteredServices.map((service) => (
                <article
                  key={service._id}
                  className="group overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* Service Image */}
                  <Link
                    href={`/services/${service._id}`}
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
                      {service.shortDescription || service.description}
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
                          {service.duration} minutes
                        </p>
                      </div>
                    </div>

                    {/* View Details */}
                    <Link
                      href={`/services/${service._id}`}
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
                There are currently no services available in this category,
                or no services match your search. Please explore another category.
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

export default function ServicesPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-background-soft">
          <div className="mx-auto max-w-7xl px-6 py-20 text-center text-foreground">
            Loading services...
          </div>
        </main>
      }
    >
      <ServicesContent />
    </Suspense>
  );
}
