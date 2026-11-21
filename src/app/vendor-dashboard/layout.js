
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import DashboardSidebar from "./DashboardSidebar";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default async function DashboardLayout({ children }) {
  // Check logged-in user
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Not logged in
  if (!session?.user) {
    redirect("/sign-in");
  }

  // Blocked account
  if (session.user.isBlocked === true) {
    redirect("/sign-in?blocked=true");
  }

  // Only vendor can access this dashboard
  if (session.user.role !== "vendor") {
    if (session.user.role === "admin") {
      redirect("/admin-dashboard");
    }

    if (session.user.role === "customer") {
      redirect("/dashboard");
    }

    redirect("/sign-in");
  }

  return (
    <SidebarProvider>
      <DashboardSidebar />

      <SidebarInset className="min-w-0 bg-[#F8F3EB]">
        <header className="flex h-16 shrink-0 items-center gap-4 border-b border-[#E8DDD0] px-5 md:px-8">
          <SidebarTrigger className="text-[#76243A]" />

          <div>
            <h1 className="font-semibold text-[#292321]">
              Vendor Workspace
            </h1>

            <p className="text-xs text-[#94765F]">
              Manage your wedding services
            </p>
          </div>
        </header>

        <main className="flex-1 p-5 md:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
