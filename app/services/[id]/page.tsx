
"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import BookingForm from "./BookingForm";

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
  whatToExpect?: string[];
  isActive: boolean;
}

export default function ServiceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: session, isPending: isSessionLoading } = useSession();

  const isAuthenticated = !!session?.user;

  const [service, setService] = useState<SalonService | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showBooking, setShowBooking] = useState(false);

  // Redirect visitors who are not logged in.
  useEffect(() => {
    if (!isSessionLoading && !isAuthenticated) {
      router.replace(
        `/signin?redirect=${encodeURIComponent(`/services/${id}`)}`
      );
    }
  }, [isSessionLoading, isAuthenticated, id, router]);

  // Fetch service details only after authentication.
  useEffect(() => {
    if (isSessionLoading || !isAuthenticated || !id) {
      return;
    }

    const controller = new AbortController();

    const fetchService = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/protected/services`,
          {
            cache: "no-store",
            signal: controller.signal,
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load service.");
        }

        const services: SalonService[] =
          data.services || data.data?.services || [];

        const foundService = services.find(
          (item) => item._id === id
        );

        if (!foundService) {
          throw new Error("Service not found.");
        }

        setService(foundService);
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

    fetchService();

    return () => controller.abort();
  }, [id, isAuthenticated, isSessionLoading]);

  // Show loading while checking authentication or redirecting.
  if (isSessionLoading || !isAuthenticated || isLoading) {
    return (
      <main className="min-h-screen bg-background-soft px-6 py-16">
        <div className="mx-auto max-w-7xl animate-pulse space-y-6">
          <div className="h-4 w-48 rounded bg-background-blush" />

          <div className="grid gap-10 lg:grid-cols-2">
            <div className="h-[450px] rounded-2xl bg-background-blush" />

            <div className="space-y-5">
              <div className="h-5 w-40 rounded bg-background-blush" />
              <div className="h-12 w-3/4 rounded bg-background-blush" />
              <div className="h-24 rounded bg-background-blush" />
              <div className="h-24 rounded bg-background-blush" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !service) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-background-soft px-6 text-center">
        <h1 className="font-heading text-3xl text-heading">
          Service Not Found
        </h1>

        <p className="mt-3 text-sm text-foreground">
          {error || "This service could not be found."}
        </p>

        <Link
          href="/services"
          className="mt-6 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover"
        >
          Browse Services
        </Link>
      </main>
    );
  }

  const categoryName =
    typeof service.category === "string"
      ? service.category
      : service.category?.name || "Uncategorized";

  const userRole = (
    session?.user as { role?: string } | undefined
  )?.role;

  const isCustomer = userRole === "customer";
  const isAdmin = userRole === "admin";

  const handleBookNow = () => {
    if (!isCustomer || !service.isActive) {
      return;
    }

    setShowBooking(true);
  };

  return (
    <main className="min-h-screen bg-background-soft">
      {/* Breadcrumb */}
      <section className="px-6 pt-8 sm:px-10 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-center gap-2 text-sm text-foreground">
            <Link href="/" className="transition hover:text-accent-brown">
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
            {service.image ? (
              <img
                src={service.image}
                alt={service.name}
                className="h-[320px] w-full object-cover sm:h-[450px] lg:h-[550px]"
              />
            ) : (
              <div className="flex h-[320px] items-center justify-center text-sm text-foreground sm:h-[450px] lg:h-[550px]">
                No service image available
              </div>
            )}
          </div>

          {/* Service Information */}
          <div className="flex flex-col">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent-brown">
              {categoryName}
            </p>

            <h1 className="mt-4 font-heading text-4xl leading-tight text-heading sm:text-5xl">
              {service.name}
            </h1>

            {/* Short Description */}
            {service.shortDescription && (
              <p className="mt-5 text-base font-medium leading-7 text-accent-brown sm:text-lg">
                {service.shortDescription}
              </p>
            )}

            {/* Full Description */}
            <div className="mt-5">
              <h2 className="font-heading text-2xl text-heading">
                About This Service
              </h2>

              <p className="mt-3 text-sm leading-8 text-foreground sm:text-base">
                {service.description ||
                  service.shortDescription ||
                  "Service information will be available soon."}
              </p>
            </div>

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
                  {service.duration} minutes
                </p>
              </div>
            </div>

            {/* What to Expect */}
            {service.whatToExpect &&
              service.whatToExpect.length > 0 && (
                <div className="mt-9">
                  <h2 className="font-heading text-2xl text-heading">
                    What to Expect
                  </h2>

                  <ul className="mt-5 space-y-4">
                    {service.whatToExpect.map((item, index) => (
                      <li
                        key={`${index}-${item}`}
                        className="flex items-start gap-3 text-sm leading-6 text-foreground"
                      >
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-background-blush text-xs text-accent-brown">
                          ✓
                        </span>

                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            {/* Booking Availability */}
            <div className="mt-9">
              {!service.isActive ? (
                <p className="rounded-xl bg-background-blush p-4 text-sm text-accent-brown">
                  This service is currently unavailable for booking.
                </p>
              ) : isAdmin ? (
                <p className="rounded-xl bg-background-blush p-4 text-sm text-accent-brown">
                  Admin accounts cannot book appointments.
                </p>
              ) : isCustomer ? (
                <>
                  {!showBooking && (
                    <button
                      type="button"
                      onClick={handleBookNow}
                      className="w-full rounded-full bg-primary px-7 py-4 text-sm font-semibold text-white transition duration-300 hover:bg-primary-hover"
                    >
                      Book Now
                    </button>
                  )}

                  {showBooking && (
                    <div id="booking-form">
                      <BookingForm
                        serviceName={service.name}
                        price={service.price}
                        duration={`${service.duration} minutes`}
                      />
                    </div>
                  )}
                </>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
