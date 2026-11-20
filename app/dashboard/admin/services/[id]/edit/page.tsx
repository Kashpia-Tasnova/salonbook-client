
"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface SalonService {
  _id: string;
  name: string;
  category: string;
  shortDescription: string;
  description: string;
  image: string;
  price: number;
  duration: number;
  whatToExpect: string[];
  isActive: boolean;
}

export default function EditServicePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    shortDescription: "",
    description: "",
    image: "",
    price: "",
    duration: "",
    whatToExpect: "",
  });

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/protected/admin/services`,
          { credentials: "include" }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load service.");
        }

        const service: SalonService | undefined = (
          data.services || []
        ).find((item: SalonService) => item._id === id);

        if (!service) {
          throw new Error("Service not found.");
        }

        setFormData({
          name: service.name,
          category: service.category,
          shortDescription: service.shortDescription,
          description: service.description,
          image: service.image,
          price: String(service.price),
          duration: String(service.duration),
          whatToExpect: (service.whatToExpect || []).join("\n"),
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong."
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchService();
  }, [id]);

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const whatToExpect = formData.whatToExpect
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

    if (whatToExpect.length < 1 || whatToExpect.length > 10) {
      setError("Please provide between 1 and 10 What to Expect items.");
      return;
    }

    if (Number(formData.price) <= 0 || !Number.isFinite(Number(formData.price))) {
      setError("Please enter a valid price greater than zero.");
      return;
    }

    if (
      !Number.isInteger(Number(formData.duration)) ||
      Number(formData.duration) <= 0
    ) {
      setError("Please enter a valid duration in minutes.");
      return;
    }

    try {
      setIsSaving(true);

      const response = await fetch(
        `${API_URL}/api/protected/admin/services/${id}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            category: formData.category.trim(),
            shortDescription: formData.shortDescription.trim(),
            description: formData.description.trim(),
            image: formData.image.trim(),
            price: Number(formData.price),
            duration: Number(formData.duration),
            whatToExpect,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update service.");
      }

      router.push("/dashboard/admin/services");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to update service."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const inputClass =
    "mt-2 w-full border border-[#E6E1DD] bg-white px-4 py-3 text-sm text-[#46322D] outline-none transition focus:border-[#B39A7D]";

  const labelClass =
    "text-sm font-medium text-[#46322D]";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FDFCFC] p-8">
        <div className="mx-auto max-w-3xl animate-pulse space-y-5">
          <div className="h-8 w-48 bg-[#F5ECE8]" />
          <div className="h-12 bg-[#F5ECE8]" />
          <div className="h-12 bg-[#F5ECE8]" />
          <div className="h-32 bg-[#F5ECE8]" />
        </div>
      </div>
    );
  }

  if (error && !formData.name) {
    return (
      <div className="min-h-screen bg-[#FDFCFC] px-5 py-20 text-center">
        <h1 className="font-serif text-2xl text-[#46322D]">
          Unable to Load Service
        </h1>
        <p className="mt-3 text-sm text-red-600">{error}</p>
        <Link
          href="/dashboard/admin/services"
          className="mt-6 inline-block bg-[#46322D] px-5 py-3 text-sm text-white"
        >
          Back to Manage Services
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCFC] px-4 py-7 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/dashboard/admin/services"
          className="mb-6 inline-flex text-sm text-[#967467] hover:text-[#46322D]"
        >
          ← Back to Manage Services
        </Link>

        <div className="mb-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#B39A7D]">
            Administration
          </p>
          <h1 className="mt-2 font-serif text-3xl text-[#46322D]">
            Edit Service
          </h1>
          <p className="mt-2 text-sm text-[#7A7470]">
            Update your salon service information.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 border border-[#E6E1DD] bg-white p-5 sm:p-8"
        >
          {error && (
            <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="name" className={labelClass}>
              Service Name *
            </label>
            <input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              maxLength={100}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="category" className={labelClass}>
              Category *
            </label>
            <input
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="shortDescription" className={labelClass}>
              Short Description *
            </label>
            <textarea
              id="shortDescription"
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              required
              maxLength={250}
              rows={3}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="description" className={labelClass}>
              Full Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              maxLength={2000}
              rows={6}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="image" className={labelClass}>
              Service Image URL *
            </label>
            <input
              id="image"
              name="image"
              type="url"
              value={formData.image}
              onChange={handleChange}
              required
              className={inputClass}
            />

            {formData.image && (
              <div className="mt-4 h-48 w-full overflow-hidden bg-[#F5ECE8] sm:w-64">
                <img
                  src={formData.image}
                  alt="Service preview"
                  className="h-full w-full object-cover"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="price" className={labelClass}>
                Price (৳) *
              </label>
              <input
                id="price"
                name="price"
                type="number"
                min="1"
                step="any"
                value={formData.price}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="duration" className={labelClass}>
                Duration (Minutes) *
              </label>
              <input
                id="duration"
                name="duration"
                type="number"
                min="1"
                step="1"
                value={formData.duration}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="whatToExpect" className={labelClass}>
              What to Expect *
            </label>
            <p className="mt-1 text-xs text-[#7A7470]">
              Write each item on a separate line. Add between 1 and 10 items.
            </p>
            <textarea
              id="whatToExpect"
              name="whatToExpect"
              value={formData.whatToExpect}
              onChange={handleChange}
              required
              rows={6}
              className={inputClass}
              placeholder={"Professional consultation\nPremium products\nRelaxing treatment"}
            />
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-[#E6E1DD] pt-6 sm:flex-row sm:justify-end">
            <Link
              href="/dashboard/admin/services"
              className="border border-[#E6E1DD] px-6 py-3 text-center text-sm text-[#7A7470] transition hover:bg-[#F5ECE8]"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isSaving}
              className="bg-[#46322D] px-7 py-3 text-sm font-medium text-white transition hover:bg-[#967467] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
