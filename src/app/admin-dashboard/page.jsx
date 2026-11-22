"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  BriefcaseBusiness,
  UserRound,
  ClipboardList,
  Clock,
  CreditCard,
  ArrowUpRight,
  Loader2,
  ShieldCheck,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data } = await authClient.token();

        const headers = {
          Authorization: `Bearer ${data.token}`,
        };

        const [usersResponse, servicesResponse] = await Promise.all([
          fetch(`${API_URL}/admin/users`, {
            headers,
          }),

          fetch(`${API_URL}/admin/services`, {
            headers,
          }),
        ]);

        if (!usersResponse.ok || !servicesResponse.ok) {
          throw new Error("Failed to load dashboard data");
        }

        const usersData = await usersResponse.json();
        const servicesData = await servicesResponse.json();

        setUsers(
          Array.isArray(usersData)
            ? usersData
            : usersData.users || []
        );

        setServices(
          Array.isArray(servicesData)
            ? servicesData
            : servicesData.services || []
        );
      } catch (error) {
        console.error("Dashboard data error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const totalUsers = users.length;

  const totalVendors = users.filter(
    (user) => user.role === "vendor"
  ).length;

  const totalCustomers = users.filter(
    (user) => user.role === "customer"
  ).length;

  const totalServices = services.length;

  const pendingServices = services.filter(
    (service) =>
      service.status === "pending" ||
      service.approvalStatus === "pending"
  ).length;

  const stats = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: Users,
      description: "Registered users",
      color: "bg-[#76243A]",
    },
    {
      title: "Total Vendors",
      value: totalVendors,
      icon: BriefcaseBusiness,
      description: "Service providers",
      color: "bg-[#94765F]",
    },
    {
      title: "Total Customers",
      value: totalCustomers,
      icon: UserRound,
      description: "Registered customers",
      color: "bg-[#8B6D8B]",
    },
    {
      title: "Total Services",
      value: totalServices,
      icon: ClipboardList,
      description: "Services on platform",
      color: "bg-[#647C67]",
    },
    {
      title: "Pending Services",
      value: pendingServices,
      icon: Clock,
      description: "Waiting for review",
      color: "bg-[#C18A42]",
    },
    {
      title: "Transactions",
      value: "—",
      icon: CreditCard,
      description: "Payment records",
      color: "bg-[#5D718A]",
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-[#76243A]" size={36} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-medium text-[#94765F]">
            Administration
          </p>

          <h2 className="mt-1 text-2xl font-bold text-[#76243A] md:text-3xl">
            Dashboard Overview
          </h2>

          <p className="mt-2 text-sm text-[#625B56]">
            Monitor and manage your wedding service platform.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-[#E8DDD0] bg-white px-4 py-3">
          <ShieldCheck className="text-[#76243A]" size={20} />

          <div>
            <p className="text-sm font-semibold text-[#76243A]">
              Administrator
            </p>

            <p className="text-xs text-[#94765F]">
              Platform Management
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-[#E8DDD0] bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-[#625B56]">
                    {stat.title}
                  </p>

                  <h3 className="mt-3 text-3xl font-bold text-[#76243A]">
                    {stat.value}
                  </h3>

                  <p className="mt-2 text-xs text-[#94765F]">
                    {stat.description}
                  </p>
                </div>

                <div
                  className={`${stat.color} flex h-12 w-12 items-center justify-center rounded-xl text-white`}
                >
                  <Icon size={22} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}

      <div>
        <h3 className="mb-4 text-xl font-semibold text-[#76243A]">
          Quick Actions
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Link
            href="/admin-dashboard/users"
            className="group flex items-center justify-between rounded-2xl border border-[#E8DDD0] bg-white p-5 transition-all hover:border-[#76243A] hover:shadow-md"
          >
            <div>
              <h4 className="font-semibold text-[#76243A]">
                Manage Users
              </h4>

              <p className="mt-1 text-sm text-[#94765F]">
                View and manage registered users
              </p>
            </div>

            <ArrowUpRight
              size={20}
              className="text-[#94765F] transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
            />
          </Link>

          <Link
            href="/admin-dashboard/services"
            className="group flex items-center justify-between rounded-2xl border border-[#E8DDD0] bg-white p-5 transition-all hover:border-[#76243A] hover:shadow-md"
          >
            <div>
              <h4 className="font-semibold text-[#76243A]">
                Manage Services
              </h4>

              <p className="mt-1 text-sm text-[#94765F]">
                Review submitted services
              </p>
            </div>

            <ArrowUpRight
              size={20}
              className="text-[#94765F] transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
            />
          </Link>

          <Link
            href="/admin-dashboard/transactions"
            className="group flex items-center justify-between rounded-2xl border border-[#E8DDD0] bg-white p-5 transition-all hover:border-[#76243A] hover:shadow-md"
          >
            <div>
              <h4 className="font-semibold text-[#76243A]">
                Transactions
              </h4>

              <p className="mt-1 text-sm text-[#94765F]">
                Review payment records
              </p>
            </div>

            <ArrowUpRight
              size={20}
              className="text-[#94765F] transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>

      {/* Pending Services */}

      <div className="rounded-2xl border border-[#E8DDD0] bg-white p-5 md:p-6">
        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-lg font-semibold text-[#76243A]">
              Service Approval Overview
            </h3>

            <p className="mt-1 text-sm text-[#94765F]">
              Services requiring administrative review
            </p>
          </div>

          <Link
            href="/admin-dashboard/services"
            className="flex items-center gap-1 text-sm font-medium text-[#76243A] hover:underline"
          >
            View All Services
            <ArrowUpRight size={16} />
          </Link>
        </div>

        {pendingServices === 0 ? (
          <div className="rounded-xl bg-[#F8F5F0] py-10 text-center">
            <ShieldCheck
              size={35}
              className="mx-auto mb-3 text-[#647C67]"
            />

            <p className="font-medium text-[#76243A]">
              All caught up!
            </p>

            <p className="mt-1 text-sm text-[#94765F]">
              No services are waiting for approval.
            </p>
          </div>
        ) : (
          <div className="rounded-xl bg-[#F8F5F0] p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#C18A42]/15 text-[#C18A42]">
                <Clock size={22} />
              </div>

              <div>
                <p className="text-2xl font-bold text-[#76243A]">
                  {pendingServices}
                </p>

                <p className="text-sm text-[#94765F]">
                  Services awaiting approval
                </p>
              </div>
            </div>

            <Link
              href="/admin-dashboard/services"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#76243A] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#5C1B2D]"
            >
              Review Services
              <ArrowUpRight size={16} />
            </Link>
          </div>
        )}
      </div>

      {/* Recent Users */}

      <div className="rounded-2xl border border-[#E8DDD0] bg-white p-5 md:p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-[#76243A]">
              Registered Users
            </h3>

            <p className="mt-1 text-sm text-[#94765F]">
              Overview of platform members
            </p>
          </div>

          <Link
            href="/admin-dashboard/users"
            className="flex items-center gap-1 text-sm font-medium text-[#76243A] hover:underline"
          >
            Manage Users
            <ArrowUpRight size={16} />
          </Link>
        </div>

        {users.length === 0 ? (
          <div className="py-8 text-center text-sm text-[#94765F]">
            No users found.
          </div>
        ) : (
          <div className="space-y-3">
            {users.slice(0, 5).map((user) => (
              <div
                key={user._id || user.id}
                className="flex items-center justify-between gap-4 rounded-xl bg-[#F8F5F0] p-4"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#E8DDD0] text-[#76243A]">
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={user.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <UserRound size={20} />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#76243A]">
                      {user.name || "Unnamed User"}
                    </p>

                    <p className="truncate text-xs text-[#94765F]">
                      {user.email}
                    </p>
                  </div>
                </div>

                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium capitalize ${
                    user.role === "admin"
                      ? "bg-[#76243A]/10 text-[#76243A]"
                      : user.role === "vendor"
                      ? "bg-[#647C67]/10 text-[#647C67]"
                      : "bg-[#94765F]/10 text-[#94765F]"
                  }`}
                >
                  {user.role || "customer"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}