
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";

const navigation = [
  {
    label: "Overview",
    href: "/dashboard/admin",
    icon: "⌂",
  },
  {
    label: "Manage Services",
    href: "/dashboard/admin/services",
    icon: "✿",
  },
  {
  label: "Manage Categories",
  href: "/dashboard/admin/categories",
  icon: "▦",
},
  {
    label: "Manage Appointments",
    href: "/dashboard/admin/appointments",
    icon: "◷",
  },
  {
    label: "Manage Users",
    href: "/dashboard/admin/users",
    icon: "♙",
  },
  {
    label: "Transactions",
    href: "/dashboard/admin/transactions",
    icon: "$",
  },
  {
    label: "My Profile",
    href: "/dashboard/admin/profile",
    icon: "♡",
  },
];

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;

  const userRole = (
    user as typeof user & { role?: string }
  )?.role;

  useEffect(() => {
    if (isPending) return;

    if (!user) {
      router.replace("/signin");
      return;
    }

    if (userRole !== "admin") {
      router.replace("/");
    }
  }, [isPending, user, userRole, router]);

  if (isPending || !user || userRole !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FDFCFC]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[#E6E1DD] border-t-[#B39A7D]" />
          <p className="mt-4 text-sm text-[#7A7470]">
            Loading admin dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCFC]">
      {/* Dashboard Layout */}
      <div className="mx-auto grid max-w-[1500px] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[250px_1fr] lg:gap-8 lg:px-8 lg:py-10">
        {/* Admin Sidebar */}
        <aside className="h-fit border border-[#E6E1DD] bg-white p-4 lg:sticky lg:top-8">
          <div className="mb-5 px-3 pt-2">
            <p className="font-serif text-xl text-[#46322D]">
              Admin Dashboard
            </p>

            <p className="mt-1 text-xs text-[#A39A94]">
              Manage your salon operations
            </p>
          </div>

          <nav
            aria-label="Admin dashboard navigation"
            className="flex gap-2 overflow-x-auto lg:flex-col"
          >
            {navigation.map((item) => {
              const isActive =
                item.href === "/dashboard/admin"
                  ? pathname === item.href
                  : pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);

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

        {/* Admin Page Content */}
        <section className="min-w-0">{children}</section>
      </div>
    </div>
  );
}
