
"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-hot-toast";

export default function AdminProfilePage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setImage(user.image || "");

      const userPhone =
        (user as typeof user & { phone?: string })?.phone || "";

      setPhone(userPhone);
    }
  }, [user]);

  useEffect(() => {
    if (selectedFile) {
      const previewUrl = URL.createObjectURL(selectedFile);

      setImage(previewUrl);

      return () => URL.revokeObjectURL(previewUrl);
    }
  }, [selectedFile]);

  const firstLetter = name.trim().charAt(0).toUpperCase() || "A";

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Please select a JPG, PNG, or WebP image.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5 MB.");
      event.target.value = "";
      return;
    }

    setSelectedFile(file);
    setImageFailed(false);
  };

  const handleCancel = () => {
    setName(user?.name || "");

    const userPhone =
      (user as typeof user & { phone?: string })?.phone || "";

    setPhone(userPhone);
    setImage(user?.image || "");
    setSelectedFile(null);
    setImageFailed(false);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Please enter your name.");
      return;
    }

    setIsSaving(true);

    try {
      let imageUrl = image;

      // Upload a newly selected image first.
      if (selectedFile) {
        const formData = new FormData();
        formData.append("image", selectedFile);

        const uploadResponse = await fetch(
          "/api/upload/profile-image",
          {
            method: "POST",
            credentials: "include",
            body: formData,
          }
        );

        const uploadData = await uploadResponse.json();

        if (!uploadResponse.ok || !uploadData.success) {
          throw new Error(
            uploadData.message || "Failed to upload profile image."
          );
        }

        imageUrl = uploadData.imageUrl;
      }

      const response = await fetch("/api/protected/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          image: imageUrl || "",
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to update profile.");
      }

      await authClient.getSession();

      setSelectedFile(null);
      setImage(imageUrl || "");
      setImageFailed(false);
      setIsEditing(false);

      toast.success("Admin profile updated successfully!");
    } catch (error) {
      console.error("Admin profile update error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemovePhoto = async () => {
    if (!image && !selectedFile) return;

    setIsRemoving(true);

    try {
      const response = await fetch("/api/protected/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          image: "",
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to remove profile photo.");
      }

      await authClient.getSession();

      setImage("");
      setSelectedFile(null);
      setImageFailed(false);

      toast.success("Profile photo removed successfully!");
    } catch (error) {
      console.error("Remove profile photo error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Could not remove profile photo."
      );
    } finally {
      setIsRemoving(false);
    }
  };

  if (isPending) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 w-48 rounded-lg bg-[#F5ECE8]" />
        <div className="h-64 rounded-2xl bg-[#F5ECE8]" />
      </div>
    );
  }

  if (!user) return null;

  const currentImage = image && !imageFailed;

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Page Heading */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#B39A7D]">
          Account Settings
        </p>

        <h1 className="mt-2 font-heading text-3xl font-medium text-[#46322D]">
          My Profile
        </h1>

        <p className="mt-2 text-sm text-[#7A7470]">
          Manage your personal information and profile photo.
        </p>
      </div>

      {/* Profile Card */}
      <div className="overflow-hidden rounded-2xl border border-[#E6E1DD] bg-white shadow-sm">
        <div className="border-b border-[#E6E1DD] bg-[#F5ECE8]/60 px-6 py-5 sm:px-8">
          <h2 className="font-heading text-xl font-medium text-[#46322D]">
            Admin Information
          </h2>

          <p className="mt-1 text-sm text-[#7A7470]">
            Your account details and profile settings.
          </p>
        </div>

        <div className="space-y-8 p-6 sm:p-8">
          {/* Profile Photo */}
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#E6E1DD] bg-[#F5ECE8] text-3xl font-semibold text-[#967467]">
              {currentImage ? (
                <img
                  src={image}
                  alt={name || "Admin profile"}
                  className="h-full w-full object-cover"
                  onError={() => setImageFailed(true)}
                />
              ) : (
                firstLetter
              )}
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-[#46322D]">
                Profile Photo
              </h3>

              <p className="text-xs text-[#7A7470]">
                JPG, PNG, or WebP. Maximum file size 5 MB.
              </p>

              {isEditing && (
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <label className="cursor-pointer rounded-full bg-[#46322D] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#967467]">
                    Upload Photo

                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>

                  {(image || selectedFile) && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      disabled={isRemoving || isSaving}
                      className="rounded-full border border-red-200 px-5 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                    >
                      {isRemoving ? "Removing..." : "Remove Photo"}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-[#E6E1DD]" />

          {/* Name */}
          <div className="grid gap-2 sm:grid-cols-[160px_1fr] sm:items-center">
            <label className="text-sm font-medium text-[#46322D]">
              Full Name
            </label>

            {isEditing ? (
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter your name"
                className="w-full rounded-xl border border-[#E6E1DD] bg-white px-4 py-3 text-sm text-[#46322D] outline-none transition focus:border-[#B39A7D]"
              />
            ) : (
              <p className="text-sm text-[#7A7470]">
                {user.name || "Not provided"}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="grid gap-2 sm:grid-cols-[160px_1fr] sm:items-center">
            <label className="text-sm font-medium text-[#46322D]">
              Email Address
            </label>

            <p className="break-all text-sm text-[#7A7470]">
              {user.email}
            </p>
          </div>

          {/* Phone */}
          <div className="grid gap-2 sm:grid-cols-[160px_1fr] sm:items-center">
            <label className="text-sm font-medium text-[#46322D]">
              Phone Number
            </label>

            {isEditing ? (
              <input
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="Enter your phone number"
                className="w-full rounded-xl border border-[#E6E1DD] bg-white px-4 py-3 text-sm text-[#46322D] outline-none transition focus:border-[#B39A7D]"
              />
            ) : (
              <p className="text-sm text-[#7A7470]">
                {phone || "Not provided"}
              </p>
            )}
          </div>

          {/* Role */}
          <div className="grid gap-2 sm:grid-cols-[160px_1fr] sm:items-center">
            <label className="text-sm font-medium text-[#46322D]">
              Account Role
            </label>

            <div>
              <span className="inline-flex rounded-full bg-[#F5ECE8] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#967467]">
                Admin
              </span>

              <p className="mt-1 text-xs text-[#7A7470]">
                Your account role cannot be changed here.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap justify-end gap-3 border-t border-[#E6E1DD] pt-6">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isSaving || isRemoving}
                  className="rounded-full border border-[#E6E1DD] px-6 py-3 text-xs font-semibold text-[#46322D] transition hover:bg-[#FDFCFC] disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving || isRemoving}
                  className="rounded-full bg-[#46322D] px-7 py-3 text-xs font-semibold text-white transition hover:bg-[#967467] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="rounded-full bg-[#46322D] px-7 py-3 text-xs font-semibold text-white transition hover:bg-[#967467]"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
