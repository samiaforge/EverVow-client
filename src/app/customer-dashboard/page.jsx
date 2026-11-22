
"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const API_URL = "http://localhost:5000";

export default function CustomerDashboardPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch customer's bookings from database
  useEffect(() => {
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
          throw new Error(
            result.message || "Failed to load dashboard data"
          );
        }

        setBookings(
          Array.isArray(result) ? result : result.bookings || []
        );
      } catch (error) {
        toast.error(error.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Calculate booking statistics
  const totalBookings = bookings.length;

  const pendingBookings = bookings.filter(
    (booking) => booking.status?.toLowerCase() === "pending"
  ).length;

  const acceptedBookings = bookings.filter(
    (booking) => booking.status?.toLowerCase() === "accepted"
  ).length;

  const rejectedBookings = bookings.filter(
    (booking) => booking.status?.toLowerCase() === "rejected"
  ).length;

  const stats = [
    {
      title: "Total Booking Requests",
      value: totalBookings,
      icon: CalendarDays,
      color: "bg-[#76243A]",
    },
    {
      title: "Pending Bookings",
      value: pendingBookings,
      icon: Clock,
      color: "bg-amber-500",
    },
    {
      title: "Accepted Bookings",
      value: acceptedBookings,
      icon: CheckCircle2,
      color: "bg-green-600",
    },
    {
      title: "Rejected Bookings",
      value: rejectedBookings,
      icon: XCircle,
      color: "bg-red-500",
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#76243A] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">
          Customer Dashboard
        </h1>

        <p className="mt-2 text-gray-500">
          Manage your wedding service bookings from one place.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-[#E7DCCF] bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    {stat.title}
                  </p>

                  <h2 className="mt-3 text-3xl font-bold">
                    {stat.value}
                  </h2>
                </div>

                <div
                  className={`${stat.color} rounded-xl p-3 text-white`}
                >
                  <Icon size={22} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Welcome Section */}
      <div className="rounded-2xl bg-[#76243A] p-6 text-white sm:p-8">
        <h2 className="text-2xl font-bold">
          Plan your perfect day 💍
        </h2>

        <p className="mt-3 max-w-xl text-white/80">
          Keep track of your wedding service requests, manage your
          bookings, and stay updated with your vendors.
        </p>
      </div>
    </div>
  );
}
