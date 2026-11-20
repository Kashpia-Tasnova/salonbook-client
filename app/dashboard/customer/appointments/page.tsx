
"use client";

import Link from "next/link";
import { useState } from "react";

type AppointmentStatus =
  | "All"
  | "Pending"
  | "Confirmed"
  | "Completed"
  | "Cancelled";

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

      {/* Appointment Filters */}
      <section className="border border-[#E6E1DD] bg-white">
        <div className="border-b border-[#E6E1DD] p-5 sm:px-7 sm:py-6">
          <h2 className="font-serif text-xl text-[#46322D]">
            Appointment History
          </h2>

          <p className="mt-1 text-sm text-[#7A7470]">
            Filter your appointments by their current status.
          </p>
        </div>

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
            </button>
          ))}
        </div>

        {/* Empty State */}
        <div className="px-5 py-16 text-center sm:px-7">
          <span className="text-5xl text-[#D5B6A9]" aria-hidden="true">
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
      </section>

      {/* Appointment Information */}
      <section className="mt-7 border border-[#E6E1DD] bg-[#F5ECE8] p-5 sm:p-7">
        <div className="flex items-start gap-3">
          <span className="text-xl text-[#967467]" aria-hidden="true">
            ♡
          </span>

          <div>
            <h2 className="font-serif text-lg text-[#46322D]">
              Appointment Information
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#7A7470]">
              You can cancel pending appointments. Once an appointment is
              confirmed by our salon, payment will become available through
              our secure payment system.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
