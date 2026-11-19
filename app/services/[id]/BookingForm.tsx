"use client";

import { useState, type FormEvent } from "react";

type BookingFormProps = {
  serviceName: string;
  price: number;
  duration: string;
};

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
  serviceName,
  price,
  duration,
}: BookingFormProps) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const today = new Date().toLocaleDateString("en-CA");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSuccess(false);
    setError("");

    if (!date || !time) {
      setError("Please select your appointment date and time.");
      return;
    }

    if (date < today) {
      setError("Please select a future date.");
      return;
    }

    // Temporary frontend demonstration.
    // Actual appointment creation will be connected to the backend later.
    setSuccess(true);
  };

  return (
    <div className="mt-8 rounded-2xl border border-border bg-white p-6 sm:p-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-brown">
          Appointment Booking
        </p>

        <h2 className="mt-3 font-heading text-2xl text-heading">
          Reserve Your Visit
        </h2>

        <p className="mt-2 text-sm leading-7 text-foreground">
          Select your preferred date and time to request an appointment
          at Blush & Bloom.
        </p>
      </div>

      {/* Booking Summary */}
      <div className="mt-6 flex items-center justify-between gap-4 border-y border-border py-4">
        <div>
          <p className="text-sm font-medium text-heading">{serviceName}</p>
          <p className="mt-1 text-xs text-foreground">{duration}</p>
        </div>

        <p className="font-heading text-xl text-heading">
          ৳{price.toLocaleString("en-BD")}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        {/* Appointment Date */}
        <div>
          <label
            htmlFor="appointment-date"
            className="mb-2 block text-sm font-medium text-heading"
          >
            Appointment Date
          </label>

          <input
            id="appointment-date"
            type="date"
            min={today}
            value={date}
            onChange={(event) => {
              setDate(event.target.value);
              setSuccess(false);
            }}
            required
            className="w-full rounded-lg border border-border bg-background-soft px-4 py-3 text-sm text-heading outline-none transition focus:border-primary"
          />
        </div>

        {/* Appointment Time */}
        <div>
          <label className="mb-3 block text-sm font-medium text-heading">
            Choose Your Preferred Time
          </label>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {timeSlots.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => {
                  setTime(slot);
                  setSuccess(false);
                }}
                className={`rounded-lg border px-3 py-3 text-sm transition ${
                  time === slot
                    ? "border-primary bg-background-blush font-semibold text-accent-brown"
                    : "border-border bg-white text-foreground hover:border-primary hover:bg-background-soft"
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
            className="mb-2 block text-sm font-medium text-heading"
          >
            Additional Message
            <span className="ml-2 text-xs font-normal text-foreground">
              (Optional)
            </span>
          </label>

          <textarea
            id="booking-message"
            rows={4}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            maxLength={500}
            placeholder="Tell us if you have any special requests..."
            className="w-full resize-none rounded-lg border border-border bg-background-soft px-4 py-3 text-sm text-heading outline-none transition placeholder:text-foreground/60 focus:border-primary"
          />

          <p className="mt-1 text-right text-xs text-foreground">
            {message.length}/500
          </p>
        </div>

        {/* Error */}
        {error && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        )}

        {/* Success */}
        {success && (
          <div className="rounded-lg border border-green-200 bg-green-50 p-4">
            <p className="font-medium text-green-800">
              Booking details submitted successfully!
            </p>
            <p className="mt-1 text-sm text-green-700">
              This is a frontend demonstration. Your appointment has not
              yet been saved. Sign-in and backend booking integration
              will be added next.
            </p>
          </div>
        )}

        <button
          type="submit"
          className="w-full rounded-full bg-primary px-7 py-4 text-sm font-semibold text-white transition duration-300 hover:bg-primary-hover"
        >
          Submit Appointment Request
        </button>

        <p className="text-center text-xs leading-6 text-foreground">
          Appointment confirmation and payment will be handled after
          your booking request is processed.
        </p>
      </form>
    </div>
  );
}