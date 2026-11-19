
"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (formData.fullName.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (
      !/[A-Z]/.test(formData.password) ||
      !/[a-z]/.test(formData.password)
    ) {
      setError(
        "Password must contain at least one uppercase and one lowercase letter."
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError(
      "Registration will be available after authentication is connected."
    );
  };

  return (
    <main className="min-h-screen bg-background-soft px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl bg-white shadow-sm lg:grid-cols-2">

        {/* Left Side - Full Image */}
        <div className="relative hidden min-h-[650px] overflow-hidden lg:block">
          <img
            src="https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&w=1200&q=90"
            alt="Blush and Bloom beauty salon"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 p-9 text-white">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/80">
              Blush & Bloom
            </p>

            <h1 className="font-heading text-4xl leading-tight text-white">
              Your beauty,
              <span className="block italic">your moment.</span>
            </h1>

            <p className="mt-3 max-w-sm text-xs leading-6 text-white/85">
              Discover a place where expert care meets a little everyday
              luxury. Your beauty journey begins here.
            </p>
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <div className="flex items-center justify-center px-6 py-7 sm:px-10 lg:px-12">
          <div className="w-full max-w-sm">

            {/* Brand */}
            <Link href="/" className="inline-block">
              <span className="font-heading text-xl text-heading">
                Blush <span className="italic text-accent-brown">& Bloom</span>
              </span>
            </Link>

            <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.22em] text-accent-brown">
              Beauty Salon & Wellness Studio
            </p>

            {/* Heading */}
            <div className="mb-5 mt-6">
              <h2 className="font-heading text-2xl text-heading sm:text-3xl">
                Create your account
              </h2>

              <p className="mt-2 text-xs leading-5 text-foreground">
                Join Blush & Bloom and make time for yourself.
              </p>
            </div>

            {/* Google Signup */}
            <button
              type="button"
              onClick={() =>
                setError("Google authentication will be connected later.")
              }
              className="flex w-full items-center justify-center gap-3 rounded-full border border-border px-4 py-2.5 text-xs font-semibold text-heading transition hover:bg-background-soft"
            >
              <svg
                viewBox="0 0 48 48"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"
                  transform="translate(0 5)"
                />
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.42-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.75 7.18l7.72 5.99c4.51-4.17 7.07-10.3 7.07-17.64Z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59a14.4 14.4 0 0 1 0-9.18l-7.98-6.19a23.9 23.9 0 0 0 0 21.56l7.98-6.19Z"
                  transform="translate(0 5)"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.47 0 11.91-2.13 15.88-5.81l-7.72-5.99c-2.14 1.45-4.88 2.3-8.16 2.3-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"
                  transform="translate(0 -5)"
                />
              </svg>

              Continue with Google
            </button>

            {/* Divider */}
            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />

              <span className="text-[10px] text-foreground">
                OR SIGN UP WITH EMAIL
              </span>

              <div className="h-px flex-1 bg-border" />
            </div>

            {/* Signup Form */}
            <form onSubmit={handleSubmit} className="space-y-3">

              {/* Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-1 block text-[11px] font-semibold text-heading"
                >
                  Full Name
                </label>

                <input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  required
                  className="w-full rounded-xl border border-border bg-background-soft px-3.5 py-2.5 text-xs text-heading outline-none transition placeholder:text-foreground/60 focus:border-primary"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-1 block text-[11px] font-semibold text-heading"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="w-full rounded-xl border border-border bg-background-soft px-3.5 py-2.5 text-xs text-heading outline-none transition placeholder:text-foreground/60 focus:border-primary"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-1 block text-[11px] font-semibold text-heading"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                    className="w-full rounded-xl border border-border bg-background-soft px-3.5 py-2.5 pr-16 text-xs text-heading outline-none transition placeholder:text-foreground/60 focus:border-primary"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-accent-brown"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                <p className="mt-1 text-[10px] leading-4 text-foreground">
                  At least 6 characters, including one uppercase and one
                  lowercase letter.
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-1 block text-[11px] font-semibold text-heading"
                >
                  Confirm Password
                </label>

                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    required
                    className="w-full rounded-xl border border-border bg-background-soft px-3.5 py-2.5 pr-16 text-xs text-heading outline-none transition placeholder:text-foreground/60 focus:border-primary"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-accent-brown"
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <p
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700"
                >
                  {error}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                className="w-full rounded-full bg-primary px-5 py-3 text-xs font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-hover"
              >
                Create Account
              </button>
            </form>

            {/* Sign In Link */}
            <p className="mt-5 text-center text-xs text-foreground">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="font-semibold text-accent-brown transition hover:text-heading"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
