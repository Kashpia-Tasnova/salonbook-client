
"use client";

import Link from "next/link";
import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

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

export default function SignupPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Profile image selection and preview
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError("");

    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setError("Please select a JPG, PNG, or WEBP image.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Profile image must be smaller than 5 MB.");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setProfileImage(file);
      setImagePreview(reader.result as string);
    };

    reader.onerror = () => {
      setError("Unable to preview this image. Please try another one.");
    };

    reader.readAsDataURL(file);
  };

  // Remove selected profile image
  const removeProfileImage = () => {
    setProfileImage(null);
    setImagePreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Google signup
  const handleGoogleSignup = async () => {
    setError("");
    setIsGoogleLoading(true);

    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });

      if (result.error) {
        setError(result.error.message || "Google signup failed.");
        setIsGoogleLoading(false);
      }
    } catch {
      setError("Unable to continue with Google. Please try again.");
      setIsGoogleLoading(false);
    }
  };

  // Email and password signup
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (formData.fullName.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
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

    setIsLoading(true);

    try {
      let profileImageUrl: string | undefined;

      // Upload profile image to ImgBB if the user selected one
      if (profileImage) {
        const uploadFormData = new FormData();

        uploadFormData.append("image", profileImage);

        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

        const uploadResponse = await fetch(
          `${apiUrl}/api/upload/profile-image`,
          {
            method: "POST",
            body: uploadFormData,
          }
        );

        const uploadResult = await uploadResponse.json();

        if (!uploadResponse.ok || !uploadResult.success) {
          throw new Error(
            uploadResult.message || "Profile image upload failed."
          );
        }

        profileImageUrl = uploadResult.imageUrl;

        if (!profileImageUrl) {
          throw new Error("Profile image URL was not returned.");
        }
      }

      // Create Better Auth account
      const result = await authClient.signUp.email({
        name: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        ...(profileImageUrl ? { image: profileImageUrl } : {}),
      });

      if (result.error) {
        throw new Error(result.error.message || "Registration failed.");
      }

      router.push("/signin?registered=true");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
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
              onClick={handleGoogleSignup}
              disabled={isGoogleLoading || isLoading}
              className="flex w-full items-center justify-center gap-3 rounded-full border border-border px-4 py-2.5 text-xs font-semibold text-heading transition hover:bg-background-soft disabled:cursor-not-allowed disabled:opacity-60"
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

              {isGoogleLoading ? "Connecting..." : "Continue with Google"}
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
                  autoComplete="name"
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
                  autoComplete="email"
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
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-border bg-background-soft px-3.5 py-2.5 pr-10 text-xs text-heading outline-none transition placeholder:text-foreground/60 focus:border-primary"
                  />

                  {formData.password.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowPassword((previous) => !previous)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-accent-brown transition hover:text-heading"
                    >
                      <PasswordEyeIcon visible={showPassword} />
                    </button>
                  )}
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
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-border bg-background-soft px-3.5 py-2.5 pr-10 text-xs text-heading outline-none transition placeholder:text-foreground/60 focus:border-primary"
                  />

                  {formData.confirmPassword.length > 0 && (
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword((previous) => !previous)
                      }
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-accent-brown transition hover:text-heading"
                    >
                      <PasswordEyeIcon visible={showConfirmPassword} />
                    </button>
                  )}
                </div>
              </div>

              {/* Profile Image Upload */}
              <div>
                <label className="mb-2 block text-[11px] font-semibold text-heading">
                  Profile Photo{" "}
                  <span className="font-normal text-foreground">(Optional)</span>
                </label>

                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-background-blush">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Profile image preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="25"
                        height="25"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-accent-brown"
                        aria-hidden="true"
                      >
                        <circle cx="12" cy="8" r="4" />
                        <path d="M5 21a7 7 0 0 1 14 0" />
                      </svg>
                    )}
                  </div>

                  <div className="min-w-0">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageChange}
                      className="hidden"
                      id="profileImage"
                    />

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-full border border-border px-3 py-2 text-[10px] font-semibold text-accent-brown transition hover:bg-background-blush"
                    >
                      {imagePreview ? "Change Photo" : "Upload Photo"}
                    </button>

                    {imagePreview && (
                      <button
                        type="button"
                        onClick={removeProfileImage}
                        className="ml-2 text-[10px] font-semibold text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}

                    <p className="mt-1 text-[9px] text-foreground">
                      JPG, PNG or WEBP · Maximum 5 MB
                    </p>
                  </div>
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
                disabled={isLoading || isGoogleLoading}
                className="w-full rounded-full bg-primary px-5 py-3 text-xs font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
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
