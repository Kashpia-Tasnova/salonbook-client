"use client";

import Link from "next/link";
import { useState } from "react";

type Appointment = {
  id: number;
  service: string;
  category: string;
  date: string;
  time: string;
  price: number;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  paymentStatus: "Paid" | "Unpaid";
  image: string;
};

const initialAppointments: Appointment[] = [
  {
    id: 1,
    service: "HydraFacial Treatment",
    category: "Facial & Skincare",
    date: "25 November 2026",
    time: "11:00 AM",
    price: 3500,
    status: "Confirmed",
    paymentStatus: "Unpaid",
    image:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=500&q=85",
  },
  {
    id: 2,
    service: "Layer Haircut",
    category: "Haircut & Styling",
    date: "28 November 2026",
    time: "02:00 PM",
    price: 1200,
    status: "Pending",
    paymentStatus: "Unpaid",
    image:
      "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=500&q=85",
  },
  {
    id: 3,
    service: "Gel Manicure",
    category: "Manicure & Pedicure",
    date: "12 November 2026",
    time: "04:00 PM",
    price: 1800,
    status: "Completed",
    paymentStatus: "Paid",
    image:
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=500&q=85",
  },
];

export default function CustomerDashboard() {
  const [appointments, setAppointments] =
    useState<Appointment[]>(initialAppointments);

  const [activeFilter, setActiveFilter] = useState("All");

  const filteredAppointments =
    activeFilter === "All"
      ? appointments
      : appointments.filter(
          (appointment) => appointment.status === activeFilter
        );

  const totalAppointments = appointments.length;

  const pendingAppointments = appointments.filter(
    (appointment) => appointment.status === "Pending"
  ).length;

  const confirmedAppointments = appointments.filter(
    (appointment) => appointment.status === "Confirmed"
  ).length;

  const completedAppointments = appointments.filter(
    (appointment) => appointment.status === "Completed"
  ).length;

  const handleCancel = (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this appointment?"
    );

    if (!confirmed) return;

    setAppointments((previous) =>
      previous.map((appointment) =>
        appointment.id === id
          ? { ...appointment, status: "Cancelled" }
          : appointment
      )
    );
  };

  const getStatusStyle = (status: Appointment["status"]) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-50 text-green-700";
      case "Pending":
        return "bg-amber-50 text-amber-700";
      case "Completed":
        return "bg-blue-50 text-blue-700";
      case "Cancelled":
        return "bg-red-50 text-red-700";
    }
  };

  const stats = [
    {
      title: "Total Appointments",
      value: totalAppointments,
      icon: "✦",
      description: "All your bookings",
    },
    {
      title: "Pending",
      value: pendingAppointments,
      icon: "◷",
      description: "Awaiting confirmation",
    },
    {
      title: "Confirmed",
      value: confirmedAppointments,
      icon: "✓",
      description: "Ready for your visit",
    },
    {
      title: "Completed",
      value: completedAppointments,
      icon: "♡",
      description: "Your salon visits",
    },
  ];

  return (
    <main className="min-h-screen bg-[#FDFCFC]">
      {/* Dashboard Header */}
      <header className="border-b border-[#E6E1DD] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl text-[#B39A7D]">✿</span>
            <span className="font-serif text-xl font-semibold text-[#46322D]">
              Blush & Bloom
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/services"
              className="hidden text-sm text-[#7A7470] transition hover:text-[#B39A7D] sm:block"
            >
              Browse Services
            </Link>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F5ECE8] font-serif text-lg text-[#967467]">
              K
            </div>

            <div className="hidden sm:block">
              <p className="text-sm font-medium text-[#46322D]">
                Welcome back
              </p>
              <p className="text-xs text-[#7A7470]">Customer</p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-10">
        {/* Welcome Section */}
        <section className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-sm tracking-[0.2em] text-[#B39A7D] uppercase">
              Customer Dashboard
            </p>

            <h1 className="font-serif text-3xl text-[#46322D] sm:text-4xl">
              Welcome back, beautiful!
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
        <section className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="border border-[#E6E1DD] bg-white p-5 transition hover:shadow-sm"
            >
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-[#7A7470]">{stat.title}</p>

                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F5ECE8] text-xl text-[#967467]">
                  {stat.icon}
                </span>
              </div>

              <p className="font-serif text-3xl text-[#46322D]">
                {stat.value}
              </p>

              <p className="mt-1 text-xs text-[#A39A94]">
                {stat.description}
              </p>
            </div>
          ))}
        </section>

        {/* Appointments */}
        <section className="border border-[#E6E1DD] bg-white">
          <div className="flex flex-col justify-between gap-4 border-b border-[#E6E1DD] p-5 sm:flex-row sm:items-center sm:px-7 sm:py-6">
            <div>
              <h2 className="font-serif text-2xl text-[#46322D]">
                My Appointments
              </h2>
              <p className="mt-1 text-sm text-[#7A7470]">
                Keep track of all your salon visits.
              </p>
            </div>

            <Link
              href="/services"
              className="text-sm font-medium text-[#967467] transition hover:text-[#B39A7D]"
            >
              Explore more services →
            </Link>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 border-b border-[#E6E1DD] px-5 py-4 sm:px-7">
            {["All", "Pending", "Confirmed", "Completed", "Cancelled"].map(
              (filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 text-xs font-medium transition ${
                    activeFilter === filter
                      ? "bg-[#B39A7D] text-white"
                      : "bg-[#FDFCFC] text-[#7A7470] hover:bg-[#F5ECE8]"
                  }`}
                >
                  {filter}
                </button>
              )
            )}
          </div>

          {/* Appointment List */}
          <div className="divide-y divide-[#E6E1DD]">
            {filteredAppointments.length === 0 ? (
              <div className="px-5 py-16 text-center">
                <span className="text-4xl text-[#D5B6A9]">✿</span>
                <h3 className="mt-4 font-serif text-xl text-[#46322D]">
                  No appointments found
                </h3>
                <p className="mt-2 text-sm text-[#7A7470]">
                  Your appointments will appear here.
                </p>
                <Link
                  href="/services"
                  className="mt-5 inline-block bg-[#B39A7D] px-5 py-3 text-sm text-white hover:bg-[#967467]"
                >
                  Explore Services
                </Link>
              </div>
            ) : (
              filteredAppointments.map((appointment) => (
                <article
                  key={appointment.id}
                  className="flex flex-col gap-4 p-5 sm:px-7 sm:py-6 lg:flex-row lg:items-center"
                >
                  {/* Service Information */}
                  <div className="flex min-w-0 flex-1 items-center gap-4">
                    <img
                      src={appointment.image}
                      alt={appointment.service}
                      className="h-20 w-20 shrink-0 object-cover sm:h-24 sm:w-24"
                    />

                    <div className="min-w-0">
                      <p className="mb-1 text-xs text-[#B39A7D]">
                        {appointment.category}
                      </p>

                      <h3 className="font-serif text-lg text-[#46322D]">
                        {appointment.service}
                      </h3>

                      <p className="mt-1 text-sm text-[#7A7470]">
                        {appointment.date}
                      </p>

                      <p className="text-sm text-[#7A7470]">
                        {appointment.time}
                      </p>
                    </div>
                  </div>

                  {/* Price and Status */}
                  <div className="flex flex-wrap items-center gap-5 lg:gap-7">
                    <div>
                      <p className="text-xs text-[#A39A94]">Service Price</p>
                      <p className="mt-1 font-medium text-[#46322D]">
                        ৳{appointment.price.toLocaleString("en-IN")}
                      </p>
                    </div>

                    <div>
                      <p className="mb-2 text-xs text-[#A39A94]">
                        Appointment
                      </p>
                      <span
                        className={`inline-block px-3 py-1 text-xs font-medium ${getStatusStyle(
                          appointment.status
                        )}`}
                      >
                        {appointment.status}
                      </span>
                    </div>

                    <div>
                      <p className="mb-2 text-xs text-[#A39A94]">Payment</p>
                      <span
                        className={`inline-block px-3 py-1 text-xs font-medium ${
                          appointment.paymentStatus === "Paid"
                            ? "bg-green-50 text-green-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {appointment.paymentStatus}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 lg:flex-col lg:items-stretch">
                    {appointment.status === "Confirmed" &&
                      appointment.paymentStatus === "Unpaid" && (
                        <button
                          disabled
                          title="Payment will be enabled after Stripe integration."
                          className="cursor-not-allowed bg-[#B39A7D] px-4 py-2 text-xs font-medium text-white opacity-60"
                        >
                          Pay Now
                        </button>
                      )}

                    {appointment.status === "Pending" && (
                      <button
                        onClick={() => handleCancel(appointment.id)}
                        className="border border-[#E6E1DD] px-4 py-2 text-xs text-[#967467] transition hover:border-red-300 hover:text-red-600"
                      >
                        Cancel
                      </button>
                    )}

                    <span className="text-xs text-[#A39A94]">
                      Booking #{appointment.id}
                    </span>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        {/* Bottom Note */}
        <div className="mt-7 border border-[#E6E1DD] bg-[#F5ECE8] px-5 py-5 sm:px-7">
          <div className="flex items-start gap-3">
            <span className="text-xl text-[#967467]">♡</span>
            <div>
              <h3 className="font-serif text-lg text-[#46322D]">
                A little reminder
              </h3>
              <p className="mt-1 text-sm text-[#7A7470]">
                Please arrive a few minutes before your appointment so you can
                relax and enjoy your experience at Blush & Bloom.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}