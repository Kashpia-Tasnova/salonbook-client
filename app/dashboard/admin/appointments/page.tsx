
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  CalendarDays,
  Clock3,
  Search,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Check,
  Eye,
  Users,
  Loader2,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  X,
} from "lucide-react";
import { toast } from "react-hot-toast";

type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed";

type Appointment = {
  _id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  serviceId: string;
  serviceName: string;
  serviceImage?: string;
  serviceCategory?: string;
  price: number;
  duration: number;
  appointmentDate: string;
  time: string;
  message?: string;
  status: AppointmentStatus;
  paymentStatus: "paid" | "unpaid";
  createdAt: string;
};

type StatusFilter = "all" | AppointmentStatus;

const normalizeStatus = (value: unknown): AppointmentStatus => {
  const normalized = String(value || "")
    .trim()
    .toLowerCase();

  if (normalized === "confirmed") return "confirmed";
  if (normalized === "cancelled" || normalized === "canceled") {
    return "cancelled";
  }
  if (normalized === "completed" || normalized === "complete") {
    return "completed";
  }

  return "pending";
};

const statusStyles: Record<AppointmentStatus, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  confirmed: "bg-blue-50 text-blue-700 border-blue-200",
  completed: "bg-green-50 text-green-700 border-green-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

const formatDate = (date: string) => {
  if (!date) return "—";

  const parsedDate = new Date(`${date.slice(0, 10)}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) return "—";

  return parsedDate.toLocaleDateString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatStatus = (status: AppointmentStatus) =>
  status.charAt(0).toUpperCase() + status.slice(1);

const normalizeAppointment = (item: Appointment): Appointment => ({
  ...item,
  status: normalizeStatus(item.status),
  paymentStatus:
    String(item.paymentStatus || "").trim().toLowerCase() === "paid"
      ? "paid"
      : "unpaid",
});

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [refreshCount, setRefreshCount] = useState(0);
  const [expandedAppointmentId, setExpandedAppointmentId] =
    useState<string | null>(null);
  const [appointmentToCancel, setAppointmentToCancel] =
    useState<Appointment | null>(null);

  // Fetch all appointments
  const loadAppointments = useCallback(async (signal: AbortSignal) => {
    try {
      setError("");

      const response = await fetch(
        "/api/protected/admin/appointments",
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
          signal,
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to load appointments."
        );
      }

      const normalizedAppointments = (
        Array.isArray(data.appointments) ? data.appointments : []
      ).map(normalizeAppointment);

      setAppointments(normalizedAppointments);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading appointments."
      );
    } finally {
      if (!signal.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const startLoading = async () => {
      await Promise.resolve();

      if (!controller.signal.aborted) {
        await loadAppointments(controller.signal);
      }
    };

    startLoading();

    return () => controller.abort();
  }, [loadAppointments, refreshCount]);

  // Search and filter appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      const matchesStatus =
        statusFilter === "all" ||
        normalizeStatus(appointment.status) === statusFilter;

      const searchText = search.trim().toLowerCase();

      const matchesSearch =
        !searchText ||
        appointment.customerName?.toLowerCase().includes(searchText) ||
        appointment.customerEmail?.toLowerCase().includes(searchText) ||
        appointment.serviceName?.toLowerCase().includes(searchText);

      return matchesStatus && matchesSearch;
    });
  }, [appointments, search, statusFilter]);

  // Appointment statistics
  const counts = useMemo(
    () => ({
      all: appointments.length,
      pending: appointments.filter(
        (a) => normalizeStatus(a.status) === "pending"
      ).length,
      confirmed: appointments.filter(
        (a) => normalizeStatus(a.status) === "confirmed"
      ).length,
      completed: appointments.filter(
        (a) => normalizeStatus(a.status) === "completed"
      ).length,
      cancelled: appointments.filter(
        (a) => normalizeStatus(a.status) === "cancelled"
      ).length,
    }),
    [appointments]
  );

  // Update appointment status
  const updateStatus = async (
    appointment: Appointment,
    status: "confirmed" | "cancelled" | "completed"
  ) => {
    const actionText =
      status === "confirmed"
        ? "Confirming appointment..."
        : status === "cancelled"
          ? "Cancelling appointment..."
          : "Completing appointment...";

    const toastId = toast.loading(actionText);

    try {
      setUpdatingId(appointment._id);

      const response = await fetch(
        `/api/protected/admin/appointments/${appointment._id}/status`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to update appointment."
        );
      }

      setAppointments((current) =>
        current.map((item) =>
          item._id === appointment._id
            ? normalizeAppointment({
                ...item,
                ...data.appointment,
                status: data.appointment?.status || status,
              })
            : item
        )
      );

      toast.success(
        `Appointment ${status} successfully!`,
        { id: toastId }
      );

      setAppointmentToCancel(null);
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Unable to update appointment.",
        { id: toastId }
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const refreshAppointments = () => {
    setLoading(true);
    setRefreshCount((count) => count + 1);
  };

  const filterOptions: {
    label: string;
    value: StatusFilter;
  }[] = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Confirmed", value: "confirmed" },
    { label: "Completed", value: "completed" },
    { label: "Cancelled", value: "cancelled" },
  ];

  return (
    <div className="min-h-screen bg-[#FDFCFC] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Page heading */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#B39A7D]">
              Administration
            </p>

            <h1 className="text-2xl font-semibold text-[#46322D] sm:text-3xl">
              Manage Appointments
            </h1>

            <p className="mt-2 text-sm text-[#7A7470]">
              View and manage all customer appointment requests.
            </p>
          </div>

          <button
            type="button"
            onClick={refreshAppointments}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 border border-[#E6E1DD] bg-white px-5 py-3 text-sm font-medium text-[#46322D] transition hover:border-[#B39A7D] disabled:opacity-60"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* Summary cards */}
        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="border border-[#E6E1DD] bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#7A7470]">
                Total Appointments
              </p>
              <CalendarDays size={19} className="text-[#B39A7D]" />
            </div>
            <p className="mt-3 text-3xl font-semibold text-[#46322D]">
              {counts.all}
            </p>
          </div>

          <div className="border border-[#E6E1DD] bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#7A7470]">Pending</p>
              <Clock3 size={19} className="text-amber-600" />
            </div>
            <p className="mt-3 text-3xl font-semibold text-[#46322D]">
              {counts.pending}
            </p>
          </div>

          <div className="border border-[#E6E1DD] bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#7A7470]">Confirmed</p>
              <CheckCircle2 size={19} className="text-blue-600" />
            </div>
            <p className="mt-3 text-3xl font-semibold text-[#46322D]">
              {counts.confirmed}
            </p>
          </div>

          <div className="border border-[#E6E1DD] bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#7A7470]">Completed</p>
              <CheckCircle2 size={19} className="text-green-600" />
            </div>
            <p className="mt-3 text-3xl font-semibold text-[#46322D]">
              {counts.completed}
            </p>
          </div>
        </div>

        {/* Search and filters */}
        <div className="mb-6 border border-[#E6E1DD] bg-white p-4 sm:p-5">
          <div className="relative mb-5">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#967467]"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by customer name, email or service..."
              className="w-full border border-[#E6E1DD] bg-[#FDFCFC] py-3 pl-11 pr-4 text-sm text-[#46322D] outline-none transition placeholder:text-[#A49B96] focus:border-[#B39A7D]"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setStatusFilter(option.value)}
                className={`px-4 py-2 text-xs font-semibold transition ${
                  statusFilter === option.value
                    ? "bg-[#46322D] text-white"
                    : "border border-[#E6E1DD] bg-white text-[#7A7470] hover:border-[#B39A7D] hover:text-[#46322D]"
                }`}
              >
                {option.label}
                <span className="ml-2 opacity-70">
                  {counts[option.value]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Error state */}
        {error && (
          <div className="mb-6 flex flex-col gap-3 border border-red-200 bg-red-50 p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-red-700">{error}</p>

            <button
              type="button"
              onClick={refreshAppointments}
              className="text-sm font-semibold text-red-700 underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Loading state */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse border border-[#E6E1DD] bg-white p-6"
              >
                <div className="mb-4 h-5 w-1/3 bg-[#F0ECE9]" />
                <div className="h-4 w-2/3 bg-[#F0ECE9]" />
                <div className="mt-5 h-10 w-full bg-[#F0ECE9]" />
              </div>
            ))}
          </div>
        ) : !error && filteredAppointments.length === 0 ? (
          <div className="border border-[#E6E1DD] bg-white px-6 py-16 text-center">
            <Users size={36} className="mx-auto text-[#B39A7D]" />

            <h2 className="mt-4 text-lg font-semibold text-[#46322D]">
              No appointments found
            </h2>

            <p className="mt-2 text-sm text-[#7A7470]">
              {search || statusFilter !== "all"
                ? "Try changing your search or filter."
                : "Customer appointments will appear here."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => (
              <div
                key={appointment._id}
                className="border border-[#E6E1DD] bg-white p-5 transition hover:border-[#D5B6A9] sm:p-6"
              >
                {/* Main appointment information */}
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex min-w-0 flex-1 flex-col gap-4 sm:flex-row">
                    {/* Service image */}
                    <div className="relative h-24 w-full shrink-0 overflow-hidden bg-[#F5ECE8] sm:h-24 sm:w-28">
                      {appointment.serviceImage ? (
                        <Image
                          src={appointment.serviceImage}
                          alt={appointment.serviceName}
                          fill
                          sizes="112px"
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-[#967467]">
                          No image
                        </div>
                      )}
                    </div>

                    {/* Service and customer information */}
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span
                          className={`border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${
                            statusStyles[appointment.status]
                          }`}
                        >
                          {formatStatus(appointment.status)}
                        </span>

                        <span className="text-xs text-[#A49B96]">
                          {appointment.serviceCategory || "Salon Service"}
                        </span>
                      </div>

                      <h2 className="text-lg font-semibold text-[#46322D]">
                        {appointment.serviceName || "Salon Service"}
                      </h2>

                      <div className="mt-2 space-y-1 text-sm text-[#7A7470]">
                        <p>
                          Customer:{" "}
                          <span className="font-medium text-[#46322D]">
                            {appointment.customerName}
                          </span>
                        </p>

                        <p className="break-all">
                          Email: {appointment.customerEmail}
                        </p>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#7A7470]">
                        <span className="inline-flex items-center gap-1.5">
                          <CalendarDays size={14} />
                          {formatDate(appointment.appointmentDate)}
                        </span>

                        <span className="inline-flex items-center gap-1.5">
                          <Clock3 size={14} />
                          {appointment.time}
                        </span>

                        <span>{appointment.duration} minutes</span>
                      </div>

                      {appointment.message && (
                        <p className="mt-3 border-l-2 border-[#D5B6A9] pl-3 text-xs leading-relaxed text-[#7A7470]">
                          Message: {appointment.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Price and payment */}
                  <div className="flex items-center justify-between gap-4 border-t border-[#F0ECE9] pt-4 lg:min-w-40 lg:flex-col lg:items-end lg:border-0 lg:pt-0">
                    <div className="lg:text-right">
                      <p className="text-xs text-[#A49B96]">
                        Service Price
                      </p>

                      <p className="mt-1 text-xl font-semibold text-[#46322D]">
                        ${appointment.price?.toLocaleString("en-BD")}
                      </p>
                    </div>

                    <span
                      className={`border px-3 py-1.5 text-xs font-semibold ${
                        appointment.paymentStatus === "paid"
                          ? "border-green-200 bg-green-50 text-green-700"
                          : "border-amber-200 bg-amber-50 text-amber-700"
                      }`}
                    >
                      {appointment.paymentStatus === "paid"
                        ? "Paid"
                        : "Unpaid"}
                    </span>
                  </div>
                </div>

                {/* Appointment actions */}
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#F0ECE9] pt-4">
                  <p className="text-xs text-[#A49B96]">
                    Booked on{" "}
                    {formatDate(appointment.createdAt?.slice(0, 10) || "")}
                  </p>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* View Details */}
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedAppointmentId(
                          expandedAppointmentId === appointment._id
                            ? null
                            : appointment._id
                        )
                      }
                      className="inline-flex items-center gap-1.5 border border-[#E6E1DD] px-3 py-2 text-xs font-semibold text-[#7A7470] transition hover:border-[#B39A7D] hover:text-[#46322D]"
                    >
                      <Eye size={14} />

                      {expandedAppointmentId === appointment._id
                        ? "Hide Details"
                        : "View Details"}

                      {expandedAppointmentId === appointment._id ? (
                        <ChevronUp size={14} />
                      ) : (
                        <ChevronDown size={14} />
                      )}
                    </button>

                    {/* Pending actions */}
                    {appointment.status === "pending" && (
                      <>
                        <button
                          type="button"
                          disabled={updatingId === appointment._id}
                          onClick={() =>
                            updateStatus(appointment, "confirmed")
                          }
                          className="inline-flex items-center gap-1.5 bg-[#46322D] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#967467] disabled:opacity-50"
                        >
                          {updatingId === appointment._id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Check size={14} />
                          )}
                          Confirm
                        </button>

                        <button
                          type="button"
                          disabled={updatingId === appointment._id}
                          onClick={() => setAppointmentToCancel(appointment)}
                          className="inline-flex items-center gap-1.5 border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                        >
                          <XCircle size={14} />
                          Cancel
                        </button>
                      </>
                    )}

                    {/* Confirmed actions */}
                    {appointment.status === "confirmed" && (
                      <>
                        <button
                          type="button"
                          disabled={updatingId === appointment._id}
                          onClick={() =>
                            updateStatus(appointment, "completed")
                          }
                          className="inline-flex items-center gap-1.5 bg-green-700 px-3 py-2 text-xs font-semibold text-white transition hover:bg-green-800 disabled:opacity-50"
                        >
                          {updatingId === appointment._id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <CheckCircle2 size={14} />
                          )}
                          Complete
                        </button>

                        <button
                          type="button"
                          disabled={updatingId === appointment._id}
                          onClick={() => setAppointmentToCancel(appointment)}
                          className="inline-flex items-center gap-1.5 border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                        >
                          <XCircle size={14} />
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Expanded details */}
                {expandedAppointmentId === appointment._id && (
                  <div className="mt-5 grid grid-cols-1 gap-4 border-t border-[#E6E1DD] bg-[#FDFCFC] p-5 sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                      <p className="text-xs text-[#A49B96]">
                        Customer Name
                      </p>
                      <p className="mt-1 text-sm font-medium text-[#46322D]">
                        {appointment.customerName}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-[#A49B96]">
                        Customer Email
                      </p>
                      <p className="mt-1 break-all text-sm font-medium text-[#46322D]">
                        {appointment.customerEmail}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-[#A49B96]">Service</p>
                      <p className="mt-1 text-sm font-medium text-[#46322D]">
                        {appointment.serviceName || "Salon Service"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-[#A49B96]">
                        Appointment Date
                      </p>
                      <p className="mt-1 text-sm font-medium text-[#46322D]">
                        {formatDate(appointment.appointmentDate)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-[#A49B96]">
                        Appointment Time
                      </p>
                      <p className="mt-1 text-sm font-medium text-[#46322D]">
                        {appointment.time}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-[#A49B96]">
                        Payment Status
                      </p>
                      <p className="mt-1 text-sm font-medium text-[#46322D]">
                        {appointment.paymentStatus === "paid"
                          ? "Paid"
                          : "Unpaid"}
                      </p>
                    </div>

                    <div className="sm:col-span-2 lg:col-span-3">
                      <p className="text-xs text-[#A49B96]">
                        Customer Message
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-[#46322D]">
                        {appointment.message ||
                          "No additional message provided."}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Custom cancellation confirmation modal */}
      {appointmentToCancel && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setAppointmentToCancel(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancel-title"
            className="relative w-full max-w-md border border-[#E6E1DD] bg-white p-6 shadow-xl sm:p-8"
          >
            <button
              type="button"
              onClick={() => setAppointmentToCancel(null)}
              disabled={updatingId === appointmentToCancel._id}
              aria-label="Close confirmation"
              className="absolute right-4 top-4 text-[#A49B96] transition hover:text-[#46322D]"
            >
              <X size={20} />
            </button>

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
              <AlertTriangle size={26} className="text-red-600" />
            </div>

            <h2
              id="cancel-title"
              className="mt-5 text-center text-xl font-semibold text-[#46322D]"
            >
              Cancel Appointment?
            </h2>

            <p className="mt-3 text-center text-sm leading-relaxed text-[#7A7470]">
              Are you sure you want to cancel the appointment for{" "}
              <span className="font-semibold text-[#46322D]">
                {appointmentToCancel.customerName}
              </span>
              ?
            </p>

            <div className="mt-5 border border-[#E6E1DD] bg-[#FDFCFC] p-4 text-center">
              <p className="text-sm font-semibold text-[#46322D]">
                {appointmentToCancel.serviceName}
              </p>
              <p className="mt-1 text-xs text-[#7A7470]">
                {formatDate(appointmentToCancel.appointmentDate)} ·{" "}
                {appointmentToCancel.time}
              </p>
            </div>

            <p className="mt-4 text-center text-xs text-[#A49B96]">
              This action will change the appointment status to Cancelled.
            </p>

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row">
              <button
                type="button"
                disabled={updatingId === appointmentToCancel._id}
                onClick={() => setAppointmentToCancel(null)}
                className="flex-1 border border-[#E6E1DD] px-5 py-3 text-sm font-semibold text-[#46322D] transition hover:bg-[#FDFCFC] disabled:opacity-50"
              >
                No, Keep Appointment
              </button>

              <button
                type="button"
                disabled={updatingId === appointmentToCancel._id}
                onClick={() =>
                  updateStatus(appointmentToCancel, "cancelled")
                }
                className="flex flex-1 items-center justify-center gap-2 bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                {updatingId === appointmentToCancel._id ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <XCircle size={16} />
                )}
                Yes, Cancel Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
