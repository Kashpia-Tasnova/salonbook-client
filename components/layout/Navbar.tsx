
"use client";

import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About Us", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

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
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
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

            <div className="flex items-center gap-5 border-t border-border pt-5">
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
          </div>
        </div>
      )}
    </header>
  );
}
