
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarCheck,
  UserRound,
  Home,
} from "lucide-react";

export default function CustomerDashboardLayout({ children }) {
  const pathname = usePathname();

  const navLinks = [
    {
      name: "Dashboard",
      href: "/customer-dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "My Bookings",
      href: "/customer-dashboard/my-bookings",
      icon: CalendarCheck,
    },
    {
      name: "Profile Settings",
      href: "/customer-dashboard/profile",
      icon: UserRound,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F5F0] text-[#292321]">
      <div className="flex min-h-screen">

        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 border-r border-[#E7DCCF] bg-white p-6 md:flex md:flex-col">

          <Link href="/" className="mb-10">
            <h2 className="text-2xl font-bold text-[#76243A]">
              EverVow
            </h2>
            <p className="text-sm text-gray-500">
              Customer Dashboard
            </p>
          </Link>

          <nav className="space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;

              const isActive =
                pathname === link.href ||
                (link.href !== "/customer-dashboard" &&
                  pathname.startsWith(link.href));

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                    isActive
                      ? "bg-[#76243A] text-white"
                      : "text-gray-600 hover:bg-[#F8F5F0]"
                  }`}
                >
                  <Icon size={20} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-gray-600 transition hover:bg-[#F8F5F0]"
            >
              <Home size={20} />
              <span>Back to Home</span>
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">

          {/* Mobile Navigation */}
          <div className="border-b border-[#E7DCCF] bg-white p-4 md:hidden">
            <Link href="/" className="text-xl font-bold text-[#76243A]">
              EverVow
            </Link>

            <div className="mt-4 flex gap-2 overflow-x-auto">
              {navLinks.map((link) => {
                const Icon = link.icon;

                const isActive =
                  pathname === link.href ||
                  (link.href !== "/customer-dashboard" &&
                    pathname.startsWith(link.href));

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                      isActive
                        ? "bg-[#76243A] text-white"
                        : "bg-[#F8F5F0] text-gray-600"
                    }`}
                  >
                    <Icon size={16} />
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>

        </main>
      </div>
    </div>
  );
}
