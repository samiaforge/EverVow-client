"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ServiceDetailsPage() {
  const params = useParams();
  const router = useRouter();

   const { data: session, isPending: sessionPending } = authClient.useSession();

  const userRole = session?.user?.role?.toLowerCase();

  const serviceId = params.id;

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchService = async () => {
      try {
        // Check authentication
        const { data } = await authClient.token();

        if (!data?.token) {
          router.replace(
            `/sign-in?callbackUrl=${encodeURIComponent(
              `/services/${serviceId}`
            )}`
          );
          return;
        }

        // Fetch service details
        const response = await fetch(
          `${API_URL}/services/${serviceId}`
        );

        if (!response.ok) {
          throw new Error("Service not found");
        }

        const serviceData = await response.json();

        setService(serviceData);
      } catch (error) {
        console.error("Service details error:", error);

        toast.error("Failed to load service details");
      } finally {
        setLoading(false);
      }
    };

    if (serviceId) {
      fetchService();
    }
  }, [serviceId, router]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (userRole !== "customer") {
  toast.error("Only customers can request a booking");
  return;
}

    if (!eventDate || !eventLocation.trim()) {
      toast.error("Please fill in the required fields");
      return;
    }

    try {
      setSubmitting(true);

      const { data } = await authClient.token();

      if (!data?.token) {
        router.push("/sign-in");
        return;
      }

      const response = await fetch(`${API_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.token}`,
        },
        body: JSON.stringify({
          serviceId: service._id,
          eventDate,
          eventLocation,
          message,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Booking failed");
      }

      toast.success("Booking request submitted successfully!");

      setEventDate("");
      setEventLocation("");
      setMessage("");

      router.push("/customer-dashboard/my-bookings");
    } catch (error) {
      console.error("Booking error:", error);

      toast.error(error.message || "Failed to submit booking");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F5F0]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#E8DDD0] border-t-[#76243A]" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#F8F5F0] px-4 text-center">
        <h1 className="text-3xl font-bold text-[#76243A]">
          Service Not Found
        </h1>

        <p className="mt-3 text-[#625B56]">
          This service may not exist or may no longer be available.
        </p>

        <Link
          href="/services"
          className="mt-6 rounded-lg bg-[#76243A] px-6 py-3 text-white"
        >
          Browse Services
        </Link>
      </div>
    );
  }

  const images = service.images?.length
    ? service.images
    : [service.image || service.serviceImage].filter(Boolean);

  return (
    <main className="min-h-screen bg-[#F8F5F0]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-[#94765F]">
          <Link href="/" className="hover:text-[#76243A]">
            Home
          </Link>

          {" / "}

          <Link href="/services" className="hover:text-[#76243A]">
            Browse Services
          </Link>

          {" / "}

          <span className="text-[#76243A]">
            {service.serviceName}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Service Information */}
          <div className="space-y-6 lg:col-span-2">
            {/* Images */}
            {/* Service Images */}
<div className="overflow-hidden rounded-2xl shadow-sm">
  {images.length > 0 ? (
    <div className="grid grid-cols-1 gap-2">
      {images.map((image, index) => (
        <div
          key={index}
          className="flex w-full items-center justify-center overflow-hidden bg-[#F8F5F0]"
        >
          <img
            src={image}
            alt={`${service.serviceName} ${index + 1}`}
            className="h-[330px] w-full object-contain sm:h-[400px] lg:h-[460px] "
          />
        </div>
      ))}
    </div>
  ) : (
    <div className="flex h-[350px] w-full items-center justify-center bg-[#E8DDD0] text-[#94765F]">
      No images available
    </div>
  )}
</div>

            {/* Details */}
            <div className="rounded-2xl border border-[#E8DDD0] bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="rounded-full bg-[#F8F5F0] px-4 py-2 text-sm text-[#76243A]">
                  {service.category}
                </span>

                <span className="text-2xl font-bold text-[#76243A]">
                  ৳{Number(service.price).toLocaleString()}
                </span>
              </div>

              <h1 className="mt-5 text-2xl font-bold text-[#76243A] sm:text-3xl">
                {service.serviceName}
              </h1>

              <p className="mt-4 leading-7 text-[#625B56]">
                {service.description}
              </p>

              <div className="mt-6 space-y-3 border-t border-[#E8DDD0] pt-5">
                <div className="flex gap-3">
                  <span className="font-semibold text-[#76243A]">
                    Location:
                  </span>

                  <span className="text-[#625B56]">
                    {service.location || "Not specified"}
                  </span>
                </div>

                <div className="flex gap-3">
                  <span className="font-semibold text-[#76243A]">
                    Category:
                  </span>

                  <span className="text-[#625B56]">
                    {service.category}
                  </span>
                </div>
              </div>
            </div>

            {/* Vendor Information */}
            <div className="rounded-2xl border border-[#E8DDD0] bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-[#76243A]">
                Vendor Information
              </h2>

              <div className="mt-4 flex items-center gap-4">
                {service.vendorImage ? (
                  <img
                    src={service.vendorImage}
                    alt="Vendor"
                    className="h-14 w-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E8DDD0] text-[#76243A]">
                    V
                  </div>
                )}

                <div>
                  <p className="font-semibold text-[#76243A]">
                    {service.vendorName ||
                      service.businessName ||
                      service.vendor?.name ||
                      "Wedding Service Provider"}
                  </p>

                  <p className="text-sm text-[#625B56]">
                    Professional Wedding Vendor
                  </p>
                </div>
              </div>
            </div>
          </div>

         
          {/* Booking Section */}
<div>
  {sessionPending ? (
    <div className="flex min-h-60 items-center justify-center rounded-2xl border border-[#E8DDD0] bg-white">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#E8DDD0] border-t-[#76243A]" />
    </div>
  ) : userRole === "customer" ? (
    <div className="sticky top-24 rounded-2xl border border-[#E8DDD0] bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-[#76243A]">
        Request a Booking
      </h2>

      <p className="mt-2 text-sm text-[#625B56]">
        Submit your event details to request this service.
      </p>

      <form
        onSubmit={handleBooking}
        className="mt-6 space-y-5"
      >
        {/* Event Date */}
        <div>
          <label
            htmlFor="eventDate"
            className="mb-2 block text-sm font-medium text-[#76243A]"
          >
            Event Date *
          </label>

          <input
            id="eventDate"
            type="date"
            required
            min={new Date().toISOString().split("T")[0]}
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="w-full rounded-lg border border-[#E8DDD0] px-4 py-3 text-sm outline-none focus:border-[#76243A]"
          />
        </div>

        {/* Event Location */}
        <div>
          <label
            htmlFor="eventLocation"
            className="mb-2 block text-sm font-medium text-[#76243A]"
          >
            Event Location *
          </label>

          <input
            id="eventLocation"
            type="text"
            required
            placeholder="Enter event location"
            value={eventLocation}
            onChange={(e) => setEventLocation(e.target.value)}
            className="w-full rounded-lg border border-[#E8DDD0] px-4 py-3 text-sm outline-none focus:border-[#76243A]"
          />
        </div>

        {/* Message */}
        <div>
          <label
            htmlFor="message"
            className="mb-2 block text-sm font-medium text-[#76243A]"
          >
            Additional Message
          </label>

          <textarea
            id="message"
            rows={4}
            placeholder="Tell the vendor about your wedding..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full resize-none rounded-lg border border-[#E8DDD0] px-4 py-3 text-sm outline-none focus:border-[#76243A]"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-[#76243A] py-3 font-medium text-white transition hover:bg-[#5C1B2C] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting
            ? "Submitting Request..."
            : "Request Booking"}
        </button>

        <p className="text-center text-xs text-[#94765F]">
          Your booking request will be pending until
          the vendor responds.
        </p>
      </form>
    </div>
  ) : (
    <div className="rounded-2xl border border-[#E8DDD0] bg-white p-6 text-center shadow-sm">
      <h2 className="text-xl font-bold text-[#76243A]">
        Booking Unavailable
      </h2>

      <p className="mt-3 text-sm leading-6 text-[#625B56]">
        {userRole === "vendor"
          ? "Vendor accounts cannot submit booking requests. You can browse wedding services and manage your own services from your dashboard."
          : "Only customer accounts can submit booking requests for wedding services."}
      </p>

      {userRole === "vendor" && (
        <Link
          href="/vendor-dashboard"
          className="mt-5 inline-block rounded-lg bg-[#76243A] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#5C1B2C]"
        >
          Go to Dashboard
        </Link>
      )}
    </div>
  )}
</div>
        </div>
      </div>
    </main>
  );
}