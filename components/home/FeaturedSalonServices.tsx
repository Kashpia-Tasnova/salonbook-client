
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface SalonService {
  _id: string;
  name: string;
  category: string | { name: string };
  shortDescription?: string;
  description?: string;
  image?: string;
  price: number;
  duration: number;
  isActive: boolean;
}

export default function FeaturedSalonServices() {
  const [services, setServices] = useState<SalonService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchServices = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/protected/services`,
          {
            cache: "no-store",
            signal: controller.signal,
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load featured services."
          );
        }

        const allServices: SalonService[] =
          data.services || data.data?.services || [];

        const activeServices = allServices.filter(
          (service) => service.isActive
        );

        setServices(activeServices.slice(0, 6));
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong."
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchServices();

    return () => controller.abort();
  }, []);

  return (
    <section
      id="featured-services"
      className="bg-background-beige px-6 py-14 sm:px-10 sm:py-16 lg:px-12 lg:py-20"
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

        {/* Loading skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse overflow-hidden rounded-2xl border border-border bg-white"
              >
                <div className="aspect-[4/3] bg-background-blush" />

                <div className="space-y-4 p-5 sm:p-6">
                  <div className="h-7 w-3/4 rounded bg-background-blush" />
                  <div className="h-4 w-full rounded bg-background-blush" />
                  <div className="h-4 w-2/3 rounded bg-background-blush" />

                  <div className="flex justify-between border-t border-border pt-4">
                    <div className="h-10 w-20 rounded bg-background-blush" />
                    <div className="h-10 w-20 rounded bg-background-blush" />
                  </div>

                  <div className="h-11 rounded-full bg-background-blush" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error message */}
        {!isLoading && error && (
          <p className="py-12 text-center text-sm text-red-600">
            {error}
          </p>
        )}

        {/* Featured service cards */}
        {!isLoading && !error && services.length > 0 && (
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {services.map((service) => {
              const categoryName =
                typeof service.category === "string"
                  ? service.category
                  : service.category?.name || "Uncategorized";

              return (
                <article
                  key={service._id}
                  className="group overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* Service image */}
                  <Link
                    href={`/services/${service._id}`}
                    className="relative block aspect-[4/3] overflow-hidden bg-background-blush"
                    aria-label={`View ${service.name} details`}
                  >
                    {service.image ? (
                      <img
                        src={service.image}
                        alt={service.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-foreground">
                        No image available
                      </div>
                    )}

                    <span className="absolute left-4 top-4 rounded-full bg-white/90 px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-accent-brown backdrop-blur-sm">
                      {categoryName}
                    </span>
                  </Link>

                  {/* Service information */}
                  <div className="p-5 sm:p-6">
                    <h3 className="font-heading text-2xl text-heading transition-colors group-hover:text-accent-brown">
                      {service.name}
                    </h3>

                    <p className="mt-3 min-h-[72px] text-sm leading-6 text-foreground">
                      {service.shortDescription ||
                        service.description ||
                        "Discover this treatment at Blush & Bloom."}
                    </p>

                    {/* Price and duration */}
                    <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-foreground">
                          Price
                        </p>

                        <p className="mt-1 text-lg font-semibold text-heading">
                          ${service.price.toLocaleString("en-BD")}
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

                    {/* View details */}
                    <Link
                      href={`/services/${service._id}`}
                      aria-label={`View details for ${service.name}`}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-full border border-primary px-5 py-3 text-sm font-semibold text-heading transition-all duration-300 hover:bg-primary hover:text-white"
                    >
                      View Details
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && services.length === 0 && (
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
