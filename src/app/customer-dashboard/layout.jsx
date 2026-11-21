
"use client";

import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import DashboardSidebar from "./DashboardSidebar";

export default function CustomerDashboardLayout({ children }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-[#F8F5F0]">

        {/* Customer Sidebar */}
        <DashboardSidebar />

        {/* Main Content */}
        <SidebarInset className="min-w-0 bg-[#F8F5F0]">

          {/* Dashboard Header */}
          <header className="flex h-14 items-center gap-3 border-b border-[#E8DDD0] bg-white px-4">
            <SidebarTrigger />

            <span className="font-semibold text-[#76243A]">
              Customer Dashboard
            </span>
          </header>

          {/* Page Content */}
          <main className="min-w-0 p-4 sm:p-6 lg:p-8">
            {children}
          </main>

        </SidebarInset>

      </div>
    </SidebarProvider>
  );
}
