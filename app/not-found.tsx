
"use client";

import Link from "next/link";
import { Home, Scissors, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#FFF9F6] px-4 py-12">
      <div className="w-full max-w-xl text-center">
        <div className="flex justify-center mb-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#F8E5E5]">
            <Scissors className="h-10 w-10 text-[#B76E79]" />
          </div>
        </div>

        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#B76E79]">
          SalonBook – Blush & Bloom
        </p>

        <h1 className="text-8xl font-bold text-[#B76E79] sm:text-9xl">
          404
        </h1>

        <h2 className="mt-5 text-2xl font-semibold text-[#3D3030] sm:text-3xl">
          Oops! Page Not Found
        </h2>

        <p className="mx-auto mt-4 max-w-md text-base leading-7 text-gray-600">
          Sorry, the page you are looking for doesn't exist or may have been
          moved. Let's get you back to a beautiful experience!
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-[#B76E79] px-7 py-3 font-medium text-white transition hover:bg-[#9F5965]"
          >
            <Home size={18} />
            Back to Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 rounded-full border border-[#B76E79] px-7 py-3 font-medium text-[#B76E79] transition hover:bg-[#F8E5E5]"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>
      </div>
    </main>
  );
}
