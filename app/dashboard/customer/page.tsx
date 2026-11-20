
"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";

const stats = [
  {
    title: "Total Appointments",
    value: "0",
    icon: "✦",
    description: "All your bookings",
  },
  {
    title: "Pending",
    value: "0",
    icon: "◷",
    description: "Awaiting confirmation",
  },
  {
    title: "Confirmed",
    value: "0",
    icon: "✓",
    description: "Ready for your visit",
  },
  {
    title: "Completed",
    value: "0",
    icon: "♡",
    description: "Your salon visits",
  },
];

export default function CustomerDashboard() {
  const { data: session, isPending } = authClient.useSession();

  const customerName = session?.user?.name?.trim() || "there";

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

      {/* Recent Appointments */}
      <section className="border border-[#E6E1DD] bg-white">
        <div className="flex flex-col justify-between gap-3 border-b border-[#E6E1DD] p-5 sm:flex-row sm:items-center sm:px-7 sm:py-6">
          <div>
            <h2 className="font-serif text-2xl text-[#46322D]">
              Recent Appointments
            </h2>
            <p className="mt-1 text-sm text-[#7A7470]">
              Your latest salon bookings will appear here.
            </p>
          </div>

          <Link
            href="/dashboard/customer/appointments"
            className="text-sm font-medium text-[#967467] transition hover:text-[#B39A7D]"
          >
            View All →
          </Link>
        </div>

        <div className="px-5 py-14 text-center sm:px-7">
          <span className="text-4xl text-[#D5B6A9]">✿</span>

          <h3 className="mt-4 font-serif text-xl text-[#46322D]">
            Your beauty journey starts here
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#7A7470]">
            You haven't made any appointments yet. Explore our salon services
            and book your first appointment.
          </p>

          <Link
            href="/services"
            className="mt-5 inline-block bg-[#B39A7D] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#967467]"
          >
            Explore Services
          </Link>
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
