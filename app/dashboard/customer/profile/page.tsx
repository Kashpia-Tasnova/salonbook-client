
"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-hot-toast";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function CustomerProfilePage() {
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const currentName = user?.name || "";
  const currentEmail = user?.email || "";
  const currentImage = image || user?.image || "";

  const displayName = name || currentName;
  const initial = displayName.charAt(0).toUpperCase() || "U";

  const userPhone = (
    user as typeof user & { phone?: string }
  )?.phone || "";

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(userPhone);
    }
  }, [user, userPhone]);

  const handleEdit = () => {
    setName(currentName);
    setPhone(userPhone);
    setImage("");
    setSelectedFile(null);
    setIsEditing(true);
  };

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Please select a JPG, PNG, or WEBP image.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB.");
      event.target.value = "";
      return;
    }

    if (image.startsWith("blob:")) {
      URL.revokeObjectURL(image);
    }

    setSelectedFile(file);
    setImage(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Please enter your full name.");
      return;
    }

    if (name.trim().length > 100) {
      toast.error("Name cannot exceed 100 characters.");
      return;
    }

    if (phone.length > 20) {
      toast.error("Phone number cannot exceed 20 characters.");
      return;
    }

    setIsSaving(true);

    try {
      let uploadedImageUrl: string | undefined;

      // Upload the selected image to ImgBB first.
      if (selectedFile) {
        const formData = new FormData();
        formData.append("image", selectedFile);

        const uploadResponse = await fetch(
          `${API_URL}/api/upload/profile-image`,
          {
            method: "POST",
            body: formData,
            credentials: "include",
          }
        );

        const uploadResult = await uploadResponse.json();

        if (!uploadResponse.ok || !uploadResult.success) {
          throw new Error(
            uploadResult.message || "Profile image upload failed."
          );
        }

        uploadedImageUrl = uploadResult.imageUrl;
      }

      // Update the authenticated user's profile.
      const updateData: {
        name: string;
        phone: string;
        image?: string;
      } = {
        name: name.trim(),
        phone: phone.trim(),
      };

      if (uploadedImageUrl) {
        updateData.image = uploadedImageUrl;
      }

      const response = await fetch(
        `${API_URL}/api/protected/profile`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(updateData),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Profile update failed.");
      }

      // Refresh Better Auth session information.
      await authClient.getSession();

      if (image.startsWith("blob:")) {
        URL.revokeObjectURL(image);
      }

      setImage("");
      setSelectedFile(null);
      setIsEditing(false);

      toast.success("Your profile has been updated successfully!");
    } catch (error) {
      console.error("Profile update error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong while updating your profile."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (image.startsWith("blob:")) {
      URL.revokeObjectURL(image);
    }

    setName(currentName);
    setPhone(userPhone);
    setImage("");
    setSelectedFile(null);
    setIsEditing(false);
  };

  return (
    <main>
      <section className="mb-8">
        <p className="mb-2 text-sm uppercase tracking-[0.2em] text-[#B39A7D]">
          Customer Dashboard
        </p>

        <h1 className="font-serif text-3xl text-[#46322D] sm:text-4xl">
          My Profile
        </h1>

        <p className="mt-2 text-sm text-[#7A7470]">
          View and manage your personal account information.
        </p>
      </section>

      {isPending ? (
        <div className="animate-pulse border border-[#E6E1DD] bg-white p-8">
          <div className="h-24 w-24 rounded-full bg-[#F5ECE8]" />
          <div className="mt-5 h-5 w-48 bg-[#F5ECE8]" />
          <div className="mt-3 h-4 w-64 bg-[#F5ECE8]" />
        </div>
      ) : !user ? (
        <div className="border border-[#E6E1DD] bg-white p-8 text-center">
          <h2 className="font-serif text-xl text-[#46322D]">
            Unable to load your profile
          </h2>
          <p className="mt-2 text-sm text-[#7A7470]">
            Please sign in to view your profile information.
          </p>
        </div>
      ) : (
        <div className="space-y-7">
          <section className="border border-[#E6E1DD] bg-white p-6 sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#F5ECE8] font-serif text-4xl text-[#967467]">
                {currentImage ? (
                  <img
                    src={currentImage}
                    alt={displayName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initial
                )}
              </div>

              <div>
                <h2 className="font-serif text-2xl text-[#46322D]">
                  {displayName}
                </h2>

                <p className="mt-1 text-sm text-[#7A7470]">
                  {currentEmail}
                </p>

                <p className="mt-2 text-xs uppercase tracking-wider text-[#B39A7D]">
                  Customer Account
                </p>
              </div>
            </div>
          </section>

          <section className="border border-[#E6E1DD] bg-white">
            <div className="flex items-center justify-between border-b border-[#E6E1DD] px-6 py-5 sm:px-8">
              <div>
                <h2 className="font-serif text-xl text-[#46322D]">
                  Personal Information
                </h2>

                <p className="mt-1 text-xs text-[#7A7470]">
                  Your account details
                </p>
              </div>

              {!isEditing && (
                <button
                  type="button"
                  onClick={handleEdit}
                  className="border border-[#B39A7D] px-4 py-2 text-xs font-medium text-[#967467] transition hover:bg-[#F5ECE8]"
                >
                  Edit Profile
                </button>
              )}
            </div>

            <div className="space-y-6 p-6 sm:p-8">
              <div>
                <label className="mb-2 block text-sm text-[#7A7470]">
                  Full Name
                </label>

                {isEditing ? (
                  <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="w-full border border-[#E6E1DD] bg-[#FDFCFC] px-4 py-3 text-sm text-[#46322D] outline-none focus:border-[#B39A7D]"
                    placeholder="Enter your full name"
                  />
                ) : (
                  <p className="border border-[#E6E1DD] bg-[#FDFCFC] px-4 py-3 text-sm text-[#46322D]">
                    {currentName}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm text-[#7A7470]">
                  Email Address
                </label>

                <p className="border border-[#E6E1DD] bg-[#F5ECE8] px-4 py-3 text-sm text-[#7A7470]">
                  {currentEmail}
                </p>

                <p className="mt-1 text-xs text-[#A39A94]">
                  Your registered email address cannot be changed here.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm text-[#7A7470]">
                  Phone Number
                </label>

                {isEditing ? (
                  <input
                    type="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    className="w-full border border-[#E6E1DD] bg-[#FDFCFC] px-4 py-3 text-sm text-[#46322D] outline-none focus:border-[#B39A7D]"
                    placeholder="Enter your phone number"
                  />
                ) : (
                  <p className="border border-[#E6E1DD] bg-[#FDFCFC] px-4 py-3 text-sm text-[#46322D]">
                    {userPhone || "Not added yet"}
                  </p>
                )}
              </div>

              {isEditing && (
                <div>
                  <label className="mb-2 block text-sm text-[#7A7470]">
                    Profile Image
                  </label>

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-[#7A7470] file:mr-4 file:border-0 file:bg-[#F5ECE8] file:px-4 file:py-3 file:text-xs file:font-medium file:text-[#967467]"
                  />

                  <p className="mt-2 text-xs text-[#A39A94]">
                    JPG, PNG, or WEBP. Maximum file size: 5MB.
                  </p>
                </div>
              )}

              {isEditing && (
                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-[#B39A7D] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#967467] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>

                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="border border-[#E6E1DD] px-6 py-3 text-sm text-[#7A7470] transition hover:bg-[#F5ECE8] disabled:opacity-60"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </section>

          <section className="border border-[#E6E1DD] bg-[#F5ECE8] p-6 sm:p-8">
            <h2 className="font-serif text-xl text-[#46322D]">
              Account Security
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#7A7470]">
              Keep your account information secure. Never share your password
              with anyone.
            </p>
          </section>
        </div>
      )}
    </main>
  );
}
