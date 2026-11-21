
"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Category {
  _id: string;
  name: string;
  slug: string;
  isActive: boolean;
}

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

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [categoryError, setCategoryError] = useState("");

  const [imagePreview, setImagePreview] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageError, setImageError] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Fetch active categories
  useEffect(() => {
    const controller = new AbortController();

    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true);
        setCategoryError("");

        const response = await fetch(
          `${API_URL}/api/protected/categories`,
          {
            cache: "no-store",
            signal: controller.signal,
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load categories."
          );
        }

        const fetchedCategories: Category[] =
          Array.isArray(data.categories)
            ? data.categories
            : Array.isArray(data.data)
              ? data.data
              : [];

        setCategories(
          fetchedCategories.filter((category) => category.isActive)
        );
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;

        setCategoryError(
          err instanceof Error
            ? err.message
            : "Unable to load categories."
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingCategories(false);
        }
      }
    };

    fetchCategories();

    return () => controller.abort();
  }, []);

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

  // Upload selected image to ImgBB through the backend
  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImageError("");
    setError("");

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
    ];

    if (!allowedTypes.includes(file.type.toLowerCase())) {
      setImageError("Please select a JPG, PNG, WEBP, or AVIF image.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setImageError("Image size must be less than 5 MB.");
      e.target.value = "";
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setImagePreview(localPreview);
    setFormData((previous) => ({ ...previous, image: "" }));

    try {
      setIsUploadingImage(true);

      const uploadData = new FormData();
      uploadData.append("image", file);

      const response = await fetch(
        `${API_URL}/api/upload/service-image`,
        {
          method: "POST",
          credentials: "include",
          body: uploadData,
        }
      );

      const data = await response.json();

      if (!response.ok || !data.imageUrl) {
        throw new Error(data.message || "Image upload failed.");
      }

      setFormData((previous) => ({
        ...previous,
        image: data.imageUrl,
      }));

      setImagePreview(data.imageUrl);
    } catch (err) {
      setImageError(
        err instanceof Error
          ? err.message
          : "Unable to upload image. Please try again."
      );
      setImagePreview("");
    } finally {
      setIsUploadingImage(false);
      e.target.value = "";
    }
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

    if (isUploadingImage) {
      setError("Please wait until the image upload is complete.");
      return;
    }

    if (!formData.image) {
      setImageError("Please upload a service image from your device.");
      return;
    }

    if (categories.length === 0) {
      setError("Please create or activate a category before adding a service.");
      return;
    }

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
            image: formData.image,
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

          {/* Dynamic Categories */}
          <div className="mb-5">
            <label className={labelClass}>
              Service Category *
            </label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              disabled={isLoadingCategories || categories.length === 0}
              className={`${inputClass} disabled:cursor-not-allowed disabled:bg-[#FDFCFC]`}
            >
              <option value="">
                {isLoadingCategories
                  ? "Loading categories..."
                  : categories.length === 0
                    ? "No active categories available"
                    : "Select a category"}
              </option>

              {categories.map((category) => (
                <option key={category._id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>

            {categoryError && (
              <p className="mt-2 text-xs text-red-600">
                {categoryError}
              </p>
            )}

            {!isLoadingCategories &&
              !categoryError &&
              categories.length === 0 && (
                <p className="mt-2 text-xs text-[#7A7470]">
                  Please add or activate a category from Manage Categories.
                </p>
              )}
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

          {/* Device Image Upload */}
          <div className="mb-8 border-t border-[#E6E1DD] pt-7">
            <h2 className="mb-1 font-serif text-xl text-[#46322D]">
              Service Image
            </h2>

            <p className="mb-5 text-xs text-[#7A7470]">
              Upload a service image directly from your device.
              JPG, PNG, WEBP, or AVIF. Maximum size: 5 MB.
            </p>

            <label className={labelClass}>
              Upload Image *
            </label>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={handleImageChange}
              disabled={isUploadingImage}
              className="block w-full cursor-pointer border border-[#E6E1DD] bg-white text-sm text-[#7A7470] file:mr-4 file:border-0 file:bg-[#F5ECE8] file:px-5 file:py-3 file:text-sm file:font-medium file:text-[#46322D] hover:file:bg-[#E4DBD8] disabled:cursor-not-allowed"
            />

            {isUploadingImage && (
              <div className="mt-3 flex items-center gap-2 text-sm text-[#967467]">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#D5B6A9] border-t-[#46322D]" />
                Uploading image...
              </div>
            )}

            {imageError && (
              <p className="mt-2 text-sm text-red-600">
                {imageError}
              </p>
            )}

            {imagePreview && (
              <div className="mt-4">
                <p className="mb-2 text-xs text-[#7A7470]">
                  Image Preview
                </p>

                <div className="relative h-40 w-48 overflow-hidden border border-[#E6E1DD] bg-[#F5ECE8]">
                  <img
                    src={imagePreview}
                    alt="Service preview"
                    className="h-full w-full object-cover"
                  />
                </div>

                {formData.image && (
                  <p className="mt-2 text-xs text-green-700">
                    Image uploaded successfully.
                  </p>
                )}
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
                  Price ($) *
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
              disabled={
                isSubmitting ||
                isUploadingImage ||
                isLoadingCategories ||
                categories.length === 0 ||
                !formData.image
              }
              className="bg-[#46322D] px-7 py-3 text-sm font-medium text-white transition hover:bg-[#967467] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? "Creating Service..."
                : "Create Service"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
