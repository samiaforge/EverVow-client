
"use client";

import { useEffect, useRef, useState } from "react";
import { authClient } from "@/lib/auth-client";
import {
  MAX_SERVICE_IMAGES,
  uploadImagesToImgBB,
} from "@/lib/imgbb";
import { X } from "lucide-react";
import { toast } from "sonner";


const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function AddServicePage() {
  const [formData, setFormData] = useState({
    serviceName: "",
    category: "",
    description: "",
    price: "",
    location: "",
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const previewsRef = useRef([]);

  useEffect(() => {
    previewsRef.current = imagePreviews;
  }, [imagePreviews]);

  useEffect(() => {
    return () => {
      previewsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    e.target.value = "";

    const validFiles = selectedFiles.filter((file) =>
      file.type.startsWith("image/")
    );

    if (validFiles.length !== selectedFiles.length) {
      toast.error("Please select only image files.");
    }

    const availableSlots = MAX_SERVICE_IMAGES - images.length;
    const acceptedFiles = validFiles.slice(0, availableSlots);

    if (validFiles.length > availableSlots) {
      toast.error(`You can upload up to ${MAX_SERVICE_IMAGES} images.`);
    }

    const newPreviews = acceptedFiles.map((file) =>
      URL.createObjectURL(file)
    );

    setImages((current) => [...current, ...acceptedFiles]);
    setImagePreviews((current) => [...current, ...newPreviews]);
  };

  const handleRemoveImage = (index) => {
    const previewUrl = imagePreviews[index];

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setImages((current) => current.filter((_file, i) => i !== index));
    setImagePreviews((current) =>
      current.filter((_url, i) => i !== index)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.serviceName.trim() ||
      !formData.category ||
      !formData.description.trim() ||
      !formData.price ||
      !formData.location.trim() ||
      images.length === 0
    ) {
      toast.error("Please fill in all fields and select at least one image.");
      return;
    }

    if (Number(formData.price) <= 0) {
      toast.error("Price must be greater than zero.");
      return;
    }

    if (images.some((file) => !file.type.startsWith("image/"))) {
      toast.error("Please select only valid image files.");
      return;
    }

    const form = e.currentTarget;

    try {
      setLoading(true);

      // Step 1: Upload images to ImgBB
      const imageUrls = await uploadImagesToImgBB(images);

      // Step 2: Get JWT token from Better Auth
      const tokenResult = await authClient.token();

      const token = tokenResult.data?.token;

      if (tokenResult.error || !token) {
        throw new Error("Authentication failed. Please login again.");
      }

      // Step 3: Send service data to backend
      const serviceData = {
        ...formData,
        price: Number(formData.price),
        images: imageUrls,
      };

      const response = await fetch(`${API_URL}/services`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(serviceData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to add service.");
      }

      toast.success("Service submitted successfully!");

      // Step 4: Reset form
      setFormData({
        serviceName: "",
        category: "",
        description: "",
        price: "",
        location: "",
      });

      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
      setImages([]);
      setImagePreviews([]);

      form.reset();
    } catch (error) {
      console.error("Add service error:", error);
      toast.error(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="mb-2 text-sm font-medium uppercase tracking-[3px] text-[#76243A]">
          VENDOR WORKSPACE
        </p>

        <h2 className="mt-2 text-2xl font-bold text-[#292321]">
          Add a Wedding Service
        </h2>

        <p className="mt-2 text-sm text-[#625B56]">
          Share your service details with couples planning their wedding.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-xl border border-[#E8DDD0] bg-white p-6 shadow-sm"
      >
        <div>
          <label className="mb-2 block text-sm font-medium">
            Service Name
          </label>
          <input
            type="text"
            name="serviceName"
            value={formData.serviceName}
            onChange={handleChange}
            placeholder="e.g. Premium Wedding Photography"
            className="w-full rounded-lg border border-[#E8DDD0] px-4 py-3 outline-none focus:border-[#76243A]"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full rounded-lg border border-[#E8DDD0] bg-white px-4 py-3 outline-none focus:border-[#76243A]"
          >
            <option value="">Select a category</option>
            <option>Photography & Videography</option>
            <option>Wedding Venues</option>
            <option>Decoration & Florist</option>
            <option>Catering Services</option>
            <option>Makeup & Styling</option>
            <option>Wedding Fashion</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Describe your wedding service..."
            className="w-full rounded-lg border border-[#E8DDD0] px-4 py-3 outline-none focus:border-[#76243A]"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Price (BDT)
            </label>
            <input
              type="number"
              name="price"
              min="1"
              value={formData.price}
              onChange={handleChange}
              placeholder="e.g. 25000"
              className="w-full rounded-lg border border-[#E8DDD0] px-4 py-3 outline-none focus:border-[#76243A]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Dhaka"
              className="w-full rounded-lg border border-[#E8DDD0] px-4 py-3 outline-none focus:border-[#76243A]"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Service Images
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="w-full cursor-pointer rounded-lg border border-[#D8C8B8] bg-white text-sm text-[#A69A90] file:mr-4 file:cursor-pointer file:rounded-md file:border file:border-[#76243A] file:bg-[#F8F3EB] file:px-4 file:py-2 file:text-sm file:font-medium file:text-[#76243A] hover:file:bg-[#F1E8DC]"
          />

          <p className="mt-2 text-xs text-[#94765F]">
            Select one or more images, up to {MAX_SERVICE_IMAGES}. Images are uploaded to ImgBB.
          </p>

          {imagePreviews.length > 0 && (
            <div className="mt-3 grid grid-cols-3 gap-2">
              {imagePreviews.map((previewUrl, index) => (
                <div
                  key={previewUrl}
                  className="relative overflow-hidden rounded-lg border border-[#E7DCCF]"
                >
                  <img
                    src={previewUrl}
                    alt={`Selected image ${index + 1}`}
                    className="h-24 w-full object-cover"
                  />

                  <button
                    type="button"
                    aria-label="Remove selected image"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-[#76243A] transition hover:bg-white"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-[#76243A] px-5 py-3 font-medium text-white transition hover:bg-[#581525] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Submitting..." : "Add Service"}
        </button>

        <p className="text-xs text-[#94765F]">
          Your service will be submitted for admin approval.
        </p>
      </form>
    </div>
  );
}
