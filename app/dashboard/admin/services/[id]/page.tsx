
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
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
  whatToExpect?: string[];
  isActive: boolean;
  createdAt?: string;
}

export default function ServiceDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const [service, setService] = useState<SalonService | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/protected/admin/services`,
          {
            credentials: "include",
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load services.");
        }

        const services: SalonService[] = data.services || [];

        const foundService = services.find(
          (item) => item._id === id
        );

        if (!foundService) {
          throw new Error("Service not found.");
        }

        setService(foundService);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong."
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchService();
    }
  }, [id]);

  const categoryName =
    typeof service?.category === "string"
      ? service.category
      : service?.category?.name || "Uncategorized";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FDFCFC] p-8">
        <div className="mx-auto max-w-5xl animate-pulse space-y-5">
          <div className="h-8 w-48 bg-[#F5ECE8]" />
          <div className="h-72 bg-[#F5ECE8]" />
          <div className="h-6 w-1/2 bg-[#F5ECE8]" />
          <div className="h-4 w-full bg-[#F5ECE8]" />
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-[#FDFCFC] px-5 py-20 text-center">
        <h1 className="font-serif text-2xl text-[#46322D]">
          Service Not Found
        </h1>

        <p className="mt-3 text-sm text-red-600">
          {error || "This service could not be found."}
        </p>

        <Link
          href="/dashboard/admin/services"
          className="mt-6 inline-block bg-[#46322D] px-5 py-3 text-sm text-white transition hover:bg-[#967467]"
        >
          Back to Manage Services
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCFC] px-4 py-7 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/dashboard/admin/services"
          className="mb-6 inline-flex text-sm text-[#967467] transition hover:text-[#46322D]"
        >
          ← Back to Manage Services
        </Link>

        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#B39A7D]">
              Service Information
            </p>

            <h1 className="mt-2 font-serif text-3xl text-[#46322D]">
              View Service Details
            </h1>
          </div>

          <Link
            href={`/dashboard/admin/services/${service._id}/edit`}
            className="bg-[#46322D] px-5 py-3 text-center text-sm text-white transition hover:bg-[#967467]"
          >
            Edit Service
          </Link>
        </div>

        <div className="overflow-hidden border border-[#E6E1DD] bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="min-h-[280px] bg-[#F5ECE8] md:min-h-[420px]">
              {service.image ? (
                <img
                  src={service.image}
                  alt={service.name}
                  className="h-full max-h-[480px] min-h-[280px] w-full object-cover"
                />
              ) : (
                <div className="flex min-h-[280px] items-center justify-center text-sm text-[#967467] md:min-h-[420px]">
                  No service image available
                </div>
              )}
            </div>

            <div className="flex flex-col justify-center p-6 sm:p-9">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B39A7D]">
                {categoryName}
              </span>

              <h2 className="mt-3 font-serif text-3xl text-[#46322D]">
                {service.name}
              </h2>

              <p className="mt-4 text-sm leading-7 text-[#7A7470]">
                {service.shortDescription ||
                  "No short description available."}
              </p>

              <div className="mt-7 grid grid-cols-2 gap-4 border-y border-[#E6E1DD] py-5">
                <div>
                  <p className="text-xs text-[#7A7470]">
                    Service Price
                  </p>

                  <p className="mt-1 font-serif text-2xl text-[#46322D]">
                    ${service.price}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[#7A7470]">
                    Duration
                  </p>

                  <p className="mt-1 font-serif text-2xl text-[#46322D]">
                    {service.duration} min
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <span
                  className={`inline-block px-3 py-1.5 text-xs font-semibold ${
                    service.isActive
                      ? "bg-green-50 text-green-700"
                      : "bg-[#F5ECE8] text-[#967467]"
                  }`}
                >
                  {service.isActive
                    ? "Active Service"
                    : "Inactive Service"}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-[#E6E1DD] p-6 sm:p-9">
            <h3 className="font-serif text-2xl text-[#46322D]">
              About This Service
            </h3>

            <p className="mt-4 whitespace-pre-line text-sm leading-8 text-[#7A7470]">
              {service.description ||
                "No detailed description available."}
            </p>

            {service.whatToExpect &&
              service.whatToExpect.length > 0 && (
                <div className="mt-9">
                  <h3 className="font-serif text-2xl text-[#46322D]">
                    What to Expect
                  </h3>

                  <ul className="mt-5 space-y-3">
                    {service.whatToExpect.map((item, index) => (
                      <li
                        key={index}
                        className="flex gap-3 text-sm leading-6 text-[#7A7470]"
                      >
                        <span className="text-[#B39A7D]">✦</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
