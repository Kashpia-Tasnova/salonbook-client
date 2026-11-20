
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function AddServicePage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    shortDescription: "",
    description: "",
    image: "",
    price: "",
    duration: "",
    whatToExpect: [""],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleExpectationChange = (index: number, value: string) => {
    const updated = [...formData.whatToExpect];
    updated[index] = value;

    setFormData((previous) => ({
      ...previous,
      whatToExpect: updated,
    }));
  };

  const addExpectation = () => {
    if (formData.whatToExpect.length >= 10) return;

    setFormData((previous) => ({
      ...previous,
      whatToExpect: [...previous.whatToExpect, ""],
    }));
  };

  const removeExpectation = (index: number) => {
    if (formData.whatToExpect.length <= 1) return;

    setFormData((previous) => ({
      ...previous,
      whatToExpect: previous.whatToExpect.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");

    const expectations = formData.whatToExpect
      .map((item) => item.trim())
      .filter(Boolean);

    if (expectations.length === 0) {
      setError("Please add at least one What to Expect point.");
      return;
    }

    if (expectations.length > 10) {
      setError("You can add a maximum of 10 points.");
      return;
    }

    if (
      !Number.isFinite(Number(formData.price)) ||
      Number(formData.price) <= 0
    ) {
      setError("Please enter a valid service price.");
      return;
    }

    if (
      !Number.isInteger(Number(formData.duration)) ||
      Number(formData.duration) <= 0
    ) {
      setError("Duration must be a positive whole number.");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch(
        `${API_URL}/api/protected/admin/services`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            category: formData.category,
            shortDescription: formData.shortDescription.trim(),
            description: formData.description.trim(),
            image: formData.image.trim(),
            price: Number(formData.price),
            duration: Number(formData.duration),
            whatToExpect: expectations,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create service.");
      }

      router.push("/dashboard/admin/services");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full border border-[#E6E1DD] bg-white px-4 py-3 text-sm text-[#46322D] outline-none transition placeholder:text-[#B5AAA4] focus:border-[#B39A7D]";

  const labelClass =
    "mb-2 block text-sm font-medium text-[#46322D]";

  return (
    <div className="min-h-screen bg-[#FDFCFC] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">

        {/* Page Heading */}
        <div className="mb-7">
          <Link
            href="/dashboard/admin/services"
            className="mb-4 inline-flex items-center gap-2 text-sm text-[#967467] transition hover:text-[#46322D]"
          >
            ← Back to Manage Services
          </Link>

          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#B39A7D]">
            Administration
          </p>

          <h1 className="font-serif text-3xl text-[#46322D]">
            Add New Service
          </h1>

          <p className="mt-2 text-sm text-[#7A7470]">
            Add a new beauty treatment or salon service to your collection.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="border border-[#E6E1DD] bg-white p-5 sm:p-8"
        >
          {/* Basic Information */}
          <div className="mb-7">
            <h2 className="font-serif text-xl text-[#46322D]">
              Basic Information
            </h2>

            <p className="mt-1 text-xs text-[#7A7470]">
              Enter the name and category of your salon service.
            </p>
          </div>

          <div className="mb-5">
            <label className={labelClass}>
              Service Name *
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Hydrafacial Treatment"
              maxLength={100}
              required
              className={inputClass}
            />
          </div>

          <div className="mb-5">
            <label className={labelClass}>
              Service Category *
            </label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className={inputClass}
            >
              <option value="">Select a category</option>
              <option value="Facial">Facial</option>
              <option value="Hair">Hair</option>
              <option value="Nails">Nails</option>
              <option value="Makeup">Makeup</option>
              <option value="Spa & Wellness">Spa & Wellness</option>
              <option value="Waxing">Waxing</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="mb-5">
            <label className={labelClass}>
              Short Description *
            </label>

            <textarea
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              placeholder="A short introduction to this service..."
              maxLength={250}
              rows={3}
              required
              className={inputClass}
            />

            <p className="mt-1 text-right text-xs text-[#7A7470]">
              {formData.shortDescription.length}/250
            </p>
          </div>

          <div className="mb-8">
            <label className={labelClass}>
              Full Description *
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the service in detail..."
              maxLength={2000}
              rows={5}
              required
              className={inputClass}
            />

            <p className="mt-1 text-right text-xs text-[#7A7470]">
              {formData.description.length}/2000
            </p>
          </div>

          <div className="mb-8 border-t border-[#E6E1DD] pt-7">
            <h2 className="mb-1 font-serif text-xl text-[#46322D]">
              Service Image
            </h2>

            <p className="mb-5 text-xs text-[#7A7470]">
              Provide a publicly accessible HTTPS image URL.
            </p>

            <label className={labelClass}>
              Image URL *
            </label>

            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/service-image.jpg"
              required
              className={inputClass}
            />

            {formData.image && (
              <div className="mt-4">
                <p className="mb-2 text-xs text-[#7A7470]">
                  Image Preview
                </p>

                <img
                  src={formData.image}
                  alt="Service preview"
                  className="h-40 w-48 border border-[#E6E1DD] object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          {/* Pricing and Duration */}
          <div className="mb-8 border-t border-[#E6E1DD] pt-7">
            <h2 className="mb-1 font-serif text-xl text-[#46322D]">
              Pricing & Duration
            </h2>

            <p className="mb-5 text-xs text-[#7A7470]">
              Set the service price and estimated time.
            </p>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass}>
                  Price (৳) *
                </label>

                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="e.g. 2500"
                  min="1"
                  step="0.01"
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Duration (Minutes) *
                </label>

                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="e.g. 60"
                  min="1"
                  step="1"
                  required
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* What to Expect */}
          <div className="mb-8 border-t border-[#E6E1DD] pt-7">
            <h2 className="font-serif text-xl text-[#46322D]">
              What to Expect
            </h2>

            <p className="mb-5 mt-1 text-xs text-[#7A7470]">
              Add the benefits or steps included in this service (1–10 points).
            </p>

            <div className="space-y-3">
              {formData.whatToExpect.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) =>
                      handleExpectationChange(index, e.target.value)
                    }
                    placeholder={`Point ${index + 1}`}
                    maxLength={200}
                    required
                    className={inputClass}
                  />

                  {formData.whatToExpect.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeExpectation(index)}
                      className="shrink-0 px-3 py-2 text-lg text-red-500 transition hover:bg-red-50"
                      aria-label={`Remove point ${index + 1}`}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>

            {formData.whatToExpect.length < 10 && (
              <button
                type="button"
                onClick={addExpectation}
                className="mt-4 border border-[#D5B6A9] px-4 py-2 text-xs font-medium text-[#967467] transition hover:bg-[#F5ECE8]"
              >
                + Add Another Point
              </button>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Form Actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-[#E6E1DD] pt-6 sm:flex-row sm:justify-end">
            <Link
              href="/dashboard/admin/services"
              className="inline-flex items-center justify-center border border-[#E6E1DD] px-6 py-3 text-sm font-medium text-[#7A7470] transition hover:bg-[#F5ECE8]"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#46322D] px-7 py-3 text-sm font-medium text-white transition hover:bg-[#967467] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Creating Service..." : "Create Service"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
