
"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CategoriesResponse {
  success: boolean;
  total: number;
  categories: Category[];
  message?: string;
}

export default function ManageCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [actionId, setActionId] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<Category | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch all categories.
  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/protected/admin/categories`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data: CategoriesResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load categories.");
      }

      setCategories(data.categories || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading categories."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Reset the category form.
  const resetForm = () => {
    setName("");
    setDescription("");
    setImage("");
    setSelectedFile(null);
    setImagePreview("");
    setEditingCategory(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Open create modal.
  const openCreateModal = () => {
    resetForm();
    setError("");
    setMessage("");
    setIsModalOpen(true);
  };

  // Open edit modal.
  const openEditModal = (category: Category) => {
    resetForm();

    setEditingCategory(category);
    setName(category.name);
    setDescription(category.description || "");
    setImage(category.image || "");
    setImagePreview(category.image || "");

    setError("");
    setMessage("");
    setIsModalOpen(true);
  };

  // Select image from device.
  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
    ];

    if (!allowedTypes.includes(file.type.toLowerCase())) {
      setError("Please select a JPG, PNG, WEBP, or AVIF image.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5 MB.");
      event.target.value = "";
      return;
    }

    setError("");
    setSelectedFile(file);

    setImagePreview((previousPreview) => {
      if (previousPreview.startsWith("blob:")) {
        URL.revokeObjectURL(previousPreview);
      }

      return URL.createObjectURL(file);
    });
  };

  // Upload image to ImgBB.
  const uploadCategoryImage = async (): Promise<string> => {
    if (!selectedFile) return image;

    const formData = new FormData();
    formData.append("image", selectedFile);

    const response = await fetch(
      `${API_URL}/api/upload/category-image`,
      {
        method: "POST",
        credentials: "include",
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Image upload failed.");
    }

    if (!data.imageUrl) {
      throw new Error("Image upload did not return an image URL.");
    }

    return data.imageUrl;
  };

  // Create or update category.
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim()) {
      setError("Please enter a category name.");
      return;
    }

    if (!editingCategory && !selectedFile) {
      setError("Please select a category image from your device.");
      return;
    }

    try {
      setIsSaving(true);
      setError("");
      setMessage("");

      const imageUrl = await uploadCategoryImage();

      const endpoint = editingCategory
        ? `${API_URL}/api/protected/admin/categories/${editingCategory._id}`
        : `${API_URL}/api/protected/admin/categories`;

      const response = await fetch(endpoint, {
        method: editingCategory ? "PATCH" : "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          image: imageUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            `Failed to ${editingCategory ? "update" : "create"} category.`
        );
      }

      setMessage(
        editingCategory
          ? "Category updated successfully."
          : "Category created successfully."
      );

      setIsModalOpen(false);
      resetForm();

      await fetchCategories();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Activate or deactivate category.
  const handleToggleStatus = async (category: Category) => {
    try {
      setActionId(category._id);
      setError("");
      setMessage("");

      const response = await fetch(
        `${API_URL}/api/protected/admin/categories/${category._id}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isActive: !category.isActive,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update category.");
      }

      setMessage(
        category.isActive
          ? "Category deactivated successfully."
          : "Category activated successfully."
      );

      await fetchCategories();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update category."
      );
    } finally {
      setActionId(null);
    }
  };

  // Delete category.
  const handleDeleteCategory = async (category: Category) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${category.name}"?`
    );

    if (!confirmed) return;

    try {
      setActionId(category._id);
      setError("");
      setMessage("");

      const response = await fetch(
        `${API_URL}/api/protected/admin/categories/${category._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete category.");
      }

      setMessage("Category deleted successfully.");
      await fetchCategories();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete category."
      );
    } finally {
      setActionId(null);
    }
  };

  const activeCategories = categories.filter(
    (category) => category.isActive
  ).length;

  const inactiveCategories = categories.length - activeCategories;

  return (
    <div className="min-h-screen bg-[#FDFCFC] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Page Heading */}
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#B39A7D]">
              Administration
            </p>

            <h1 className="font-serif text-3xl text-[#46322D]">
              Manage Categories
            </h1>

            <p className="mt-2 text-sm text-[#7A7470]">
              Organize your salon services into beauty categories.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 bg-[#46322D] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#967467]"
          >
            <span className="text-lg">+</span>
            Add New Category
          </button>
        </div>

        {/* Statistics */}
        <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="border border-[#E6E1DD] bg-white p-5">
            <p className="text-sm text-[#7A7470]">Total Categories</p>
            <p className="mt-2 font-serif text-3xl text-[#46322D]">
              {categories.length}
            </p>
          </div>

          <div className="border border-[#E6E1DD] bg-white p-5">
            <p className="text-sm text-[#7A7470]">Active Categories</p>
            <p className="mt-2 font-serif text-3xl text-[#967467]">
              {activeCategories}
            </p>
          </div>

          <div className="border border-[#E6E1DD] bg-white p-5">
            <p className="text-sm text-[#7A7470]">Inactive Categories</p>
            <p className="mt-2 font-serif text-3xl text-[#967467]">
              {inactiveCategories}
            </p>
          </div>
        </div>

        {/* Success Message */}
        {message && (
          <div className="mb-5 border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-5 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Categories Container */}
        <div className="border border-[#E6E1DD] bg-white">
          {/* Section Header */}
          <div className="flex flex-col justify-between gap-3 border-b border-[#E6E1DD] px-5 py-5 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-serif text-xl text-[#46322D]">
                All Categories
              </h2>

              <p className="mt-1 text-xs text-[#7A7470]">
                Create and manage your salon service categories.
              </p>
            </div>

            <button
              onClick={fetchCategories}
              disabled={isLoading}
              className="border border-[#E6E1DD] px-4 py-2 text-xs font-medium text-[#967467] transition hover:bg-[#F5ECE8] disabled:opacity-50"
            >
              ↻ Refresh
            </button>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="animate-pulse border border-[#E6E1DD] p-4"
                >
                  <div className="h-40 bg-[#F5ECE8]" />
                  <div className="mt-4 h-4 w-2/3 bg-[#F5ECE8]" />
                  <div className="mt-3 h-3 w-full bg-[#F5ECE8]" />
                </div>
              ))}
            </div>
          ) : categories.length === 0 ? (
            /* Empty State */
            <div className="px-5 py-16 text-center">
              <div className="mb-4 text-4xl text-[#B39A7D]">✿</div>

              <h3 className="font-serif text-xl text-[#46322D]">
                No Categories Found
              </h3>

              <p className="mt-2 text-sm text-[#7A7470]">
                Start by creating your first salon category.
              </p>

              <button
                onClick={openCreateModal}
                className="mt-5 bg-[#46322D] px-5 py-3 text-sm text-white transition hover:bg-[#967467]"
              >
                Add Your First Category
              </button>
            </div>
          ) : (
            /* Category Cards */
            <div className="grid items-stretch gap-4 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-3">
              {categories.map((category) => (
                <div
                  key={category._id}
                  className="flex h-full flex-col overflow-hidden border border-[#E6E1DD] transition hover:border-[#D5B6A9]"
                >
                  {/* Category Image */}
                  <div className="relative h-48 shrink-0 bg-[#F5ECE8]">
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={category.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-4xl text-[#B39A7D]">
                        ✿
                      </div>
                    )}

                    <span
                      className={`absolute right-3 top-3 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                        category.isActive
                          ? "bg-green-50 text-green-700"
                          : "bg-[#F5ECE8] text-[#967467]"
                      }`}
                    >
                      {category.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  {/* Category Information */}
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="font-serif text-xl text-[#46322D]">
                      {category.name}
                    </h3>

                    <p className="mt-1 text-xs text-[#B39A7D]">
                      /{category.slug}
                    </p>

                    <p className="mt-3 min-h-[72px] text-sm leading-6 text-[#7A7470]">
                      {category.description || "No description provided."}
                    </p>

                    {/* Actions pushed to the bottom of every card */}
                    <div className="mt-auto pt-4">
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => openEditModal(category)}
                          className="bg-[#46322D] px-3 py-2.5 text-xs font-medium text-white transition hover:bg-[#967467]"
                        >
                          ✎ Edit
                        </button>

                        <button
                          onClick={() => handleToggleStatus(category)}
                          disabled={actionId === category._id}
                          className="border border-[#E6E1DD] px-3 py-2.5 text-xs font-medium text-[#967467] transition hover:bg-[#F5ECE8] disabled:opacity-50"
                        >
                          {actionId === category._id
                            ? "Please wait..."
                            : category.isActive
                              ? "Deactivate"
                              : "Activate"}
                        </button>
                      </div>

                      <button
                        onClick={() => handleDeleteCategory(category)}
                        disabled={actionId === category._id}
                        className="mt-2 w-full border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                      >
                        Delete Category
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer Count */}
          {!isLoading && categories.length > 0 && (
            <div className="border-t border-[#E6E1DD] px-5 py-4">
              <p className="text-xs text-[#7A7470]">
                Showing {categories.length}{" "}
                {categories.length === 1 ? "category" : "categories"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4">
          <div className="my-auto w-full max-w-xl border border-[#E6E1DD] bg-white shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#E6E1DD] px-5 py-5">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B39A7D]">
                  Category Management
                </p>

                <h2 className="mt-1 font-serif text-2xl text-[#46322D]">
                  {editingCategory ? "Edit Category" : "Add New Category"}
                </h2>
              </div>

              <button
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                disabled={isSaving}
                className="text-2xl text-[#967467] hover:text-[#46322D]"
              >
                ×
              </button>
            </div>

            {/* Category Form */}
            <form onSubmit={handleSubmit} className="space-y-5 p-5">
              {/* Category Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[#46322D]">
                  Category Name *
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="e.g. Hair Coloring"
                  maxLength={100}
                  required
                  className="w-full border border-[#E6E1DD] px-4 py-3 text-sm text-[#46322D] outline-none transition focus:border-[#B39A7D]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[#46322D]">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Write a short description about this category..."
                  rows={3}
                  maxLength={500}
                  className="w-full resize-none border border-[#E6E1DD] px-4 py-3 text-sm text-[#46322D] outline-none transition focus:border-[#B39A7D]"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[#46322D]">
                  Category Image *
                </label>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  onChange={handleImageChange}
                  className="block w-full cursor-pointer border border-[#E6E1DD] p-3 text-sm text-[#7A7470] file:mr-4 file:border-0 file:bg-[#F5ECE8] file:px-4 file:py-2 file:text-xs file:font-medium file:text-[#46322D]"
                />

                <p className="mt-2 text-xs text-[#7A7470]">
                  JPG, PNG, WEBP, or AVIF. Maximum file size: 5 MB.
                  {editingCategory &&
                    " Leave empty to keep the existing image."}
                </p>

                {imagePreview && (
                  <div className="mt-4 overflow-hidden border border-[#E6E1DD]">
                    <img
                      src={imagePreview}
                      alt="Category preview"
                      className="h-48 w-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Modal Error */}
              {error && (
                <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* Form Buttons */}
              <div className="flex flex-col-reverse gap-3 border-t border-[#E6E1DD] pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  disabled={isSaving}
                  className="border border-[#E6E1DD] px-5 py-3 text-sm font-medium text-[#967467] transition hover:bg-[#F5ECE8] disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-[#46322D] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#967467] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSaving
                    ? "Please wait..."
                    : editingCategory
                      ? "Save Changes"
                      : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
