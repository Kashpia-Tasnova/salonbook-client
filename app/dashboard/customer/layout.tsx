
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  {
    label: "Overview",
    href: "/dashboard/customer",
    icon: "⌂",
  },
  {
    label: "My Appointments",
    href: "/dashboard/customer/appointments",
    icon: "◷",
  },
  {
    label: "My Profile",
    href: "/dashboard/customer/profile",
    icon: "♡",
  },
];

export default function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#FDFCFC]">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[250px_1fr] lg:gap-8 lg:px-8 lg:py-10">
        {/* Customer Dashboard Sidebar */}
        <aside className="h-fit border border-[#E6E1DD] bg-white p-4 lg:sticky lg:top-8">
          <div className="mb-5 px-3 pt-2">
            <p className="font-serif text-xl text-[#46322D]">
              My Dashboard
            </p>

            <p className="mt-1 text-xs text-[#A39A94]">
              Your personal salon space
            </p>
          </div>

          <nav
            aria-label="Customer dashboard navigation"
            className="flex gap-2 overflow-x-auto lg:flex-col"
          >
            {navigation.map((item) => {
              const isActive =
                item.href === "/dashboard/customer"
                  ? pathname === item.href
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex shrink-0 items-center gap-3 px-4 py-3 text-sm transition ${
                    isActive
                      ? "bg-[#F5ECE8] font-medium text-[#967467]"
                      : "text-[#7A7470] hover:bg-[#FDFCFC] hover:text-[#46322D]"
                  }`}
                >
                  <span className="text-lg" aria-hidden="true">
                    {item.icon}
                  </span>

                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Dashboard Page Content */}
        <section className="min-w-0">{children}</section>
      </div>
    </div>
  );
}
