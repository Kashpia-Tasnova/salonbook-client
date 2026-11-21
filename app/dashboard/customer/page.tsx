
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type Appointment = {
  _id: string;
  serviceName: string;
  serviceImage?: string;
  serviceCategory?: string;
  price: number;
  duration: number;
  appointmentDate: string;
  time: string;
  status: string;
  paymentStatus: string;
  createdAt?: string;
};

const statDetails = [
  {
    title: "Total Appointments",
    key: "total",
    icon: "✦",
    description: "All your bookings",
  },
  {
    title: "Pending",
    key: "pending",
    icon: "◷",
    description: "Awaiting confirmation",
  },
  {
    title: "Confirmed",
    key: "confirmed",
    icon: "✓",
    description: "Ready for your visit",
  },
  {
    title: "Completed",
    key: "completed",
    icon: "♡",
    description: "Your salon visits",
  },
] as const;

function formatDate(date: string) {
  if (!date) return "Date unavailable";

  return new Date(`${date.slice(0, 10)}T00:00:00`).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );
}

function getStatusStyle(status: string) {
  switch (status.toLowerCase()) {
    case "confirmed":
      return "bg-green-50 text-green-700";
    case "completed":
      return "bg-blue-50 text-blue-700";
    case "cancelled":
      return "bg-red-50 text-red-600";
    default:
      return "bg-[#F5ECE8] text-[#967467]";
  }
}

export default function CustomerDashboard() {
  const { data: session, isPending } = authClient.useSession();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const customerName = session?.user?.name?.trim() || "there";

  useEffect(() => {
    if (isPending || !session) return;

    const controller = new AbortController();

    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/protected/customer/appointments`,
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
            data.message || "Failed to load your appointments."
          );
        }

        const result =
          data.appointments ||
          data.data?.appointments ||
          data.data;

        setAppointments(Array.isArray(result) ? result : []);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while loading appointments."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    void fetchAppointments();

    return () => controller.abort();
  }, [session, isPending]);

  const stats = {
    total: appointments.length,
    pending: appointments.filter(
      (appointment) => appointment.status.toLowerCase() === "pending"
    ).length,
    confirmed: appointments.filter(
      (appointment) => appointment.status.toLowerCase() === "confirmed"
    ).length,
    completed: appointments.filter(
      (appointment) => appointment.status.toLowerCase() === "completed"
    ).length,
  };

  const recentAppointments = [...appointments]
    .sort(
      (a, b) =>
        new Date(b.createdAt || b.appointmentDate).getTime() -
        new Date(a.createdAt || a.appointmentDate).getTime()
    )
    .slice(0, 3);

  return (
    <main>
      {/* Welcome Section */}
      <section className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <p className="mb-2 text-sm uppercase tracking-[0.2em] text-[#B39A7D]">
            Customer Dashboard
          </p>

          <h1 className="font-serif text-3xl text-[#46322D] sm:text-4xl">
            {isPending ? "Welcome back!" : `Welcome back, ${customerName}!`}
          </h1>

          <p className="mt-2 text-sm text-[#7A7470]">
            Manage your appointments and enjoy your beauty journey.
          </p>
        </div>

        <Link
          href="/services"
          className="inline-flex w-fit items-center gap-2 bg-[#B39A7D] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#967467]"
        >
          <span className="text-lg">+</span>
          Book an Appointment
        </Link>
      </section>

      {/* Statistics */}
      <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statDetails.map((stat) => (
          <div
            key={stat.key}
            className="border border-[#E6E1DD] bg-white p-5 transition hover:shadow-sm"
          >
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-[#7A7470]">{stat.title}</p>

              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F5ECE8] text-xl text-[#967467]">
                {stat.icon}
              </span>
            </div>

            {loading ? (
              <div className="h-9 w-12 animate-pulse bg-[#F5ECE8]" />
            ) : (
              <p className="font-serif text-3xl text-[#46322D]">
                {stats[stat.key]}
              </p>
            )}

            <p className="mt-1 text-xs text-[#A39A94]">
              {stat.description}
            </p>
          </div>
        ))}
      </section>

      {/* Recent Appointments */}
      <section className="border border-[#E6E1DD] bg-white">
        <div className="flex flex-col justify-between gap-3 border-b border-[#E6E1DD] p-5 sm:flex-row sm:items-center sm:px-7 sm:py-6">
          <div>
            <h2 className="font-serif text-2xl text-[#46322D]">
              Recent Appointments
            </h2>
            <p className="mt-1 text-sm text-[#7A7470]">
              Your latest salon bookings.
            </p>
          </div>

          <Link
            href="/dashboard/customer/appointments"
            className="text-sm font-medium text-[#967467] transition hover:text-[#B39A7D]"
          >
            View All →
          </Link>
        </div>

        <div className="p-5 sm:p-7">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex animate-pulse gap-4 border-b border-[#E6E1DD] pb-4"
                >
                  <div className="h-16 w-16 shrink-0 bg-[#F5ECE8]" />
                  <div className="flex-1 space-y-3 py-1">
                    <div className="h-4 w-1/2 bg-[#F5ECE8]" />
                    <div className="h-3 w-2/3 bg-[#F5ECE8]" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="py-10 text-center">
              <p className="text-sm text-red-600">{error}</p>

              <button
                onClick={() => window.location.reload()}
                className="mt-4 text-sm font-medium text-[#967467] underline"
              >
                Try Again
              </button>
            </div>
          ) : recentAppointments.length === 0 ? (
            <div className="py-10 text-center">
              <span className="text-4xl text-[#D5B6A9]">✿</span>

              <h3 className="mt-4 font-serif text-xl text-[#46322D]">
                Your beauty journey starts here
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#7A7470]">
                You haven&apos;t made any appointments yet. Explore our salon
                services and book your first appointment.
              </p>

              <Link
                href="/services"
                className="mt-5 inline-block bg-[#B39A7D] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#967467]"
              >
                Explore Services
              </Link>
            </div>
          ) : (
            <div className="space-y-5">
              {recentAppointments.map((appointment) => (
                <div
                  key={appointment._id}
                  className="flex flex-col justify-between gap-4 border-b border-[#E6E1DD] pb-5 last:border-b-0 last:pb-0 sm:flex-row sm:items-center"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    {appointment.serviceImage ? (
                      <img
                        src={appointment.serviceImage}
                        alt={appointment.serviceName}
                        className="h-16 w-16 shrink-0 object-cover"
                      />
                    ) : (
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center bg-[#F5ECE8] text-2xl text-[#967467]">
                        ✿
                      </div>
                    )}

                    <div className="min-w-0">
                      <h3 className="truncate font-serif text-lg text-[#46322D]">
                        {appointment.serviceName}
                      </h3>

                      <p className="mt-1 text-xs text-[#7A7470]">
                        {formatDate(appointment.appointmentDate)} ·{" "}
                        {appointment.time}
                      </p>

                      <p className="mt-1 text-xs text-[#967467]">
                        ${Number(appointment.price).toLocaleString("en-BD")}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                    <span
                      className={`px-3 py-1.5 text-xs font-medium capitalize ${getStatusStyle(
                        appointment.status
                      )}`}
                    >
                      {appointment.status}
                    </span>

                    <Link
                      href={`/dashboard/customer/appointments/${appointment._id}`}
                      className="text-xs font-semibold text-[#967467] transition hover:text-[#B39A7D]"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Reminder */}
      <div className="mt-7 border border-[#E6E1DD] bg-[#F5ECE8] px-5 py-5 sm:px-7">
        <div className="flex items-start gap-3">
          <span className="text-xl text-[#967467]">♡</span>

          <div>
            <h3 className="font-serif text-lg text-[#46322D]">
              A little reminder
            </h3>

            <p className="mt-1 text-sm leading-6 text-[#7A7470]">
              Please arrive a few minutes before your appointment so you can
              relax and enjoy your experience at Blush & Bloom.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
