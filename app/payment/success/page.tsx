
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <main className="flex min-h-[75vh] items-center justify-center bg-[#FDFCFC] px-5 py-16">
      <section className="w-full max-w-lg border border-[#E6E1DD] bg-white p-8 text-center shadow-sm sm:p-12">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-4xl text-green-600">
          ✓
        </div>

        <p className="mt-7 text-xs uppercase tracking-[0.2em] text-[#B39A7D]">
          Blush & Bloom
        </p>

        <h1 className="mt-3 font-serif text-3xl text-[#46322D] sm:text-4xl">
          Thank You for Your Payment!
        </h1>

        <p className="mt-4 text-sm leading-7 text-[#7A7470]">
          Your payment process has been completed. Thank you for
          choosing Blush & Bloom. We look forward to welcoming you
          to our salon.
        </p>

        {!sessionId && (
          <p className="mt-4 text-xs text-amber-700">
            Payment session information is unavailable.
          </p>
        )}

        <Link
          href="/dashboard/customer/appointments"
          className="mt-8 inline-flex w-full items-center justify-center bg-[#B39A7D] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#967467]"
        >
          View My Appointments
        </Link>

        <Link
          href="/"
          className="mt-4 inline-block text-sm font-medium text-[#967467] transition hover:text-[#46322D]"
        >
          Back to Home
        </Link>
      </section>
    </main>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[75vh] items-center justify-center text-[#7A7470]">
          Loading payment information...
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
