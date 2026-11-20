
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About Us", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const user = session?.user;

  // Better Auth custom role will be used when role management is configured.
  const userRole = (
    user as typeof user & { role?: string }
  )?.role;

  const dashboardLink =
    userRole === "admin"
      ? "/dashboard/admin"
      : "/dashboard/customer";

  // Logout
  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      const result = await authClient.signOut();

      if (result.error) {
        console.error("Logout failed:", result.error);
        return;
      }

      setProfileOpen(false);
      setMenuOpen(false);

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // User avatar
  const UserAvatar = ({ size = "h-9 w-9" }: { size?: string }) => (
    <div
      className={`${size} flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-background-blush text-sm font-semibold text-accent-brown`}
    >
      {user?.image ? (
        <img
          src={user.image}
          alt={user.name || "User profile"}
          className="h-full w-full object-cover"
        />
      ) : (
        user?.name?.charAt(0).toUpperCase() || "U"
      )}
    </div>
  );

  // Profile dropdown
  const ProfileDropdown = () => (
    <div className="relative">
      <button
        type="button"
        onClick={() => setProfileOpen((previous) => !previous)}
        aria-expanded={profileOpen}
        aria-label="Open profile menu"
        className="flex items-center gap-2 rounded-full border border-border bg-[#F5ECE8] px-3 py-2 shadow-sm transition-all duration-200 hover:bg-[#E4DBD8]"
      >
        <UserAvatar />

        <span className="max-w-[120px] truncate text-[13px] font-medium text-heading">
          {user?.name || "My Account"}
        </span>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-accent-brown transition-transform ${
            profileOpen ? "rotate-180" : ""
          }`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {profileOpen && (
        <div className="absolute right-0 top-full z-50 mt-3 w-64 overflow-hidden rounded-2xl border border-border bg-white shadow-xl">
          {/* User Information */}
          <div className="flex items-center gap-3 border-b border-border px-4 py-4">
            <UserAvatar size="h-11 w-11" />

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-heading">
                {user?.name}
              </p>

              <p className="truncate text-xs text-foreground">
                {user?.email}
              </p>
            </div>
          </div>

          {/* Dropdown Links */}
          <div className="p-2">
            <Link
              href={dashboardLink}
              onClick={() => setProfileOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-heading-dark transition hover:bg-background-blush hover:text-accent-brown"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
              </svg>

              Dashboard
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-red-600 transition hover:bg-red-50 disabled:opacity-60"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <path d="M16 17l5-5-5-5" />
                <path d="M21 12H9" />
              </svg>

              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <nav className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
        {/* Brand */}
        <Link href="/" className="flex flex-col leading-none">
          <span className="font-heading text-[25px] font-medium tracking-wide text-heading sm:text-[28px]">
            Blush <span className="italic">&</span> Bloom
          </span>

          <span className="mt-1 text-[8px] font-medium uppercase tracking-[0.28em] text-accent-brown">
            Beauty Salon & Wellness Studio
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[13px] font-medium text-heading-dark transition-colors duration-200 hover:text-accent-brown"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-5 md:flex">
          {isPending ? (
            <div className="h-9 w-24 animate-pulse rounded-full bg-background-blush" />
          ) : user ? (
            <ProfileDropdown />
          ) : (
            <>
              <Link
                href="/signin"
                className="text-[13px] font-medium text-heading transition-colors hover:text-accent-brown"
              >
                Sign In
              </Link>

              <Link
                href="/signup"
                className="rounded-full bg-primary px-6 py-3 text-[12px] font-semibold text-white transition-all duration-300 hover:bg-primary-hover"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => {
            setMenuOpen((previous) => !previous);
            setProfileOpen(false);
          }}
          aria-label={
            menuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={menuOpen}
          className="flex h-10 w-10 items-center justify-center text-heading md:hidden"
        >
          {menuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            >
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="absolute left-0 top-full w-full border-t border-border bg-white px-6 py-6 shadow-lg md:hidden">
          <div className="flex flex-col gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium text-heading-dark transition-colors hover:text-accent-brown"
              >
                {link.label}
              </Link>
            ))}

            <div className="border-t border-border pt-5">
              {isPending ? (
                <div className="h-10 w-28 animate-pulse rounded-full bg-background-blush" />
              ) : user ? (
                <div className="flex flex-col gap-4">
                  {/* Mobile User Information */}
                  <div className="flex items-center gap-3 rounded-2xl border border-border bg-[#F5ECE8] p-3 shadow-sm">
                    <UserAvatar size="h-11 w-11" />

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-heading">
                        {user.name}
                      </p>

                      <p className="truncate text-xs text-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={dashboardLink}
                    onClick={() => setMenuOpen(false)}
                    className="text-sm font-medium text-heading transition hover:text-accent-brown"
                  >
                    Dashboard
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-fit text-sm font-medium text-red-600 disabled:opacity-60"
                  >
                    {isLoggingOut ? "Logging out..." : "Logout"}
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-5">
                  <Link
                    href="/signin"
                    onClick={() => setMenuOpen(false)}
                    className="text-sm font-medium text-heading"
                  >
                    Sign In
                  </Link>

                  <Link
                    href="/signup"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-full bg-primary px-6 py-3 text-xs font-semibold text-white"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
