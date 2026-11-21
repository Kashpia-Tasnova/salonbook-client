
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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

// Keep the original homepage categories and their order.
const homepageCategorySlugs = [
  "haircut-and-styling",
  "hair-coloring",
  "facial-and-skincare",
  "manicure-and-pedicure",
  "hair-treatment",
  "makeup",
  "body-spa",
  "bridal-beauty",
];

// Preserve the original larger card positions.
const largeCategorySlugs = [
  "haircut-and-styling",
  "makeup",
];

export default function SalonServiceCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch("/api/protected/categories", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
          signal: controller.signal,
        });

        const data: CategoriesResponse = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Failed to load salon categories."
          );
        }

        const activeCategories = data.categories || [];

        // Display only the original eight homepage categories.
        // Their order remains the same as the previous design.
        const homepageCategories = homepageCategorySlugs
          .map((slug) =>
            activeCategories.find(
              (category) =>
                category.slug === slug && category.isActive
            )
          )
          .filter((category): category is Category => Boolean(category));

        setCategories(homepageCategories);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while loading categories."
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchCategories();

    return () => controller.abort();
  }, []);

  return (
    <section
      id="service-categories"
      className="bg-background-soft px-6 py-14 sm:px-10 sm:py-16 lg:px-12 lg:py-20"
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

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div
                key={item}
                className={`animate-pulse bg-[#E4DBD8] ${
                  item === 1 || item === 6
                    ? "h-64 sm:h-80"
                    : "h-52 sm:h-64"
                }`}
              />
            ))}
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="border border-red-200 bg-red-50 px-5 py-8 text-center">
            <p className="text-sm text-red-700">{error}</p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 bg-[#46322D] px-5 py-2.5 text-sm text-white transition hover:bg-[#967467]"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && categories.length === 0 && (
          <div className="border border-[#E6E1DD] bg-white px-5 py-12 text-center">
            <p className="font-heading text-xl text-[#46322D]">
              Categories Coming Soon
            </p>

            <p className="mt-2 text-sm text-[#7A7470]">
              Our beauty categories will be available here soon.
            </p>
          </div>
        )}

        {/* Masonry-style Category Grid */}
        {!isLoading && !error && categories.length > 0 && (
          <div className="grid grid-flow-row-dense grid-cols-1 auto-rows-[8px] gap-x-5 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-6">

            {categories.map((category, index) => {
              const isLarge = largeCategorySlugs.includes(
                category.slug
              );

              return (
                <Link
                  key={category._id}
                  href={`/services?category=${encodeURIComponent(category.slug)}`}
                  className={`group relative block overflow-hidden ${
                    isLarge
                      ? "row-span-[16]"
                      : "row-span-[11]"
                  }`}
                >
                  {/* Category Image */}
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#E4DBD8]">
                      <span className="font-heading text-2xl text-[#967467]">
                        {category.name}
                      </span>
                    </div>
                  )}

                  {/* Image Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent transition-opacity duration-300 group-hover:from-black/85" />

                  {/* Category Information */}
                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                    <p className="mb-2 text-[10px] font-medium tracking-[0.2em] text-white/80">
                      {String(index + 1).padStart(2, "0")}
                    </p>

                    <h3 className="font-heading text-2xl text-white sm:text-3xl">
                      {category.name}
                    </h3>

                    <p className="mt-2 text-xs leading-5 text-white/85 sm:text-sm">
                      {category.description}
                    </p>
                  </div>
                </Link>
              );
            })}

          </div>
        )}

        {/* Explore All Categories */}
        <div className="mt-12 flex justify-center">
          <Link
            href="/categories"
            className="rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-primary-hover"
          >
            Explore All Categories
          </Link>
        </div>

      </div>
    </section>
  );
}
