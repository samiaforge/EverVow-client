"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const API_URL = "http://localhost:5000";

export default function VendorDashboard() {
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  // Fetch vendor services and booking requests
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const { data } = await authClient.token();

        if (!data?.token) {
          toast.error("Please login first");
          return;
        }

        const headers = {
          Authorization: `Bearer ${data.token}`,
        };

        const [servicesResponse, bookingsResponse, profileResponse] =
          await Promise.all([
            fetch(`${API_URL}/my-services`, { headers }),
            fetch(`${API_URL}/vendor-bookings`, { headers }),
            fetch(`${API_URL}/profile`, { headers }),
          ]);

        const servicesData = await servicesResponse.json();
        const bookingsData = await bookingsResponse.json();
        const profileData = await profileResponse.json();

        if (!servicesResponse.ok) {
          throw new Error(servicesData.message || "Failed to load services");
        }

        if (!bookingsResponse.ok) {
          throw new Error(bookingsData.message || "Failed to load bookings");
        }

        if (!profileResponse.ok) {
          throw new Error(profileData.message || "Failed to load profile");
        }

        console.log("Subscription Data:", {
  premium: profileData.premium,
  subscriptionPlan: profileData.subscriptionPlan,
  subscriptionStatus: profileData.subscriptionStatus,
  subscriptionExpiresAt: profileData.subscriptionExpiresAt,
});
        setProfile(profileData);

        setServices(
          Array.isArray(servicesData)
            ? servicesData
            : servicesData.services || [],
        );

        setBookings(
          Array.isArray(bookingsData)
            ? bookingsData
            : bookingsData.bookings || [],
        );
      } catch (error) {
        toast.error(error.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Calculate statistics
  const totalServices = services.length;

  const activeServices = services.filter(
    (service) =>
      service.isActive === true && service.status?.toLowerCase() === "approved",
  ).length;

  const pendingRequests = bookings.filter(
    (booking) => booking.status?.toLowerCase() === "pending",
  ).length;

  const acceptedBookings = bookings.filter(
    (booking) => booking.status?.toLowerCase() === "accepted",
  ).length;

  const isPremium =
  profile?.premium === true &&
  ["active", "trialing"].includes(
    profile?.subscriptionStatus?.toLowerCase()
  );

const subscriptionName = isPremium
  ? profile?.subscriptionPlan || "Premium"
  : "Free";

const subscriptionStatus = isPremium
  ? profile?.subscriptionStatus || "Active"
  : "Free Plan";

const expiryDate = profile?.subscriptionExpiresAt
  ? new Date(profile.subscriptionExpiresAt).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  : null;

  const stats = [
    {
      title: "Total Services",
      value: totalServices,
      description: "All your listed services",
    },
    {
      title: "Active Services",
      value: activeServices,
      description: "Approved and currently available services",
    },
    {
      title: "Pending Requests",
      value: pendingRequests,
      description: "Waiting for your response",
    },
    {
      title: "Accepted Bookings",
      value: acceptedBookings,
      description: "Confirmed booking requests",
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
      {/* Welcome Section */}
      <section>
        <p className="mb-2 text-sm font-medium tracking-widest text-[#94765F]">
          WELCOME TO EVERVOW
        </p>

        <h2 className="text-2xl font-bold text-[#292321] md:text-3xl">
          Your Business at a Glance
        </h2>

        <p className="mt-2 text-sm text-[#625B56]">
          Manage your services, track bookings, and grow your wedding business.
        </p>
      </section>

      {/* Statistics Cards */}
      <section>
        <h3 className="mb-4 text-lg font-semibold text-[#292321]">Overview</h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="rounded-xl border border-[#E8DDD0] bg-white p-5 shadow-sm"
            >
              <p className="text-sm font-medium text-[#94765F]">{stat.title}</p>

              <h4 className="my-3 text-3xl font-bold text-[#76243A]">
                {stat.value}
              </h4>

              <p className="text-xs text-[#625B56]">{stat.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Subscription Card */}
      <section className="rounded-xl bg-[#76243A] p-6 text-white md:flex md:items-center md:justify-between">
        <div>
          <p className="text-sm text-[#F1D8D8]">CURRENT SUBSCRIPTION</p>

          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h3 className="text-2xl font-bold">{subscriptionName} Plan</h3>

            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold capitalize">
              {subscriptionStatus}
            </span>
          </div>

          <p className="mt-2 text-sm text-[#F1D8D8]">
            {isPremium
              ? "Enjoy your premium subscription benefits."
              : "List up to 3 active services with your current plan."}
          </p>

          {isPremium && expiryDate && (
            <p className="mt-2 text-sm text-[#F1D8D8]">
              Expires on: {expiryDate}
            </p>
          )}

          {isPremium && profile?.cancelAtPeriodEnd && (
            <p className="mt-2 text-sm text-amber-200">
              Your subscription will end at the current billing period.
            </p>
          )}
        </div>

        <Link
          href="/vendor-dashboard/subscription"
          className="mt-5 inline-block rounded-lg bg-[#F1E8DC] px-5 py-3 text-sm font-semibold text-[#76243A] hover:bg-white md:mt-0"
        >
          {isPremium ? "Manage Subscription" : "Explore Premium"}
        </Link>
      </section>

      {/* Getting Started */}
      <section className="rounded-xl border border-[#E8DDD0] bg-white p-6">
        <h3 className="text-lg font-semibold text-[#292321]">
          Ready to grow your business?
        </h3>

        <p className="mt-2 text-sm text-[#625B56]">
          Add your wedding service and let customers discover what you offer.
        </p>

        <Link
          href="/vendor-dashboard/add-service"
          className="mt-5 inline-block rounded-lg bg-[#76243A] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#581525]"
        >
          <i className="fa-solid fa-plus pr-2"></i>
          Add Your First Service
        </Link>
      </section>
    </div>
  );
}
