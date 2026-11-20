
"use client";

import { useEffect, useState } from "react";

interface DashboardStats {
  totalServices: number;
  totalAppointments: number;
  totalCustomers: number;
  totalTransactions: number;
}

interface Appointment {
  _id?: string;
  id?: string;
  customerName?: string;
  customer?: {
    name?: string;
    email?: string;
  };
  serviceName?: string;
  service?: {
    name?: string;
  };
  date?: string;
  appointmentDate?: string;
  time?: string;
  timeSlot?: string;
  status?: string;
  [key: string]: unknown;
}

interface DashboardResponse {
  success: boolean;
  stats: DashboardStats;
  recentAppointments: Appointment[];
  message?: string;
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const statisticCards = [
  {
    key: "totalServices",
    title: "Total Services",
    description: "Salon services",
    icon: "✿",
  },
  {
    key: "totalAppointments",
    title: "Total Appointments",
    description: "All bookings",
    icon: "◷",
  },
  {
    key: "totalCustomers",
    title: "Total Customers",
    description: "Registered customers",
    icon: "♙",
  },
  {
    key: "totalTransactions",
    title: "Total Transactions",
    description: "Recorded transactions",
    icon: "৳",
  },
] as const;

function formatDate(value?: string) {
  if (!value) return "Date not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getAppointmentDetails(appointment: Appointment) {
  const customer =
    appointment.customerName ||
    appointment.customer?.name ||
    appointment.customer?.email ||
    "Customer";

  const service =
    appointment.serviceName ||
    appointment.service?.name ||
    "Service";

  const date =
    appointment.appointmentDate || appointment.date;

  const time =
    appointment.timeSlot || appointment.time;

  return {
    customer,
    service,
    date: formatDate(typeof date === "string" ? date : undefined),
    time: typeof time === "string" ? time : "Time not available",
    status:
      typeof appointment.status === "string"
        ? appointment.status
        : "Pending",
  };
}

function LoadingSkeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {statisticCards.map((card) => (
        <div
          key={card.key}
          className="animate-pulse border border-[#E6E1DD] bg-white p-6"
        >
          <div className="mb-5 h-10 w-10 bg-[#F5ECE8]" />
          <div className="mb-3 h-3 w-28 bg-[#F5ECE8]" />
          <div className="mb-2 h-8 w-16 bg-[#E6E1DD]" />
          <div className="h-3 w-32 bg-[#F5ECE8]" />
        </div>
      ))}
    </div>
  );
}

export default function AdminDashboardPage() {
  const [dashboard, setDashboard] =
    useState<DashboardResponse | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/protected/admin/stats`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data: DashboardResponse = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Failed to load dashboard statistics."
          );
        }

        setDashboard(data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <main>
      {/* Page Heading */}
      <section className="mb-8">
        <p className="mb-2 text-sm uppercase tracking-[0.2em] text-[#B39A7D]">
          Administration
        </p>

        <h1 className="font-serif text-3xl text-[#46322D] sm:text-4xl">
          Overview
        </h1>

        <p className="mt-2 text-sm text-[#7A7470]">
          Manage your salon and keep everything running beautifully.
        </p>
      </section>

      {/* Statistics */}
      <section className="mb-10">
        <h2 className="mb-5 font-serif text-xl text-[#46322D]">
          Salon at a Glance
        </h2>

        {isLoading ? (
          <LoadingSkeleton />
        ) : error ? (
          <div className="border border-red-200 bg-white p-6">
            <p className="text-sm text-red-600">{error}</p>
            <p className="mt-2 text-xs text-[#7A7470]">
              Please check your backend connection and try refreshing the page.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {statisticCards.map((card) => (
              <div
                key={card.key}
                className="border border-[#E6E1DD] bg-white p-6 transition hover:border-[#D5B6A9]"
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center bg-[#F5ECE8] font-serif text-2xl text-[#967467]">
                  {card.icon}
                </div>

                <p className="text-sm text-[#7A7470]">
                  {card.title}
                </p>

                <p className="mt-2 font-serif text-3xl text-[#46322D]">
                  {dashboard?.stats[card.key] ?? 0}
                </p>

                <p className="mt-2 text-xs text-[#A39A94]">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recent Appointments */}
      <section className="border border-[#E6E1DD] bg-white">
        <div className="border-b border-[#E6E1DD] px-6 py-5">
          <h2 className="font-serif text-xl text-[#46322D]">
            Recent Appointments
          </h2>

          <p className="mt-1 text-sm text-[#7A7470]">
            Keep track of your latest customer bookings.
          </p>
        </div>

        {isLoading ? (
          <div className="animate-pulse space-y-4 p-6">
            <div className="h-12 bg-[#F5ECE8]" />
            <div className="h-12 bg-[#F5ECE8]" />
            <div className="h-12 bg-[#F5ECE8]" />
          </div>
        ) : error ? (
          <p className="p-6 text-sm text-[#7A7470]">
            Appointment information is unavailable.
          </p>
        ) : !dashboard?.recentAppointments.length ? (
          <div className="px-6 py-14 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center bg-[#F5ECE8] font-serif text-2xl text-[#967467]">
              ◷
            </div>

            <h3 className="font-serif text-lg text-[#46322D]">
              No appointments yet
            </h3>

            <p className="mt-2 text-sm text-[#7A7470]">
              New customer appointments will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left">
              <thead>
                <tr className="border-b border-[#E6E1DD] bg-[#FDFCFC] text-xs uppercase tracking-wider text-[#7A7470]">
                  <th className="px-6 py-4 font-medium">Customer</th>
                  <th className="px-6 py-4 font-medium">Service</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Time</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>

              <tbody>
                {dashboard.recentAppointments.map(
                  (appointment, index) => {
                    const details =
                      getAppointmentDetails(appointment);

                    return (
                      <tr
                        key={
                          appointment._id ||
                          appointment.id ||
                          index
                        }
                        className="border-b border-[#E6E1DD] last:border-0"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-[#46322D]">
                          {details.customer}
                        </td>

                        <td className="px-6 py-4 text-sm text-[#7A7470]">
                          {details.service}
                        </td>

                        <td className="px-6 py-4 text-sm text-[#7A7470]">
                          {details.date}
                        </td>

                        <td className="px-6 py-4 text-sm text-[#7A7470]">
                          {details.time}
                        </td>

                        <td className="px-6 py-4">
                          <span className="inline-block bg-[#F5ECE8] px-3 py-1 text-xs text-[#967467]">
                            {details.status}
                          </span>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
