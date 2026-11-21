
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface SalonService {
  _id: string;
  name: string;
  category: string;
  shortDescription: string;
  description: string;
  image: string;
  price: number;
  duration: number;
  whatToExpect: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ServicesResponse {
  success: boolean;
  total: number;
  services: SalonService[];
  message?: string;
}

export default function ManageServicesPage() {
  const [services, setServices] = useState<SalonService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [actionId, setActionId] = useState<string | null>(null);
  const [refreshCount, setRefreshCount] = useState(0);

  // Fetch services whenever refreshCount changes.
  useEffect(() => {
    const controller = new AbortController();

    const loadServices = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch(
          "/api/protected/admin/services",
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
            signal: controller.signal,
          }
        );

        const data: ServicesResponse = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load services.");
        }

        setServices(data.services || []);
      } catch (err) {
        if (controller.signal.aborted) return;

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while loading services."
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    loadServices();

    return () => {
      controller.abort();
    };
  }, [refreshCount]);

  // Refresh services from button clicks and after actions.
  const refreshServices = () => {
    setRefreshCount((count) => count + 1);
  };

  // Activate or deactivate service.
  const handleToggleStatus = async (service: SalonService) => {
    try {
      setActionId(service._id);
      setError("");
      setMessage("");

      const response = await fetch(
        `/api/protected/admin/services/${service._id}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isActive: !service.isActive,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update service status.");
      }

      setMessage(
        service.isActive
          ? "Service deactivated successfully."
          : "Service activated successfully."
      );

      refreshServices();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update service."
      );
    } finally {
      setActionId(null);
    }
  };

  // Delete service (backend performs soft deletion).
  const handleDeleteService = async (service: SalonService) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${service.name}"?`
    );

    if (!confirmed) return;

    try {
      setActionId(service._id);
      setError("");
      setMessage("");

      const response = await fetch(
        `/api/protected/admin/services/${service._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete service.");
      }

      setMessage("Service deleted successfully.");
      refreshServices();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete service."
      );
    } finally {
      setActionId(null);
    }
  };

  const activeServices = services.filter(
    (service) => service.isActive
  ).length;

  const inactiveServices = services.length - activeServices;

  return (
    <div className="min-h-screen bg-[#FDFCFC] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Page Heading */}
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#B39A7D]">
              Administration
            </p>

            <h1 className="font-serif text-3xl text-[#46322D]">
              Manage Services
            </h1>

            <p className="mt-2 text-sm text-[#7A7470]">
              Manage your salon treatments and beauty services.
            </p>
          </div>

          <Link
            href="/dashboard/admin/services/add"
            className="inline-flex items-center justify-center gap-2 bg-[#46322D] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#967467]"
          >
            <span className="text-lg">+</span>
            Add New Service
          </Link>
        </div>

        {/* Statistics */}
        <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="border border-[#E6E1DD] bg-white p-5">
            <p className="text-sm text-[#7A7470]">Total Services</p>
            <p className="mt-2 font-serif text-3xl text-[#46322D]">
              {services.length}
            </p>
          </div>

          <div className="border border-[#E6E1DD] bg-white p-5">
            <p className="text-sm text-[#7A7470]">Active Services</p>
            <p className="mt-2 font-serif text-3xl text-[#967467]">
              {activeServices}
            </p>
          </div>

          <div className="border border-[#E6E1DD] bg-white p-5">
            <p className="text-sm text-[#7A7470]">Inactive Services</p>
            <p className="mt-2 font-serif text-3xl text-[#967467]">
              {inactiveServices}
            </p>
          </div>
        </div>

        {/* Success Message */}
        {message && (
          <div className="mb-5 border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-5 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Services Container */}
        <div className="border border-[#E6E1DD] bg-white">
          {/* Section Header */}
          <div className="flex flex-col justify-between gap-3 border-b border-[#E6E1DD] px-5 py-5 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-serif text-xl text-[#46322D]">
                All Salon Services
              </h2>

              <p className="mt-1 text-xs text-[#7A7470]">
                View and manage your salon service collection.
              </p>
            </div>

            <button
              onClick={refreshServices}
              disabled={isLoading}
              className="border border-[#E6E1DD] px-4 py-2 text-xs font-medium text-[#967467] transition hover:bg-[#F5ECE8] disabled:opacity-50"
            >
              ↻ Refresh
            </button>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="space-y-4 p-5">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex animate-pulse gap-4 border border-[#E6E1DD] p-4"
                >
                  <div className="h-24 w-24 shrink-0 bg-[#F5ECE8]" />

                  <div className="flex-1 space-y-3 py-2">
                    <div className="h-4 w-1/3 bg-[#F5ECE8]" />
                    <div className="h-3 w-2/3 bg-[#F5ECE8]" />
                    <div className="h-3 w-1/4 bg-[#F5ECE8]" />
                  </div>
                </div>
              ))}
            </div>
          ) : services.length === 0 ? (
            /* Empty State */
            <div className="px-5 py-16 text-center">
              <div className="mb-4 text-4xl text-[#B39A7D]">✿</div>

              <h3 className="font-serif text-xl text-[#46322D]">
                No Services Found
              </h3>

              <p className="mt-2 text-sm text-[#7A7470]">
                You have not added any salon services yet.
              </p>

              <Link
                href="/dashboard/admin/services/add"
                className="mt-5 inline-block bg-[#46322D] px-5 py-3 text-sm text-white transition hover:bg-[#967467]"
              >
                Add Your First Service
              </Link>
            </div>
          ) : (
            /* Service Cards */
            <div className="space-y-4 p-4 sm:p-5">
              {services.map((service) => (
                <div
                  key={service._id}
                  className="flex flex-col gap-4 border border-[#E6E1DD] p-4 transition hover:border-[#D5B6A9] sm:flex-row sm:items-center"
                >
                  {/* Service Image */}
                  <div className="h-24 w-full shrink-0 overflow-hidden bg-[#F5ECE8] sm:h-24 sm:w-24">
                    <img
                      src={service.image}
                      alt={service.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Service Information */}
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <h3 className="font-serif text-lg text-[#46322D]">
                        {service.name}
                      </h3>

                      <span
                        className={`px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                          service.isActive
                            ? "bg-green-50 text-green-700"
                            : "bg-[#F5ECE8] text-[#967467]"
                        }`}
                      >
                        {service.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <p className="mb-2 text-xs text-[#B39A7D]">
                      {service.category}
                    </p>

                    <p className="line-clamp-2 text-sm leading-6 text-[#7A7470]">
                      {service.shortDescription}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                      <span className="font-semibold text-[#46322D]">
                        ${service.price}
                      </span>

                      <span className="text-[#7A7470]">
                        ◷ {service.duration} minutes
                      </span>
                    </div>
                  </div>

                  {/* Service Actions */}
                  <div className="flex w-full shrink-0 flex-col gap-3 sm:w-44">
                    {/* View and Edit */}
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href={`/dashboard/admin/services/${service._id}`}
                        className="flex items-center justify-center gap-1.5 bg-[#F5ECE8] px-3 py-2.5 text-xs font-medium text-[#46322D] transition hover:bg-[#E4DBD8]"
                      >
                        <span>⌕</span>
                        View
                      </Link>

                      <Link
                        href={`/dashboard/admin/services/${service._id}/edit`}
                        className="flex items-center justify-center gap-1.5 bg-[#46322D] px-3 py-2.5 text-xs font-medium text-white transition hover:bg-[#967467]"
                      >
                        <span>✎</span>
                        Edit
                      </Link>
                    </div>

                    {/* Activate / Deactivate and Delete */}
                    <div className="flex items-center gap-2 border-t border-[#E6E1DD] pt-3">
                      <button
                        onClick={() => handleToggleStatus(service)}
                        disabled={actionId === service._id}
                        className={`flex flex-1 items-center justify-center gap-1.5 rounded-md border px-3 py-2.5 text-xs font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${
                          service.isActive
                            ? "border-[#E4DBD8] bg-[#F5ECE8] text-[#967467] hover:border-[#D5B6A9] hover:bg-[#E4DBD8]"
                            : "border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                        }`}
                      >
                        {actionId === service._id ? (
                          "Please wait..."
                        ) : service.isActive ? (
                          <>
                            <span>⊖</span>
                            Deactivate
                          </>
                        ) : (
                          <>
                            <span>✓</span>
                            Activate
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleDeleteService(service)}
                        disabled={
                          actionId === service._id || !service.isActive
                        }
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-semibold text-red-600 transition-all duration-200 hover:border-red-300 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <span>♲</span>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer Count */}
          {!isLoading && services.length > 0 && (
            <div className="border-t border-[#E6E1DD] px-5 py-4">
              <p className="text-xs text-[#7A7470]">
                Showing {services.length}{" "}
                {services.length === 1 ? "service" : "services"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
