
"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function CustomerProfilePage() {
  const [profile, setProfile] = useState(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [businessName, setBusinessName] = useState("");

  const [image, setImage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load Profile
  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      try {
        const { data } = await authClient.token();

        if (!data?.token) {
          throw new Error("Authentication token not found");
        }

        const response = await fetch(`${API_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to load profile");
        }

        const user = result.user || result.profile || result;

        if (isMounted) {
          setProfile(user);
          setName(user.name || "");
          setBusinessName(user.businessName || "");
          setPhone(user.phone || "");
          setImage(user.image || "");
          setPreviewImage(user.image || "");
        }
      } catch (error) {
        if (isMounted) {
          toast.error(error.message || "Could not load profile");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  // Select Profile Image
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setSelectedImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  // Upload Image to ImgBB
  const uploadProfileImage = async () => {
    if (!selectedImage) return image;

    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

    if (!apiKey) {
      throw new Error("ImgBB API key is missing");
    }

    const formData = new FormData();
    formData.append("image", selectedImage);

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${apiKey}`,
      {
        method: "POST",
        body: formData,
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(
        result.error?.message || "Profile image upload failed"
      );
    }

    return result.data.display_url || result.data.url;
  };

  // Update Profile
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    try {
      setSaving(true);

      const { data } = await authClient.token();

      if (!data?.token) {
        throw new Error("Authentication token not found");
      }

      // Upload new image if selected
      const imageUrl = await uploadProfileImage();

      // Only editable fields are sent
      const updatedData = {
        name: name.trim(),
        businessName: businessName.trim(),
        phone: phone.trim(),
        image: imageUrl,
      };

      const response = await fetch(`${API_URL}/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.token}`,
        },
        body: JSON.stringify(updatedData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Profile update failed");
      }

      const updatedProfile =
        result.user || result.profile || {
          ...profile,
          ...updatedData,
        };

      setProfile(updatedProfile);
      setName(updatedProfile.name || updatedData.name);
      setBusinessName(updatedProfile.businessName || updatedData.businessName);
      setPhone(updatedProfile.phone || "");
      setImage(updatedProfile.image || imageUrl);
      setPreviewImage(updatedProfile.image || imageUrl);
      setSelectedImage(null);

      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#76243A]/20 border-t-[#76243A]" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="rounded-xl border border-[#E8DDD0] bg-white p-8 text-center">
        <p className="text-[#76243A]">
          Unable to load your profile. Please refresh the page.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">

      {/* Page Heading */}
      <div>
        <h1 className="text-2xl font-bold text-[#76243A] sm:text-3xl">
          Profile Settings
        </h1>

        <p className="mt-2 text-sm text-[#94765F]">
          Manage your personal information and profile details.
        </p>
      </div>

      {/* Profile Form */}
      <div className="overflow-hidden rounded-2xl border border-[#E8DDD0] bg-white shadow-sm">

        {/* Profile Image */}
        <div className="border-b border-[#E8DDD0] bg-[#F8F5F0] p-6 sm:p-8">
          <div className="flex flex-col items-center gap-4 sm:flex-row">

            <div className="relative">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Profile"
                  className="h-24 w-24 rounded-full border-4 border-white object-cover shadow"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#76243A] text-3xl font-bold text-white">
                  {name?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}
            </div>

            <div className="text-center sm:text-left">
              <h2 className="text-lg font-semibold text-[#292321]">
                Profile Picture
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                JPG, PNG or GIF. Maximum size 5MB.
              </p>

              <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#76243A] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#581525]">
                <i className="fa-solid fa-camera" />
                Change Photo

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

          </div>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-6 p-6 sm:p-8">

          <div>
            <h2 className="text-lg font-semibold text-[#76243A]">
              Personal Information
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Update your personal details below.
            </p>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="text-sm font-medium text-[#625B56]"
            >
              Full Name
            </label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
              className="w-full rounded-lg border border-[#E8DDD0] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#76243A] focus:ring-2 focus:ring-[#76243A]/10"
            />
          </div>

          {/* Business Name */}
<div className="space-y-2">
  <label
    htmlFor="businessName"
    className="text-sm font-medium text-[#625B56]"
  >
    Business Name
  </label>

  <input
    id="businessName"
    type="text"
    value={businessName}
    onChange={(e) => setBusinessName(e.target.value)}
    placeholder="Enter your business name"
    className="w-full rounded-lg border border-[#E8DDD0] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#76243A] focus:ring-2 focus:ring-[#76243A]/10"
  />
</div>

          {/* Email */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-[#625B56]"
            >
              Email Address
            </label>

            <input
              id="email"
              type="email"
              value={profile.email || ""}
              readOnly
              className="w-full cursor-not-allowed rounded-lg border border-[#E8DDD0] bg-[#F8F5F0] px-4 py-3 text-sm text-gray-500 outline-none"
            />

            <p className="text-xs text-gray-400">
              Email address cannot be changed here.
            </p>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label
              htmlFor="phone"
              className="text-sm font-medium text-[#625B56]"
            >
              Phone Number
            </label>

            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              className="w-full rounded-lg border border-[#E8DDD0] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#76243A] focus:ring-2 focus:ring-[#76243A]/10"
            />
          </div>

          {/* Account Role */}
          <div className="space-y-2">
            <label
              htmlFor="role"
              className="text-sm font-medium text-[#625B56]"
            >
              Account Type
            </label>

            <input
              id="role"
              type="text"
              value={profile.role || "Customer"}
              readOnly
              className="w-full cursor-not-allowed rounded-lg border border-[#E8DDD0] bg-[#F8F5F0] px-4 py-3 text-sm capitalize text-gray-500 outline-none"
            />

            <p className="text-xs text-gray-400">
              Account type cannot be changed from profile settings.
            </p>
          </div>

          {/* Submit */}
          <div className="flex justify-end border-t border-[#E8DDD0] pt-6">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#76243A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#581525] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-floppy-disk" />
                  Save Changes
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
