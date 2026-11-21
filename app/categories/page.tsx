
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

// Keep the homepage category order first.
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

// Keep the same large card positions as the homepage.
const largeCategorySlugs = [
  "haircut-and-styling",
  "makeup",
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    const loadCategories = async () => {
      try {
        const response = await fetch("/api/protected/categories", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
          signal: controller.signal,
        });

        const data: CategoriesResponse = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Failed to load categories."
          );
        }

        const activeCategories = (data.categories || []).filter(
          (category) => category.isActive
        );

        // Display the original eight categories first,
        // followed by every other active category.
        const orderedHomepageCategories = homepageCategorySlugs
          .map((slug) =>
            activeCategories.find(
              (category) => category.slug === slug
            )
          )
          .filter(
            (category): category is Category => Boolean(category)
          );

        const additionalCategories = activeCategories.filter(
          (category) =>
            !homepageCategorySlugs.includes(category.slug)
        );

        setCategories([
          ...orderedHomepageCategories,
          ...additionalCategories,
        ]);
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

    void loadCategories();

    return () => {
      controller.abort();
    };
  }, [retryCount]);

  const handleRetry = () => {
    setError("");
    setIsLoading(true);
    setRetryCount((previous) => previous + 1);
  };

  return (
    <main className="bg-background-soft px-6 py-14 sm:px-10 sm:py-16 lg:px-12 lg:py-20">
      <div className="mx-auto max-w-7xl">

        {/* Page Heading */}
        <div className="mb-9 max-w-2xl sm:mb-11">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-accent-brown sm:text-xs">
            Blush & Bloom Beauty Studio
          </p>

          <h1 className="font-heading text-4xl leading-tight text-heading sm:text-5xl lg:text-6xl">
            Explore all categories,
            <span className="block italic">
              curated for you.
            </span>
          </h1>

          <p className="mt-5 max-w-lg text-sm leading-7 text-foreground sm:text-base">
            Discover our complete collection of beauty and
            wellness categories. Find the perfect treatment
            for your beauty needs.
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-flow-row-dense grid-cols-1 auto-rows-[8px] gap-x-5 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className={`animate-pulse bg-[#E4DBD8] ${
                  index === 0 || index === 5
                    ? "row-span-[16]"
                    : "row-span-[11]"
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
              onClick={handleRetry}
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

        {/* Categories Grid */}
        {!isLoading && !error && categories.length > 0 && (
          <div className="grid grid-flow-row-dense grid-cols-1 auto-rows-[8px] gap-x-5 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-6">

            {categories.map((category, index) => {
              const isLarge = largeCategorySlugs.includes(
                category.slug
              );

              return (
                <Link
                  key={category._id}
                  href={`/services?category=${encodeURIComponent(
                    category.slug
                  )}`}
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

                    <h2 className="font-heading text-2xl text-white sm:text-3xl">
                      {category.name}
                    </h2>

                    <p className="mt-2 text-xs leading-5 text-white/85 sm:text-sm">
                      {category.description}
                    </p>
                  </div>
                </Link>
              );
            })}

          </div>
        )}
      </div>
    </main>
  );
}
