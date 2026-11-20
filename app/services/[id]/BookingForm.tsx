
"use client";

import { useState, type FormEvent } from "react";

type BookingFormProps = {
  serviceId: string;
  serviceName: string;
  price: number;
  duration: string;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const timeSlots = [
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
];

export default function BookingForm({
  serviceId,
  serviceName,
  price,
  duration,
}: BookingFormProps) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");

  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const today = new Date().toLocaleDateString("en-CA");

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccessMessage("");

    if (!date || !time) {
      setError("Please select your preferred date and time.");
      return;
    }

    if (date < today) {
      setError("Please select a future date.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/protected/appointments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            serviceId,
            date,
            time,
            message,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to submit your appointment request."
        );
      }

      setSuccessMessage(
        data.message ||
          "Your appointment request has been submitted successfully!"
      );

      setDate("");
      setTime("");
      setMessage("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-7">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent-brown">
          Appointment Booking
        </p>

        <h2 className="mt-3 font-heading text-2xl text-heading sm:text-3xl">
          Book Your Appointment
        </h2>

        <p className="mt-3 text-sm leading-7 text-foreground">
          Choose your preferred date and time to request an
          appointment with us.
        </p>
      </div>

      {/* Selected Service */}
      <div className="mb-7 rounded-xl bg-background-soft p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-accent-brown">
          Selected Service
        </p>

        <h3 className="mt-2 font-heading text-xl text-heading">
          {serviceName}
        </h3>

        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-foreground">
          <p>
            Price:{" "}
            <span className="font-semibold text-heading">
              ৳{price.toLocaleString("en-BD")}
            </span>
          </p>

          <p>
            Duration:{" "}
            <span className="font-semibold text-heading">
              {duration}
            </span>
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-7">
        {/* Date */}
        <div>
          <label
            htmlFor="appointment-date"
            className="mb-3 block text-sm font-semibold text-heading"
          >
            Preferred Date
          </label>

          <input
            id="appointment-date"
            type="date"
            min={today}
            value={date}
            onChange={(event) => setDate(event.target.value)}
            required
            className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-heading outline-none transition focus:border-accent-brown"
          />
        </div>

        {/* Time Slots */}
        <div>
          <label className="mb-3 block text-sm font-semibold text-heading">
            Preferred Time
          </label>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {timeSlots.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => setTime(slot)}
                className={`rounded-xl border px-3 py-3 text-sm font-medium transition ${
                  time === slot
                    ? "border-primary bg-primary text-white"
                    : "border-border bg-white text-heading hover:border-primary hover:bg-background-blush"
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        {/* Optional Message */}
        <div>
          <label
            htmlFor="booking-message"
            className="mb-3 block text-sm font-semibold text-heading"
          >
            Additional Message{" "}
            <span className="font-normal text-foreground">
              (Optional)
            </span>
          </label>

          <textarea
            id="booking-message"
            rows={4}
            maxLength={500}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Tell us if you have any special requests..."
            className="w-full resize-none rounded-xl border border-border bg-white px-4 py-3 text-sm text-heading outline-none transition placeholder:text-foreground/60 focus:border-accent-brown"
          />

          <p className="mt-2 text-right text-xs text-foreground">
            {message.length}/500 characters
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {/* Success */}
        {successMessage && (
          <div
            role="status"
            className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800"
          >
            <p className="font-semibold">{successMessage}</p>
            <p className="mt-2 text-xs leading-6">
              Your appointment is currently Pending and Unpaid.
              You will be able to proceed with payment after the
              admin confirms your appointment.
            </p>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-primary px-7 py-4 text-sm font-semibold text-white transition duration-300 hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? "Submitting Request..."
            : "Submit Appointment Request"}
        </button>

        <p className="text-center text-xs leading-6 text-foreground">
          Your appointment will remain pending until it is
          reviewed and confirmed by our salon team.
        </p>
      </form>
    </div>
  );
}
