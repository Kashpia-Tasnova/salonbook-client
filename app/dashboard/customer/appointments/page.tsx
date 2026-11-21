
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type AppointmentStatus =
  | "All"
  | "Pending"
  | "Confirmed"
  | "Completed"
  | "Cancelled";

interface Appointment {
  _id: string;
  serviceId: string;
  serviceName: string;
  serviceImage?: string;
  serviceCategory?: string;
  price: number;
  duration: number;
  appointmentDate: string;
  time: string;
  message?: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

const filters: AppointmentStatus[] = [
  "All",
  "Pending",
  "Confirmed",
  "Completed",
  "Cancelled",
];

export default function MyAppointmentsPage() {
  const [activeFilter, setActiveFilter] =
    useState<AppointmentStatus>("All");

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelError, setCancelError] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [cancellingId, setCancellingId] = useState("");
  const [payingId, setPayingId] = useState("");

  // Fetch appointments belonging to the logged-in customer.
  useEffect(() => {
    const controller = new AbortController();

    const fetchAppointments = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch(
          "/api/protected/customer/appointments",
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
            signal: controller.signal,
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load your appointments."
          );
        }

        const appointmentList =
          data.appointments ||
          data.data?.appointments ||
          data.data ||
          [];

        if (!Array.isArray(appointmentList)) {
          throw new Error("Invalid appointment data received.");
        }

        setAppointments(appointmentList);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while loading appointments."
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchAppointments();

    return () => controller.abort();
  }, []);

  // Filter appointments by status.
  const filteredAppointments = useMemo(() => {
    if (activeFilter === "All") {
      return appointments;
    }

    return appointments.filter(
      (appointment) =>
        appointment.status.toLowerCase() ===
        activeFilter.toLowerCase()
    );
  }, [appointments, activeFilter]);

  // Format appointment date without changing its calendar day.
  const formatDate = (dateString: string) => {
    if (!dateString) return "Date unavailable";

    const datePart = dateString.split("T")[0];
    const [year, month, day] = datePart.split("-").map(Number);

    if (!year || !month || !day) {
      return dateString;
    }

    return new Date(year, month - 1, day).toLocaleDateString(
      "en-GB",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
  };

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-amber-50 text-amber-700";

      case "confirmed":
        return "bg-blue-50 text-blue-700";

      case "completed":
        return "bg-green-50 text-green-700";

      case "cancelled":
        return "bg-red-50 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPaymentStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "text-green-700";

      case "unpaid":
        return "text-amber-700";

      case "refunded":
        return "text-blue-700";

      default:
        return "text-[#7A7470]";
    }
  };

  // Start Stripe Checkout for a confirmed, unpaid appointment.
  const handlePayment = async (appointmentId: string) => {
    try {
      setPayingId(appointmentId);
      setPaymentError("");

      const response = await fetch(
        "/api/payment/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ appointmentId }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success || !data.url) {
        throw new Error(
          data.message || "Unable to start payment. Please try again."
        );
      }

      // Redirect the customer to Stripe's secure Checkout page.
      window.location.assign(data.url);
    } catch (err) {
      setPaymentError(
        err instanceof Error
          ? err.message
          : "Something went wrong while starting payment."
      );

      setPayingId("");
    }
  };

  // Cancel a pending appointment.
  const handleCancelAppointment = async (appointmentId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this appointment?"
    );

    if (!confirmed) return;

    try {
      setCancellingId(appointmentId);
      setCancelError("");

      const response = await fetch(
        `/api/protected/customer/appointments/${appointmentId}/cancel`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to cancel this appointment."
        );
      }

      setAppointments((previousAppointments) =>
        previousAppointments.map((appointment) =>
          appointment._id === appointmentId
            ? {
                ...appointment,
                status: "cancelled",
              }
            : appointment
        )
      );
    } catch (err) {
      setCancelError(
        err instanceof Error
          ? err.message
          : "Something went wrong while cancelling."
      );
    } finally {
      setCancellingId("");
    }
  };

  const getEmptyMessage = () => {
    if (activeFilter === "All") {
      return {
        title: "No appointments yet",
        description:
          "Your salon bookings will appear here once you make your first appointment.",
      };
    }

    return {
      title: `No ${activeFilter.toLowerCase()} appointments`,
      description: `You currently don't have any ${activeFilter.toLowerCase()} appointments.`,
    };
  };

  const emptyMessage = getEmptyMessage();

  return (
    <main>
      {/* Page Heading */}
      <section className="mb-8">
        <p className="mb-2 text-sm uppercase tracking-[0.2em] text-[#B39A7D]">
          Customer Dashboard
        </p>

        <h1 className="font-serif text-3xl text-[#46322D] sm:text-4xl">
          My Appointments
        </h1>

        <p className="mt-2 text-sm leading-6 text-[#7A7470]">
          View and manage all your salon appointments in one place.
        </p>
      </section>

      {/* Appointment History */}
      <section className="border border-[#E6E1DD] bg-white">
        <div className="border-b border-[#E6E1DD] p-5 sm:px-7 sm:py-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-serif text-xl text-[#46322D]">
                Appointment History
              </h2>

              <p className="mt-1 text-sm text-[#7A7470]">
                Filter your appointments by their current status.
              </p>
            </div>

            <p className="text-sm text-[#7A7470]">
              Total:{" "}
              <span className="font-semibold text-[#46322D]">
                {appointments.length}
              </span>
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 border-b border-[#E6E1DD] px-5 py-4 sm:px-7">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              aria-pressed={activeFilter === filter}
              className={`px-4 py-2 text-xs font-medium transition ${
                activeFilter === filter
                  ? "bg-[#B39A7D] text-white"
                  : "bg-[#FDFCFC] text-[#7A7470] hover:bg-[#F5ECE8]"
              }`}
            >
              {filter}
              {filter === "All" && ` (${appointments.length})`}
              {filter !== "All" &&
                ` (${appointments.filter(
                  (appointment) =>
                    appointment.status.toLowerCase() ===
                    filter.toLowerCase()
                ).length})`}
            </button>
          ))}
        </div>

        {/* Errors */}
        {error && (
          <div className="m-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 sm:mx-7">
            {error}
          </div>
        )}

        {cancelError && (
          <div className="m-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 sm:mx-7">
            {cancelError}
          </div>
        )}

        {paymentError && (
          <div className="m-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 sm:mx-7">
            {paymentError}
          </div>
        )}

        {/* Loading */}
        {isLoading ? (
          <div className="space-y-5 p-5 sm:p-7">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="animate-pulse border border-[#E6E1DD] p-5"
              >
                <div className="flex gap-4">
                  <div className="h-24 w-24 shrink-0 bg-[#F5ECE8]" />

                  <div className="flex-1 space-y-3">
                    <div className="h-4 w-1/2 bg-[#F5ECE8]" />
                    <div className="h-3 w-1/3 bg-[#F5ECE8]" />
                    <div className="h-3 w-2/3 bg-[#F5ECE8]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredAppointments.length === 0 ? (
          /* Empty State */
          <div className="px-5 py-16 text-center sm:px-7">
            <span
              className="text-5xl text-[#D5B6A9]"
              aria-hidden="true"
            >
              ✿
            </span>

            <h3 className="mt-5 font-serif text-2xl text-[#46322D]">
              {emptyMessage.title}
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#7A7470]">
              {emptyMessage.description}
            </p>

            <Link
              href="/services"
              className="mt-6 inline-flex items-center gap-2 bg-[#B39A7D] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#967467]"
            >
              Explore Salon Services
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        ) : (
          /* Appointment Cards */
          <div className="space-y-5 p-5 sm:p-7">
            {filteredAppointments.map((appointment) => (
              <article
                key={appointment._id}
                className="border border-[#E6E1DD] bg-white p-4 transition hover:border-[#D5B6A9] sm:p-5"
              >
                <div className="flex flex-col gap-5 sm:flex-row">
                  {/* Service Image */}
                  <div className="h-40 w-full shrink-0 overflow-hidden bg-[#F5ECE8] sm:h-32 sm:w-36">
                    {appointment.serviceImage ? (
                      <img
                        src={appointment.serviceImage}
                        alt={appointment.serviceName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-3xl text-[#D5B6A9]">
                        ✿
                      </div>
                    )}
                  </div>

                  {/* Appointment Information */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.15em] text-[#B39A7D]">
                          {appointment.serviceCategory ||
                            "Salon Service"}
                        </p>

                        <h3 className="mt-1 font-serif text-xl text-[#46322D]">
                          {appointment.serviceName}
                        </h3>
                      </div>

                      <span
                        className={`inline-flex px-3 py-1.5 text-xs font-semibold capitalize ${getStatusStyle(
                          appointment.status
                        )}`}
                      >
                        {appointment.status}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-3 text-sm text-[#7A7470] sm:grid-cols-2">
                      <p>
                        <span className="font-medium text-[#46322D]">
                          Date:
                        </span>{" "}
                        {formatDate(appointment.appointmentDate)}
                      </p>

                      <p>
                        <span className="font-medium text-[#46322D]">
                          Time:
                        </span>{" "}
                        {appointment.time}
                      </p>

                      <p>
                        <span className="font-medium text-[#46322D]">
                          Duration:
                        </span>{" "}
                        {appointment.duration} minutes
                      </p>

                      <p>
                        <span className="font-medium text-[#46322D]">
                          Payment:
                        </span>{" "}
                        <span
                          className={`font-semibold capitalize ${getPaymentStyle(
                            appointment.paymentStatus
                          )}`}
                        >
                          {appointment.paymentStatus}
                        </span>
                      </p>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#E6E1DD] pt-4">
                      <p className="font-serif text-xl text-[#46322D]">
                        $
                        {Number(appointment.price).toLocaleString(
                          "en-BD"
                        )}
                      </p>

                      <div className="flex flex-wrap items-center gap-2">
                        {/* View Details */}
                        <Link
                          href={`/dashboard/customer/appointments/${appointment._id}`}
                          className="border border-[#B39A7D] px-5 py-2.5 text-xs font-semibold text-[#967467] transition hover:bg-[#F5ECE8]"
                        >
                          View Details
                        </Link>

                        {/* Cancel Appointment */}
                        {appointment.status.toLowerCase() ===
                          "pending" && (
                          <button
                            type="button"
                            onClick={() =>
                              handleCancelAppointment(appointment._id)
                            }
                            disabled={
                              cancellingId === appointment._id
                            }
                            className="border border-red-200 px-5 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {cancellingId === appointment._id
                              ? "Cancelling..."
                              : "Cancel Appointment"}
                          </button>
                        )}

                        {/* Stripe Payment */}
                        {appointment.status.toLowerCase() ===
                          "confirmed" &&
                          appointment.paymentStatus.toLowerCase() ===
                            "unpaid" && (
                            <button
                              type="button"
                              onClick={() =>
                                handlePayment(appointment._id)
                              }
                              disabled={payingId === appointment._id}
                              className="bg-[#B39A7D] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#967467] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {payingId === appointment._id
                                ? "Redirecting to Payment..."
                                : "Pay Now"}
                            </button>
                          )}
                      </div>
                    </div>

                    {appointment.message && (
                      <div className="mt-4 bg-[#FDFCFC] p-3">
                        <p className="text-xs font-semibold text-[#46322D]">
                          Your Message
                        </p>

                        <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-[#7A7470]">
                          {appointment.message}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Appointment Information */}
      <section className="mt-7 border border-[#E6E1DD] bg-[#F5ECE8] p-5 sm:p-7">
        <div className="flex items-start gap-3">
          <span
            className="text-xl text-[#967467]"
            aria-hidden="true"
          >
            ♡
          </span>

          <div>
            <h2 className="font-serif text-lg text-[#46322D]">
              Appointment Information
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#7A7470]">
              You can cancel pending appointments. Once your
              appointment is confirmed by our salon, you can pay
              securely through Stripe using the Pay Now button.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
