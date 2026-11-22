"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import Link from "next/link";

const API_URL = "http://localhost:5000";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancelId, setCancelId] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  // Get customer's bookings
  const fetchBookings = async () => {
    try {
      setLoading(true);

      const { data } = await authClient.token();

      if (!data?.token) {
        toast.error("Please login first");
        return;
      }

      const response = await fetch(`${API_URL}/my-bookings`, {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to load bookings");
      }

      setBookings(Array.isArray(result) ? result : result.bookings || []);
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadBookings = async () => {
      await fetchBookings();
    };

    loadBookings();
  }, []);

  // Cancel booking
  const handleCancelBooking = async () => {
    if (!cancelId) return;

    try {
      setCancelling(true);

      const { data } = await authClient.token();

      const response = await fetch(`${API_URL}/bookings/${cancelId}/cancel`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${data.token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to cancel booking");
      }

      toast.success("Booking cancelled successfully!");

      setCancelId(null);
      setSelectedBooking(null);

      await fetchBookings();
    } catch (error) {
      toast.error(error.message || "Could not cancel booking");
    } finally {
      setCancelling(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "accepted":
        return "bg-green-100 text-green-700";

      case "rejected":
        return "bg-red-100 text-red-700";

      case "cancelled":
        return "bg-gray-200 text-gray-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  const formatDate = (date) => {
    if (!date) return "Not available";

    return new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#76243A] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-7">
      {/* Heading */}
      <div>
        <p className="text-sm font-medium uppercase tracking-widest text-[#76243A]">
          Customer Dashboard
        </p>

        <h1 className="mt-2 text-3xl font-bold text-[#321923]">My Bookings</h1>

        <p className="mt-2 text-sm text-gray-500">
          Track and manage all your wedding service booking requests.
        </p>
      </div>

      {/* Booking Statistics */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          {
            label: "Total Bookings",
            value: bookings.length,
          },
          {
            label: "Pending",
            value: bookings.filter((b) => b.status?.toLowerCase() === "pending")
              .length,
          },
          {
            label: "Accepted",
            value: bookings.filter(
              (b) => b.status?.toLowerCase() === "accepted",
            ).length,
          },
          {
            label: "Rejected",
            value: bookings.filter(
              (b) => b.status?.toLowerCase() === "rejected",
            ).length,
          },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-[#eadfe0] bg-white p-5"
          >
            <p className="text-sm text-gray-500">{item.label}</p>
            <h2 className="mt-2 text-3xl font-bold text-[#76243A]">
              {item.value}
            </h2>
          </div>
        ))}
      </div>

      {/* Booking List */}
      <div className="rounded-2xl border border-[#eadfe0] bg-white p-5 sm:p-7">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#321923]">
            All Booking Requests
          </h2>

          <span className="rounded-full bg-[#f8f3eb] px-3 py-1 text-sm text-[#76243A]">
            {bookings.length} bookings
          </span>
        </div>

        {bookings.length === 0 ? (
          <div className="py-16 text-center">
            <div className="text-5xl">💍</div>
            <h3 className="mt-4 text-lg font-semibold text-[#321923]">
              No bookings yet
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Explore our wedding services and make your first booking.
            </p>

            <Link
              href="/services"
              className="mt-5 inline-block rounded-full bg-[#76243A] px-6 py-3 text-sm font-semibold text-white hover:bg-[#5d1b2e]"
            >
              Explore Services
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="flex flex-col gap-5 rounded-xl border border-[#eadfe0] p-4 transition hover:shadow-md sm:flex-row sm:items-center"
              >
                {/* Service Image */}
                <div className="h-28 w-full shrink-0 overflow-hidden rounded-xl bg-[#f8f3eb] sm:w-32">
                  {booking.serviceImage || booking.image ? (
                    <img
                      src={booking.serviceImage || booking.image}
                      alt={booking.serviceName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-gray-400">
                      No Image
                    </div>
                  )}
                </div>

                {/* Booking Information */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-lg font-bold text-[#321923]">
                      {booking.serviceName}
                    </h3>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusStyle(
                        booking.status,
                      )}`}
                    >
                      {booking.status || "Pending"}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-gray-600">
                    Vendor: {booking.vendorName || "Not available"}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Event Date: {formatDate(booking.eventDate)}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Location: {booking.eventLocation || "Not specified"}
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Requested: {formatDate(booking.createdAt)}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex shrink-0 flex-row gap-2 sm:flex-col">
                  <button
                    onClick={() => setSelectedBooking(booking)}
                    className="rounded-lg border border-[#76243A] px-4 py-2 text-sm font-semibold text-[#76243A] hover:bg-[#f8f3eb]"
                  >
                    View Details
                  </button>

                  {booking.status?.toLowerCase() === "pending" && (
                    <button
                      onClick={() => setCancelId(booking._id)}
                      className="rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#321923]">
                Booking Details
              </h2>

              <button
                onClick={() => setSelectedBooking(null)}
                className="text-2xl text-gray-500 hover:text-black"
              >
                &times;
              </button>
            </div>

            <div className="mt-5 space-y-4 text-sm">
              <div>
                <p className="text-gray-400">Service Name</p>
                <p className="mt-1 font-semibold text-[#321923]">
                  {selectedBooking.serviceName}
                </p>
              </div>

              <div>
                <p className="text-gray-400">Category</p>
                <p className="mt-1 font-semibold">
                  {selectedBooking.serviceCategory || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-gray-400">Service Price</p>
                <p className="mt-1 font-semibold">
                  ৳{selectedBooking.servicePrice ?? "N/A"}
                </p>
              </div>

              <div>
                <p className="text-gray-400">Vendor</p>
                <p className="mt-1 font-semibold">
                  {selectedBooking.vendorName || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-gray-400">Event Date</p>
                <p className="mt-1 font-semibold">
                  {formatDate(selectedBooking.eventDate)}
                </p>
              </div>

              <div>
                <p className="text-gray-400">Event Location</p>
                <p className="mt-1 font-semibold">
                  {selectedBooking.eventLocation}
                </p>
              </div>

              <div>
                <p className="text-gray-400">Additional Message</p>
                <p className="mt-1 font-semibold">
                  {selectedBooking.message || "No additional message"}
                </p>
              </div>

              <div>
                <p className="text-gray-400">Booking Status</p>
                <span
                  className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusStyle(
                    selectedBooking.status,
                  )}`}
                >
                  {selectedBooking.status}
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedBooking(null)}
              className="mt-6 w-full rounded-xl bg-[#76243A] py-3 font-semibold text-white hover:bg-[#5d1b2e]"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Cancel Confirmation */}
      {cancelId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-bold text-[#321923]">
              Cancel Booking?
            </h2>

            <p className="mt-3 text-sm text-gray-500">
              Are you sure you want to cancel this booking request? This action
              cannot be undone.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setCancelId(null)}
                disabled={cancelling}
                className="flex-1 rounded-lg border border-gray-300 py-2.5 text-sm font-semibold text-gray-600"
              >
                Keep Booking
              </button>

              <button
                onClick={handleCancelBooking}
                disabled={cancelling}
                className="flex-1 rounded-lg bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >
                {cancelling ? "Cancelling..." : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
