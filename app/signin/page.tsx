
"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-hot-toast";

function PasswordEyeIcon({ visible }: { visible: boolean }) {
  return visible ? (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m3 3 18 18" />
      <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
      <path d="M9.9 5.2A10.6 10.6 0 0 1 12 5c6.4 0 10 7 10 7a16 16 0 0 1-3 3.8" />
      <path d="M6.6 6.6C3.6 8.5 2 12 2 12s3.6 7 10 7c1 0 2-.2 2.9-.5" />
    </svg>
  );
}

export default function SigninPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  // Determine where the user should go after signing in.
  const redirectParam = searchParams.get("redirect");

  const redirectTo =
    redirectParam &&
    redirectParam.startsWith("/") &&
    !redirectParam.startsWith("//")
      ? redirectParam
      : "/";

  // Email and password sign in
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!formData.password) {
      setError("Please enter your password.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await authClient.signIn.email({
        email: formData.email.trim(),
        password: formData.password,
        callbackURL: redirectTo,
      });

      if (result.error) {
        const message =
          result.error.message || "Invalid email or password.";

        setError(message);
        toast.error(message);
        return;
      }

      toast.success("Welcome back! You have signed in successfully.");

      router.replace(redirectTo);
      router.refresh();
    } catch (error) {
      console.error("Sign in error:", error);

      const message = "Something went wrong. Please try again.";

      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Google sign in
  const handleGoogleSignIn = async () => {
    setError("");
    setIsGoogleLoading(true);

    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: redirectTo,
      });

      if (result.error) {
        const message =
          result.error.message || "Google sign in failed.";

        setError(message);
        toast.error(message);
        setIsGoogleLoading(false);
      }
    } catch (error) {
      console.error("Google sign in error:", error);

      const message =
        "Google sign in is unavailable. Please try again.";

      setError(message);
      toast.error(message);
      setIsGoogleLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background-soft px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl bg-white shadow-sm lg:grid-cols-2">

        {/* Left Side - Image */}
        <div className="relative hidden min-h-[600px] overflow-hidden lg:block">
          <img
            src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=90"
            alt="Blush and Bloom beauty salon interior"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 p-9 text-white">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/80">
              Blush & Bloom
            </p>

            <h1 className="font-heading text-4xl leading-tight text-white">
              Welcome back,
              <span className="block italic">beautiful.</span>
            </h1>

            <p className="mt-3 max-w-sm text-xs leading-6 text-white/85">
              Your little moment of relaxation is waiting. Sign in and continue
              your beauty journey with us.
            </p>
          </div>
        </div>

        {/* Right Side - Sign In Form */}
        <div className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-12">
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
            <div className="mb-6 mt-8">
              <h2 className="font-heading text-2xl text-heading sm:text-3xl">
                Welcome back
              </h2>

              <p className="mt-2 text-xs leading-5 text-foreground">
                Sign in to manage your appointments and enjoy your beauty
                experience.
              </p>
            </div>

            {/* Google Sign In */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading || isSubmitting}
              className="flex w-full items-center justify-center gap-3 rounded-full border border-border px-4 py-3 text-xs font-semibold text-heading transition hover:bg-background-soft disabled:cursor-not-allowed disabled:opacity-60"
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

              {isGoogleLoading
                ? "Connecting to Google..."
                : "Continue with Google"}
            </button>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />

              <span className="text-[10px] text-foreground">
                OR SIGN IN WITH EMAIL
              </span>

              <div className="h-px flex-1 bg-border" />
            </div>

            {/* Sign In Form */}
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-[11px] font-semibold text-heading"
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
                  autoComplete="email"
                  disabled={isSubmitting}
                  className="w-full rounded-xl border border-border bg-background-soft px-3.5 py-3 text-xs text-heading outline-none transition placeholder:text-foreground/60 focus:border-primary"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-[11px] font-semibold text-heading"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                    autoComplete="current-password"
                    disabled={isSubmitting}
                    className="w-full rounded-xl border border-border bg-background-soft px-3.5 py-3 pr-10 text-xs text-heading outline-none transition placeholder:text-foreground/60 focus:border-primary"
                  />

                  {formData.password.length > 0 && (
                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((previous) => !previous)
                      }
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-accent-brown transition hover:text-heading"
                    >
                      <PasswordEyeIcon visible={showPassword} />
                    </button>
                  )}
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
                disabled={isSubmitting || isGoogleLoading}
                className="w-full rounded-full bg-primary px-5 py-3 text-xs font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Signing in..." : "Sign In"}
              </button>
            </form>

            {/* Sign Up Link */}
            <p className="mt-6 text-center text-xs text-foreground">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="font-semibold text-accent-brown transition hover:text-heading"
              >
                Create Account
              </Link>
            </p>

          </div>
        </div>
      </div>
    </main>
  );
}
