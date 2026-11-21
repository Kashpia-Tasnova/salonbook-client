
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  CreditCard,
  Scissors,
  User,
  MessageSquare,
  Loader2,
  XCircle,
} from "lucide-react";

interface Appointment {
  _id: string;
  serviceId: string;
  serviceName: string;
  serviceImage?: string;
  serviceCategory?: string;
  price: number;
  duration: number;
  appointmentDate: string;
  time: string;
  message?: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  paymentStatus: "unpaid" | "paid";
  createdAt: string;
}

const statusStyles: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700",
  confirmed: "bg-blue-50 text-blue-700",
  completed: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-700",
};

function formatDate(date: string) {
  if (!date) return "Date unavailable";

  const datePart = date.split("T")[0];
  const [year, month, day] = datePart.split("-").map(Number);

  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function AppointmentDetailsPage() {
  const params = useParams();
  const appointmentId = params.id as string;

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const fetchAppointment = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/protected/customer/appointments/${appointmentId}`,
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
            signal: controller.signal,
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load appointment details."
          );
        }

        const result =
          data.appointment ||
          data.data?.appointment ||
          data.data;

        if (!result || Array.isArray(result)) {
          throw new Error("Appointment not found.");
        }

        setAppointment(result);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    if (appointmentId) {
      fetchAppointment();
    }

    return () => controller.abort();
  }, [appointmentId]);

  const handleCancel = async () => {
    if (!appointment) return;

    const confirmed = window.confirm(
      "Are you sure you want to cancel this appointment?"
    );

    if (!confirmed) return;

    try {
      setCancelling(true);

      const response = await fetch(
        `/api/protected/customer/appointments/${appointment._id}/cancel`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to cancel appointment.");
      }

      setAppointment((previous) =>
        previous
          ? {
              ...previous,
              status: "cancelled",
            }
          : null
      );
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#B39A7D]" />
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <XCircle className="w-12 h-12 text-red-400 mb-4" />

        <h2 className="text-xl font-semibold text-[#46322D]">
          Appointment Not Found
        </h2>

        <p className="text-[#7A7470] mt-2">
          {error || "We could not find this appointment."}
        </p>

        <Link
          href="/dashboard/customer/appointments"
          className="mt-6 inline-flex items-center gap-2 bg-[#46322D] text-white px-5 py-3 rounded-lg hover:bg-[#2B2927] transition"
        >
          <ArrowLeft size={17} />
          Back to My Appointments
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <Link
        href="/dashboard/customer/appointments"
        className="inline-flex items-center gap-2 text-sm text-[#7A7470] hover:text-[#967467] transition mb-7"
      >
        <ArrowLeft size={17} />
        Back to My Appointments
      </Link>

      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.2em] text-[#B39A7D] mb-2">
          Appointment Information
        </p>

        <h1 className="text-2xl md:text-3xl font-semibold text-[#46322D]">
          Appointment Details
        </h1>

        <p className="text-sm text-[#7A7470] mt-2">
          View your booking information and appointment status.
        </p>
      </div>

      <div className="bg-white border border-[#E6E1DD] rounded-2xl overflow-hidden">
        {/* Service Information */}
        <div className="p-5 md:p-7 border-b border-[#E6E1DD]">
          <div className="flex flex-col sm:flex-row gap-5">
            {appointment.serviceImage ? (
              <img
                src={appointment.serviceImage}
                alt={appointment.serviceName}
                className="w-full sm:w-40 h-48 sm:h-36 object-cover rounded-xl"
              />
            ) : (
              <div className="w-full sm:w-40 h-48 sm:h-36 rounded-xl bg-[#F5ECE8] flex items-center justify-center">
                <Scissors className="w-10 h-10 text-[#B39A7D]" />
              </div>
            )}

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                    statusStyles[appointment.status] ||
                    "bg-gray-100 text-gray-700"
                  }`}
                >
                  {appointment.status}
                </span>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                    appointment.paymentStatus === "paid"
                      ? "bg-green-50 text-green-700"
                      : "bg-orange-50 text-orange-700"
                  }`}
                >
                  {appointment.paymentStatus}
                </span>
              </div>

              <h2 className="text-xl font-semibold text-[#46322D]">
                {appointment.serviceName}
              </h2>

              {appointment.serviceCategory && (
                <p className="text-sm text-[#967467] mt-1">
                  {appointment.serviceCategory}
                </p>
              )}

              <div className="flex flex-wrap gap-5 mt-4">
                <p className="text-sm text-[#7A7470]">
                  <span className="text-[#46322D] font-semibold">
                    ${Number(appointment.price).toLocaleString("en-BD")}
                  </span>
                  <span className="ml-1">service price</span>
                </p>

                <p className="text-sm text-[#7A7470]">
                  {appointment.duration} minutes
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Appointment Schedule */}
        <div className="p-5 md:p-7 border-b border-[#E6E1DD]">
          <h3 className="text-lg font-semibold text-[#46322D] mb-5">
            Booking Schedule
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#F5ECE8] flex items-center justify-center">
                <CalendarDays className="w-5 h-5 text-[#967467]" />
              </div>

              <div>
                <p className="text-xs text-[#7A7470]">
                  Appointment Date
                </p>

                <p className="text-sm font-medium text-[#46322D] mt-1">
                  {formatDate(appointment.appointmentDate)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#F5ECE8] flex items-center justify-center">
                <Clock className="w-5 h-5 text-[#967467]" />
              </div>

              <div>
                <p className="text-xs text-[#7A7470]">
                  Appointment Time
                </p>

                <p className="text-sm font-medium text-[#46322D] mt-1">
                  {appointment.time}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="p-5 md:p-7 border-b border-[#E6E1DD]">
          <h3 className="text-lg font-semibold text-[#46322D] mb-5">
            Payment Information
          </h3>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#F5ECE8] flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-[#967467]" />
            </div>

            <div>
              <p className="text-xs text-[#7A7470]">
                Payment Status
              </p>

              <p className="text-sm font-medium text-[#46322D] mt-1 capitalize">
                {appointment.paymentStatus}
              </p>

              <p className="text-xs text-[#7A7470] mt-1">
                {appointment.paymentStatus === "paid"
                  ? "Your payment has been received."
                  : appointment.status === "confirmed"
                    ? "Your appointment is confirmed. Payment will be available soon."
                    : "Payment will be available after your appointment is confirmed by the admin."}
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center mt-6 pt-5 border-t border-[#E6E1DD]">
            <span className="text-sm text-[#7A7470]">
              Total Amount
            </span>

            <span className="text-xl font-semibold text-[#46322D]">
              ${Number(appointment.price).toLocaleString("en-BD")}
            </span>
          </div>
        </div>

        {/* Customer Message */}
        {appointment.message && (
          <div className="p-5 md:p-7 border-b border-[#E6E1DD]">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-5 h-5 text-[#967467]" />

              <h3 className="text-lg font-semibold text-[#46322D]">
                Your Message
              </h3>
            </div>

            <p className="text-sm text-[#7A7470] leading-6">
              {appointment.message}
            </p>
          </div>
        )}

        {/* Booking Date */}
        <div className="p-5 md:p-7">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#F5ECE8] flex items-center justify-center">
              <User className="w-5 h-5 text-[#967467]" />
            </div>

            <div>
              <p className="text-xs text-[#7A7470]">
                Booking Created
              </p>

              <p className="text-sm font-medium text-[#46322D] mt-1">
                {new Date(appointment.createdAt).toLocaleDateString(
                  "en-US",
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Cancel Appointment */}
        {appointment.status === "pending" && (
          <div className="px-5 md:px-7 pb-7">
            <button
              type="button"
              onClick={handleCancel}
              disabled={cancelling}
              className="w-full sm:w-auto px-6 py-3 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancelling ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  Cancelling...
                </span>
              ) : (
                "Cancel Appointment"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
