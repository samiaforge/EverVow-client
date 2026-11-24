"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  Search,
  CalendarDays,
  MapPin,
  User,
  Mail,
  Check,
  X,
  Eye,
  Clock,
  Loader2,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function BookingRequestsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  // Fetch booking requests
  useEffect(() => {
    const loadBookings = async () => {
      try {
        const { data, error } = await authClient.token();

        if (error || !data?.token) {
          throw new Error("Authentication required. Please login again.");
        }

        const response = await fetch(`${API_URL}/vendor-bookings`, {
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        });

        const responseText = await response.text();

        let result;

        try {
          result = JSON.parse(responseText);
        } catch {
          throw new Error(
            "Server returned HTML instead of JSON. Please check your backend URL."
          );
        }

        if (!response.ok) {
          throw new Error(result.message || "Failed to fetch bookings");
        }

        setBookings(result);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  // Accept or reject booking
  const handleUpdateStatus = async (bookingId, status) => {
    try {
      setProcessingId(bookingId);

      const { data, error } = await authClient.token();

      if (error || !data?.token) {
        throw new Error("Authentication required. Please login again.");
      }

      const response = await fetch(
        `${API_URL}/bookings/${bookingId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const responseText = await response.text();

      let result;

      try {
        result = JSON.parse(responseText);
      } catch {
        throw new Error("Server returned an invalid response.");
      }

      if (!response.ok) {
        throw new Error(result.message || "Failed to update booking");
      }

      setBookings(
        bookings.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status }
            : booking
        )
      );

      if (selectedBooking?._id === bookingId) {
        setSelectedBooking({
          ...selectedBooking,
          status,
        });
      }

      toast.success(
        status === "accepted"
          ? "Booking accepted successfully!"
          : "Booking rejected successfully!"
      );
    } catch (error) {
      toast.error(error.message);
    } finally {
      setProcessingId(null);
    }
  };

  // Search bookings
  const filteredBookings = bookings.filter((booking) => {
    const searchText = searchTerm.toLowerCase();

    const matchesSearch =
      booking.customerName?.toLowerCase().includes(searchText) ||
      booking.serviceName?.toLowerCase().includes(searchText) ||
      booking.eventLocation?.toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "all" || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Statistics
  const totalBookings = bookings.length;

  const pendingBookings = bookings.filter(
    (booking) => booking.status === "pending"
  ).length;

  const acceptedBookings = bookings.filter(
    (booking) => booking.status === "accepted"
  ).length;

  const rejectedBookings = bookings.filter(
    (booking) => booking.status === "rejected"
  ).length;

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-BD", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[#F8F5F1] p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* Header */}
        <div>
          <p className="mb-2 text-sm font-medium uppercase tracking-[3px] text-[#76243A]">
            Vendor Dashboard
          </p>

          <h1 className="text-3xl font-bold text-[#292321] md:text-4xl">
            Booking Requests
          </h1>

          <p className="mt-2 text-gray-600">
            Manage your customer booking requests and event details.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-xl border border-[#E7DCCF] bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Total Bookings</p>
              <CalendarDays className="text-[#76243A]" size={22} />
            </div>

            <h2 className="mt-3 text-3xl font-bold text-[#292321]">
              {totalBookings}
            </h2>
          </div>

          <div className="rounded-xl border border-[#E7DCCF] bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Pending</p>
              <Clock className="text-amber-500" size={22} />
            </div>

            <h2 className="mt-3 text-3xl font-bold text-amber-600">
              {pendingBookings}
            </h2>
          </div>

          <div className="rounded-xl border border-[#E7DCCF] bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Accepted</p>
              <Check className="text-green-600" size={22} />
            </div>

            <h2 className="mt-3 text-3xl font-bold text-green-600">
              {acceptedBookings}
            </h2>
          </div>

          <div className="rounded-xl border border-[#E7DCCF] bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Rejected</p>
              <X className="text-red-500" size={22} />
            </div>

            <h2 className="mt-3 text-3xl font-bold text-red-500">
              {rejectedBookings}
            </h2>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col gap-4 rounded-xl border border-[#E7DCCF] bg-white p-4 md:flex-row">

          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />

            <input
              type="text"
              placeholder="Search customer, service or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-[#E7DCCF] py-3 pl-10 pr-4 outline-none focus:border-[#76243A]"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-[#E7DCCF] bg-white px-4 py-3 outline-none focus:border-[#76243A]"
          >
            <option value="all">All Bookings</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Booking List */}
        <div className="space-y-5">

          {loading ? (
            <div className="flex justify-center rounded-xl border border-[#E7DCCF] bg-white py-20">
              <Loader2 className="animate-spin text-[#76243A]" size={32} />
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="rounded-xl border border-[#E7DCCF] bg-white py-20 text-center">
              <CalendarDays
                className="mx-auto mb-4 text-gray-400"
                size={48}
              />

              <h3 className="text-xl font-semibold text-[#292321]">
                No booking requests found
              </h3>

              <p className="mt-2 text-gray-500">
                {searchTerm || statusFilter !== "all"
                  ? "Try changing your search or filter."
                  : "Your booking requests will appear here."}
              </p>
            </div>
          ) : (
            filteredBookings.map((booking) => (
              <div
                key={booking._id}
                className="rounded-xl border border-[#E7DCCF] bg-white p-5 shadow-sm"
              >
                {/* Header */}
                <div className="flex flex-col justify-between gap-4 md:flex-row">
                  <div>
                    <h2 className="text-xl font-semibold text-[#292321]">
                      {booking.serviceName}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Booking ID: {booking._id.slice(-8)}
                    </p>
                  </div>

                  <span
                    className={`h-fit rounded-full px-4 py-2 text-sm font-medium ${
                      booking.status === "pending"
                        ? "bg-amber-100 text-amber-700"
                        : booking.status === "accepted"
                        ? "bg-green-100 text-green-700"
                        : booking.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {booking.status?.charAt(0).toUpperCase() +
                      booking.status?.slice(1)}
                  </span>
                </div>

                {/* Information */}
                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

                  <div className="flex items-start gap-3">
                    <User className="mt-1 text-[#76243A]" size={18} />

                    <div>
                      <p className="text-sm text-gray-500">Customer</p>
                      <p className="font-medium text-[#292321]">
                        {booking.customerName || "Unknown Customer"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CalendarDays className="mt-1 text-[#76243A]" size={18} />

                    <div>
                      <p className="text-sm text-gray-500">Event Date</p>
                      <p className="font-medium text-[#292321]">
                        {booking.eventDate
                          ? formatDate(booking.eventDate)
                          : "Not specified"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="mt-1 text-[#76243A]" size={18} />

                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium text-[#292321]">
                        {booking.eventLocation || "Not specified"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <p className="font-medium text-[#292321]">
                      {booking.serviceCategory || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Service Price</p>
                    <p className="font-medium text-[#292321]">
                        <i className="fa-solid fa-bangladeshi-taka-sign"></i>
                      {Number(booking.servicePrice || 0).toLocaleString("en-BD")}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Requested On</p>
                    <p className="font-medium text-[#292321]">
                      {booking.createdAt
                        ? formatDate(booking.createdAt)
                        : "N/A"}
                    </p>
                  </div>
                </div>

                {/* Message */}
                {booking.message && (
                  <div className="mt-5 rounded-lg bg-[#F8F5F1] p-4">
                    <p className="mb-1 text-sm font-medium text-[#76243A]">
                      Customer Message
                    </p>

                    <p className="text-sm text-gray-600">
                      {booking.message}
                    </p>
                  </div>
                )}

                {/* Buttons */}
                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    onClick={() => setSelectedBooking(booking)}
                    className="flex items-center gap-2 rounded-lg border border-[#76243A] px-4 py-2 text-sm font-medium text-[#76243A] transition hover:bg-[#76243A] hover:text-white"
                  >
                    <Eye size={16} />
                    View Details
                  </button>

                  {booking.status === "pending" && (
                    <button
                      onClick={() =>
                        handleUpdateStatus(booking._id, "accepted")
                      }
                      disabled={processingId === booking._id}
                      className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700 disabled:opacity-50"
                    >
                      {processingId === booking._id ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Check size={16} />
                      )}
                      Accept
                    </button>
                  )}

                  {booking.status === "pending" && (
                    <button
                      onClick={() =>
                        handleUpdateStatus(booking._id, "rejected")
                      }
                      disabled={processingId === booking._id}
                      className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
                    >
                      <X size={16} />
                      Reject
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Details Modal */}
        {selectedBooking && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setSelectedBooking(null)}
          >
            <div
              className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[#292321]">
                  Booking Details
                </h2>

                <button
                  onClick={() => setSelectedBooking(null)}
                  className="rounded-full p-2 hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Service */}
              <div className="mt-6 border-b pb-5">
                <h3 className="text-lg font-semibold text-[#76243A]">
                  {selectedBooking.serviceName}
                </h3>

                <p className="mt-2 text-gray-500">
                  Category: {selectedBooking.serviceCategory || "N/A"}
                </p>

                <p className="mt-1 font-medium text-[#292321]">
                  Price: ৳
                  {Number(
                    selectedBooking.servicePrice || 0
                  ).toLocaleString("en-BD")}
                </p>
              </div>

              {/* Customer */}
              <div className="mt-5 space-y-4">
                <h3 className="font-semibold text-[#292321]">
                  Customer Information
                </h3>

                <div className="flex items-center gap-3">
                  <User className="text-[#76243A]" size={20} />

                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">
                      {selectedBooking.customerName || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="text-[#76243A]" size={20} />

                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="break-all font-medium">
                      {selectedBooking.customerEmail || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <CalendarDays className="text-[#76243A]" size={20} />

                  <div>
                    <p className="text-sm text-gray-500">Event Date</p>
                    <p className="font-medium">
                      {selectedBooking.eventDate
                        ? formatDate(selectedBooking.eventDate)
                        : "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="text-[#76243A]" size={20} />

                  <div>
                    <p className="text-sm text-gray-500">Event Location</p>
                    <p className="font-medium">
                      {selectedBooking.eventLocation || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="mt-5 rounded-lg bg-[#F8F5F1] p-4">
                <h3 className="mb-2 font-semibold text-[#76243A]">
                  Customer Message
                </h3>

                <p className="text-sm text-gray-600">
                  {selectedBooking.message || "No message provided."}
                </p>
              </div>

              {/* Status */}
              <div className="mt-5">
                <p className="text-sm text-gray-500">Current Status</p>

                <span
                  className={`mt-2 inline-block rounded-full px-4 py-2 text-sm font-medium ${
                    selectedBooking.status === "pending"
                      ? "bg-amber-100 text-amber-700"
                      : selectedBooking.status === "accepted"
                      ? "bg-green-100 text-green-700"
                      : selectedBooking.status === "rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {selectedBooking.status?.charAt(0).toUpperCase() +
                    selectedBooking.status?.slice(1)}
                </span>
              </div>

              {/* Actions */}
              {selectedBooking.status === "pending" && (
                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    onClick={() =>
                      handleUpdateStatus(selectedBooking._id, "accepted")
                    }
                    disabled={processingId === selectedBooking._id}
                    className="flex-1 rounded-lg bg-green-600 py-3 font-medium text-white hover:bg-green-700 disabled:opacity-50"
                  >
                    Accept Booking
                  </button>

                  <button
                    onClick={() =>
                      handleUpdateStatus(selectedBooking._id, "rejected")
                    }
                    disabled={processingId === selectedBooking._id}
                    className="flex-1 rounded-lg bg-red-600 py-3 font-medium text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    Reject Booking
                  </button>
                </div>
              )}

              <button
                onClick={() => setSelectedBooking(null)}
                className="mt-4 w-full rounded-lg border border-[#E7DCCF] py-3 font-medium text-gray-600 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}